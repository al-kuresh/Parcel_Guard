# 01 — Product Spec: ParcelGuard

> One line: **ParcelGuard helps Bangladeshi Facebook/online sellers stop losing money on cash-on-delivery (COD) orders that get returned.**

## 1. The problem (why this exists)

A typical f-commerce seller in Dhaka gets orders through Facebook Messenger, WhatsApp and phone calls. Their day looks like this:

1. Read a messy message like *"apu 2ta black L size, mirpur 10 er pase, 017XXXXXXXX"* and type it into a notebook or Google Sheet.
2. Copy-paste each order into a courier panel (Pathao for inside Dhaka, Steadfast/RedX for outside).
3. Hope the customer actually accepts the parcel. In COD markets a large share of parcels come back (return-to-origin, "RTO"), and the seller pays delivery **both ways**.
4. At the end of the week, check the courier's payout against what they *should* have received. Usually by hand, usually wrong.

Money leaks at every step: wrong addresses, repeat "fake" customers, unbooked orders, and unchecked payouts.

## 2. Who uses it

| Role | Who they are | What they do in ParcelGuard |
|---|---|---|
| **Owner** | Runs the shop | Everything, plus team, couriers, payouts, reports |
| **Moderator** | Staff who answers Messenger and takes orders | Create/confirm orders, book couriers. Cannot see payouts or change settings |

One person can belong to several shops (common: one owner runs 2–3 pages). This is called **multi-tenancy** — every shop's data is fully separated.

## 3. Features (MVP — what we build in 12 days)

### F-A. Accounts and shops
- Register, log in, log out. Stay logged in safely (refresh tokens).
- Create a shop; invite a moderator by email; switch between shops.

### F-B. Products and customers
- Simple product list (name, SKU, price, stock).
- Customers are identified by **phone number** (normalised to `+8801XXXXXXXXX`), because that's how BD sellers identify people.

### F-C. Orders
- Create an order manually, or **paste a raw message and let AI fill the form** (F-E).
- Order lifecycle: Draft → Confirmed → Booked → In transit → Delivered / Returned / Cancelled.
- List with search, filters (status, risk, date, courier) and pagination.

### F-D. Address normaliser
- Turns free text into **District → Upazila/Thana** using the official BD location list.
- Gives an **address quality score** and warns when the address is too vague to deliver.

### F-E. AI order intake
- Seller pastes a Messenger/WhatsApp message (Bangla, English or Banglish).
- An LLM returns **structured JSON** (name, phone, items, quantities, address, note).
- The output is **validated against a schema**. If it's wrong or incomplete, the seller sees highlighted fields to fix. The AI never saves anything on its own.
- Every AI call is logged with tokens, latency and cost.

### F-F. Return-risk score
- Each order gets a 0–100 risk score and a level (Low / Medium / High), **with reasons** a human can read, e.g. "2 of this customer's last 3 orders were returned", "Address has no thana".
- Rule-based in v1 (explainable, testable). A future version can learn the weights from data.

### F-G. Courier booking
- One button: book with Steadfast / Pathao / RedX / Mock.
- Each courier is an **adapter** behind one shared interface, so adding a courier means adding one file.
- Booking runs as a **background job** (queue), with retries, so a slow courier API never freezes the app.
- Courier status updates arrive by **webhook** and move the order through its lifecycle.

### F-H. COD reconciliation
- Owner uploads the courier's payout CSV.
- ParcelGuard matches each line to a shipment and flags **short-paid, over-paid, missing and unknown** parcels.

### F-I. Dashboard
- Today/7-day/30-day: orders, delivered, returned, return rate, COD pending, COD received, top risky customers.

### F-J. Audit log
- Who changed what and when (important when several staff touch money).

## 4. Out of scope (on purpose)

- Real payment gateway, SMS sending, Facebook Page API login. (Good "future work" talking points in interviews.)
- A customer-facing storefront. ParcelGuard is a **back-office tool**.
- Real courier credentials are optional: if you don't get sandbox access, the **Mock courier** behaves like a real one so the demo always works.

## 5. What "done" means for the whole project

- Live demo URL + demo login (`demo@parcelguard.app` / shown in README).
- `docker compose up` runs everything locally.
- Tests run in GitHub Actions on every push.
- README with architecture diagram, screenshots and a 2-minute video.
