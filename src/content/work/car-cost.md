---
title: Car Cost Comparison
dwg: JW-201
discipline: software
year: "2026"
status: released
rev: A
summary: A web calculator for the full cost of buying, leasing, or keeping a car, including Seattle taxes and the opportunity cost of every dollar.
role: Solo — design, implementation
stack: [Next.js, React, TypeScript, Tailwind CSS, Vercel]
order: 3
featured: false
---

## Problem

A web calculator, built outside work, that compares buying or leasing a car against keeping my current one over the full ownership horizon. Most car calculators compare monthly payments, which leaves out what actually separates two options over several years.

That means fuel type, itemized maintenance, depreciation, Washington's registration math, and what the money would have earned if it hadn't gone into the car. I wanted all of it on one page, with both options on equal terms.

## Approach

It's a single-page Next.js app. All the math lives in one module, `lib/calculations.ts`, and the UI just collects inputs and renders results.

- **Acquisition.** For a purchase: price, down payment, trade-in, APR, and term, with a standard amortized monthly payment. For a lease: down payment, monthly payment, and a duration that tracks the comparison horizon. The current car's sale proceeds and their investment growth are credited to the lease side.
- **Running costs.** Fuel for gas, electric, or plug-in hybrid at separate per-gallon and per-kWh rates. Flat insurance. Maintenance as an itemized list of interval items, charged from the current odometer forward.
- **Seattle taxes and registration.** Sales tax with the trade-in reducing the taxable amount. Registration is computed year by year from MSRP, model year, and weight class, using Washington's 1999 RTA depreciation schedule, the 2026 weight fees with their scheduled annual increase, and EV/hybrid surcharges.
- **Resale.** An age-based depreciation curve with Low/Medium/High/Custom presets, and a mileage adjustment that tapers to zero as the car approaches 200k miles.
- **Opportunity cost.** Every cash outflow is placed in the month it happens and compounded at an expected market return for the rest of the horizon. Both cars get the same treatment.

```ts
const missedGrowth = (amount: number, month: number) => {
  const remaining = inputs.totalMonths - month;
  if (remaining <= 0 || amount <= 0) return 0;
  return amount * (Math.pow(1 + monthlyRate, remaining) - 1);
};
```

The function returns only the growth that was missed, because the principal is already counted elsewhere. That keeps the totals from counting money twice.

## Result

A working comparison tool, set up to auto-deploy to Vercel on every push to `main`. It compares the total cost of the two options, with each component itemized. Defaults are tuned for Seattle.

## Notes

- The tax and registration logic is deliberately Seattle-specific. Another city would need its own rates and local fees.
- The depreciation curve is a heuristic. It isn't a substitute for market listings, and the README says so.
- Maintenance events are placed by the month in which the odometer crosses each interval, so they compound from the right month and not from an annual average.
