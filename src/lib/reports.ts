
import { formatMoney } from "@/lib/currency";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DailyEntry, InventoryItem, Profile } from "@/lib/finance";
import {
  computeHealthScore,
  computeAlerts,
  buildExpenseBreakdown,
} from "@/lib/insights";
import fullLogo from "@/assets/kashie-full.png.asset.json";

type ReportKind = "pnl" | "expenses" | "inventory" | "health";

interface BuildArgs {
  kind: ReportKind;
  entries: DailyEntry[];
  inventory: InventoryItem[];
  profile: Profile | null;
  startDate?: string;
  endDate?: string;
}

const money = (n: number, currency?: string | null) =>
  currency ? formatMoney(n, currency) : formatMoney(n);

const numberValue = (value: unknown) => {
  const result = Number(value ?? 0);
  return Number.isFinite(result) ? result : 0;
};

const totalRevenue = (entries: DailyEntry[]) =>
  entries.reduce((sum, entry) => sum + numberValue(entry.revenue), 0);

const totalExpenses = (entries: DailyEntry[]) =>
  entries.reduce((sum, entry) => sum + numberValue(entry.expenses), 0);

const totalProfit = (entries: DailyEntry[]) =>
  totalRevenue(entries) - totalExpenses(entries);

function filterEntries(
  entries: DailyEntry[],
  startDate?: string,
  endDate?: string,
) {
  return entries
    .filter((entry) => {
      if (startDate && entry.date < startDate) return false;
      if (endDate && entry.date > endDate) return false;
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

function periodLabel(startDate?: string, endDate?: string) {
  if (startDate && endDate) return `${startDate} to ${endDate}`;
  if (startDate) return `From ${startDate}`;
  if (endDate) return `Up to ${endDate}`;
  return "All recorded dates";
}

function header(
  doc: jsPDF,
  title: string,
  profile: Profile | null,
  logo: Uint8Array,
  period?: string,
) {
  doc.setFillColor(91, 97, 64);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.addImage(logo, "PNG", 40, 3, 64, (64 * 768) / 1374);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("AI CFO Report", 40, 46);

  doc.setFontSize(11);
  const rightX = doc.internal.pageSize.getWidth() - 40;
  doc.text(profile?.business_name ?? "Your business", rightX, 30, {
    align: "right",
  });
  doc.setFontSize(9);
  doc.text(
    new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    rightX,
    46,
    { align: "right" },
  );

  doc.setTextColor(23, 23, 23);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, 40, 90);

  if (period) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(`Reporting period: ${period}`, 40, 105);
  }
}

export async function buildReportPdf({
  kind,
  entries,
  inventory,
  profile,
  startDate,
  endDate,
}: BuildArgs): Promise<jsPDF> {
  const response = await fetch(fullLogo.url);
  if (!response.ok) throw new Error("Couldn't load the report logo");
  const logo = new Uint8Array(await response.arrayBuffer());
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const selectedEntries =
    kind === "pnl" || kind === "expenses"
      ? filterEntries(entries, startDate, endDate)
      : entries;

  const currency = profile?.currency;

  if (kind === "pnl") {
    header(doc, "Profit & Loss Statement", profile, logo, periodLabel(startDate, endDate));

    const revenue = totalRevenue(selectedEntries);
    const expenses = totalExpenses(selectedEntries);
    const profit = revenue - expenses;

    autoTable(doc, {
      startY: 115,
      theme: "plain",
      body: [
        ["Total recorded sales", money(revenue, currency)],
        ["Total recorded expenses", money(expenses, currency)],
        ["Net profit / loss", money(profit, currency)],
        ["Days with records", `${selectedEntries.length}`],
      ],
      styles: { fontSize: 11, cellPadding: 8 },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [71, 85, 105] },
        1: { halign: "right" },
      },
    });

    autoTable(doc, {
      head: [["Date", "Recorded sales", "Expenses", "Net profit / loss"]],
      body: selectedEntries.map((entry) => [
        entry.date,
        money(numberValue(entry.revenue), currency),
        money(numberValue(entry.expenses), currency),
        money(numberValue(entry.revenue) - numberValue(entry.expenses), currency),
      ]),
      bodyStyles: { overflow: "linebreak" },
      styles: { fontSize: 8, cellPadding: 5 },
      headStyles: { fillColor: [91, 97, 64], textColor: 255 },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      margin: { bottom: 40 },
    });

    const finalY =
      (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 150;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Prepared from records entered in Kashie. This is an internal management report, not an audited financial statement.",
      40,
      Math.min(finalY + 18, doc.internal.pageSize.getHeight() - 32),
      { maxWidth: doc.internal.pageSize.getWidth() - 80 },
    );
  }

  if (kind === "expenses") {
    header(doc, "Expense Breakdown Report", profile, logo, periodLabel(startDate, endDate));
    const breakdown = buildExpenseBreakdown(selectedEntries);
    const total = breakdown.reduce((sum, item) => sum + item.value, 0);

    autoTable(doc, {
      startY: 115,
      head: [["Category", "Amount", "% of total"]],
      body: breakdown.map((item) => [
        item.name,
        money(item.value, currency),
        total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : "—",
      ]),
      styles: { fontSize: 10, cellPadding: 7 },
      headStyles: { fillColor: [91, 97, 64], textColor: 255 },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "right" } },
      margin: { bottom: 40 },
    });
  }

  if (kind === "inventory") {
    header(doc, "Inventory Report", profile, logo);

    autoTable(doc, {
      startY: 110,
      head: [["Item", "Quantity", "Unit", "Status"]],
      body: inventory.map((item) => [
        item.item_name,
        `${item.quantity}`,
        item.unit,
        Number(item.quantity) <= 5 ? "Low" : "OK",
      ]),
      styles: { fontSize: 10, cellPadding: 7 },
      headStyles: { fillColor: [91, 97, 64], textColor: 255 },
      columnStyles: { 1: { halign: "right" } },
      margin: { bottom: 40 },
    });
  }

  if (kind === "health") {
    header(doc, "Business Health Report", profile, logo);
    const health = computeHealthScore(entries);
    const alerts = computeAlerts(entries, inventory);

    autoTable(doc, {
      startY: 110,
      theme: "plain",
      body: [
        ["Health score", `${health.score} / 100`],
        ["Rating", health.label],
        ["Days analysed", `${entries.length}`],
        ["Active alerts", `${alerts.length}`],
      ],
      styles: { fontSize: 11, cellPadding: 8 },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [71, 85, 105] },
        1: { halign: "right" },
      },
    });

    if (alerts.length > 0) {
      autoTable(doc, {
        head: [["Severity", "Alert", "Detail"]],
        body: alerts.map((alert) => [
          alert.severity.toUpperCase(),
          alert.title,
          alert.detail,
        ]),
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: [91, 97, 64], textColor: 255 },
        margin: { bottom: 40 },
      });
    }
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated by Kashie · Page ${page} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: "center" },
    );
  }

  return doc;
}

export async function exportReportPdf(args: BuildArgs, filename: string) {
  const doc = await buildReportPdf(args);
  doc.save(filename);
}

export async function printReportPdf(args: BuildArgs) {
  const w = window.open("", "_blank");

  try {
    const doc = await buildReportPdf(args);
    const blob = doc.output("bloburl");
    if (!w) return;
    w.addEventListener("load", () => w.print());
    w.location.href = blob as unknown as string;
  } catch (error) {
    w?.close();
    throw error;
  }
}
