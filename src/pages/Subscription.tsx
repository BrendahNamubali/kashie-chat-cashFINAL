
import { useState } from "react";
import { CreditCard, ArrowRight, ShieldCheck, Check } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

const features = [
  "Daily sales and expense tracking",
  "Ask Kashie about your business",
  "Stock tracking and business reports",
  "Tax preparation and draft PDFs",
  "Forecast and financing planning",
];

export default function Subscription() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile-money");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 md:px-8 space-y-7">
        <header className="border-b border-border pb-6">
          <CreditCard className="size-5 text-primary mb-3" />
          <h1 className="text-3xl font-semibold">Your subscription</h1>
          <p className="text-muted-foreground mt-2">
            A little clarity for the business you built.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground">Kashie Business</p>

          <p>
            <span className="text-3xl font-semibold">UGX 40,000</span>
            <span className="text-sm text-muted-foreground"> / month</span>
          </p>

          <p className="text-sm font-medium">
            Advertised offer: 7-day free trial
          </p>

          <div className="space-y-3 pt-2">
            <h2 className="font-semibold">What’s included</h2>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="size-4 shrink-0 text-primary mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-4 space-y-2">
            <h2 className="font-semibold">Clear before you commit</h2>
            <p className="text-sm text-muted-foreground">
              Online subscription checkout is not connected yet. This page
              does not charge you or activate a paid plan or free trial.
            </p>
            <p className="text-sm text-muted-foreground">
              Before paid subscriptions become available, you’ll be shown
              the confirmed plan details, final charges, when your trial
              begins and ends, and how recurring billing works.
            </p>
          </div>
        </section>

        {submitted ? (
          <section className="rounded-xl border border-border p-6 space-y-3">
            <h2 className="text-lg font-semibold">Details checked</h2>
            <p className="text-sm text-muted-foreground">
              Your details have only been checked in this form. They have not
              been saved or sent, and no payment or trial has started.
            </p>
            <p className="text-sm text-muted-foreground">
              Online checkout is not connected yet. Please return when payment
              setup is available.
            </p>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Review details
            </Button>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Your details</h2>
              <p className="text-sm text-muted-foreground">
                Set up your business details before checkout.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full name
              </label>
              <input
                id="fullName"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-medium">
                Business name
              </label>
              <input
                id="businessName"
                required
                autoComplete="organization"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Your business name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="+256..."
              />
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">
                Preferred payment method
              </legend>

              <label className="flex items-center gap-3 rounded-md border border-border p-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile-money"
                  checked={paymentMethod === "mobile-money"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="text-sm">Mobile Money</span>
              </label>

              <label className="flex items-center gap-3 rounded-md border border-border p-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="text-sm">Bank card</span>
              </label>
            </fieldset>

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Payment status
              </p>
              <p className="text-sm text-muted-foreground">
                Checkout is not connected yet. Submitting this form will not
                save your details, charge you, or activate a trial.
              </p>
            </div>

            <Button type="submit" className="w-full">
              Review details <ArrowRight className="size-4" />
            </Button>
          </form>
        )}

        <section className="border-t border-border pt-5 space-y-2">
          <h2 className="font-semibold">Your records stay yours</h2>
          <p className="text-sm text-muted-foreground">
            This form does not change your account access or saved business data.
          </p>
        </section>
      </div>
    </AppLayout>
  );
}
