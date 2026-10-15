
import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, ArrowRight, ShieldCheck } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

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
            Set up your business details before checkout.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-card p-6 space-y-3">
          <p className="text-sm text-muted-foreground">Kashie Business</p>
          <p>
            <span className="text-3xl font-semibold">UGX 40,000</span>
            <span className="text-sm text-muted-foreground"> / month</span>
          </p>
          <p className="text-sm font-medium">Advertised offer: 7-day free trial</p>
          <p className="text-sm text-muted-foreground">
            Before any payment, the checkout must confirm when your trial begins,
            when charges start, and how recurring billing works.
          </p>
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
            <h2 className="text-lg font-semibold">Your details</h2>

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
              <legend className="text-sm font-medium">Preferred payment method</legend>

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
          <Button asChild variant="outline">
            <Link to="/pricing">Back to pricing</Link>
          </Button>
        </section>
      </div>
    </AppLayout>
  );
}
