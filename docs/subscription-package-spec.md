# TBM AI Visualizer — Package System Specification
**Full-Stack & UI/UX Design Reference Document · v1.1**

| Field | Value |
|---|---|
| Project | TBM — AI Visualizer Feature |
| Document Type | Full-Stack + UX Specification |
| Prepared For | Backend Developer & UI/UX Designer |
| Version | 1.1 — Includes pricing config, discount & admin systems |
| Status | Draft — For Review |

---

## 1. Overview

The TBM AI Visualizer is a premium feature that allows users to generate AI-powered design visualizations — images or videos — of home renovation and materials concepts. Users must be enrolled in a package tier to access generation. This document defines the package tiers, pricing model, admin configuration system, discount/promotional logic, subscription state machine, and all expected behavior from both the backend and the frontend.

This document is split into two sections:
- **Section A** — For the Backend Developer: data models, API contracts, pricing config, discount engine, subscription state machine, enforcement, and cron jobs.
- **Section B** — For the UI/UX Designer: page layouts, component states, pricing display behavior, discount badge/copy, admin panel UI, and design system conventions.

---

## 2. Package Tiers & Pricing

### 2.1 Pricing Philosophy — No Hardcoded Values

All prices, generation quotas, billing cycle discounts, and promotional discount values **MUST be stored in the database and fetched at runtime**. The frontend must never hardcode any monetary value, quota number, or percentage. This allows the admin to update any figure at any time without requiring a code deployment.

> The frontend fetches pricing data from a dedicated endpoint on page load. All price displays are driven entirely by the API response. If the API is unavailable, the UI shows a loading/error state — it does not fall back to hardcoded values.

### 2.2 Tier Summary

| Tier | Monthly Price | Yearly Price | Generation Quota / Period |
|---|---|---|---|
| Economy | Free | N/A | 1 (one-time, non-renewable) |
| Premium | ₦29,990/mo | ₦23,990/mo * | 50 generations / billing period |
| Luxury | ₦79,990/mo | ₦63,990/mo * | Unlimited generations |

> \* Yearly prices shown as effective monthly cost (billed annually). All values above are **defaults stored in the database**. Admin can update any figure at any time via the Admin Panel. Frontend always reads from the API.

> Yearly effective monthly rate = `annualPrice / 12`. The yearly total and the per-month cost should both be shown on the UI cards. Example: `'₦23,990/mo — ₦287,880 billed annually'`.

---

## 3. Pricing Configuration & Admin Control

### 3.1 PricingConfig Data Model

A `PricingConfig` table stores all tunable values. There is one active config record per tier. The admin updates these records through the Admin Panel; all changes take effect immediately on the next page load for users.

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| tier | Enum | `economy \| premium \| luxury` |
| monthlyPrice | Decimal | Price in NGN for monthly billing (e.g. `29990`) |
| annualPrice | Decimal | Total price billed annually (e.g. `287880` for Premium) |
| yearlyMonthlyEquiv | Decimal (computed) | `annualPrice / 12` — shown on card as effective monthly rate. Can be computed or stored. |
| generationsAllowed | Integer \| null | Quota per billing period. `null` = unlimited (Luxury) |
| yearlyDiscountPct | Decimal | Percentage saved vs monthly, shown on yearly toggle badge (e.g. `20.0` for 20%) |
| isActive | Boolean | Whether this tier is currently available for new subscriptions |
| updatedAt | DateTime | Last admin update timestamp |
| updatedBy | UUID FK | Admin user who last modified this record |

### 3.2 Admin Pricing Management API

#### `GET /api/v1/admin/pricing`
Returns all `PricingConfig` records. Admin-authenticated only.

**Response:** array of `{ tier, monthlyPrice, annualPrice, yearlyMonthlyEquiv, generationsAllowed, yearlyDiscountPct, isActive, updatedAt, updatedBy }`

#### `PUT /api/v1/admin/pricing/:tier`
Updates pricing config for a specific tier. Any subset of fields may be updated.

| | |
|---|---|
| Auth | Admin role required |
| Request Body | `{ monthlyPrice?, annualPrice?, generationsAllowed?, yearlyDiscountPct?, isActive? }` |
| Response | `{ tier, updated fields, updatedAt }` |
| Side Effects | Change takes effect immediately. Log the change with admin `userId` and timestamp. No cache invalidation needed — frontend always fetches fresh. |

#### `GET /api/v1/pricing` (Public)
Public endpoint. Returns all active tier pricing for the package cards. No auth required.

**Response:**
```json
{
  "economy": { "price": 0 },
  "premium": { "monthlyPrice", "annualPrice", "yearlyMonthlyEquiv", "yearlyDiscountPct", "generationsAllowed" },
  "luxury": { "monthlyPrice", "annualPrice", "yearlyMonthlyEquiv", "yearlyDiscountPct", "generationsAllowed" },
  "activeDiscount": { "..." } | null
}
```

> The `activeDiscount` field returns the currently active promotional discount if one is running (see Section 4). The frontend uses this to display the discounted price inline on the cards.

### 3.3 Admin Panel UI — Pricing Section

The Admin Panel must include a dedicated **'Pricing & Packages'** settings section. Refer to Section B (UI/UX) for full layout spec. Functionally it must support:

- View current prices and quotas for all three tiers in an editable table or card layout
- Inline editing — click a value to edit it, save with confirmation
- An audit log showing the last N price changes (who changed what, when, old vs new value)
- Toggle to activate or deactivate a tier (if deactivated, the card is hidden on the public page)
- Preview mode — see what the package cards will look like to users with the new prices before saving

---

## 4. Discount & Promotional System

### 4.1 Overview

The platform supports time-bound promotional discounts that can be applied to any paid tier and billing cycle. Discounts can be created for seasonal events (e.g. Black Friday, New Year), custom date ranges, or one-off campaigns. When a discount is active, the frontend displays the discounted price prominently alongside the original struck-through price.

There can be **at most one active discount per tier per billing cycle** at any given time. The system must prevent overlapping discounts for the same tier/cycle combination.

### 4.2 Discount Data Model

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | String | Internal name for the campaign (e.g. `'Black Friday 2025'`, `'Summer Sale'`) |
| tier | Enum \| null | `economy \| premium \| luxury \| null` (null = applies to all paid tiers) |
| billingCycle | Enum \| null | `monthly \| yearly \| null` (null = applies to both cycles) |
| discountType | Enum | `percentage \| fixed_amount` |
| discountValue | Decimal | If percentage: 0–100 (e.g. `25.0` = 25% off). If fixed_amount: naira value off (e.g. `1000` = ₦1,000 off). |
| startDate | DateTime | When the discount becomes active (inclusive) |
| endDate | DateTime | When the discount expires (exclusive — discount inactive from this moment) |
| promoCode | String \| null | Optional code user must enter to claim discount. If null, discount is auto-applied. |
| maxRedemptions | Integer \| null | Max number of subscriptions this discount can be applied to. `null` = unlimited. |
| redemptionCount | Integer | Number of times this discount has been successfully applied. Default `0`. |
| isActive | Boolean | Admin toggle to manually enable/disable. Even within date range, discount won't apply if `false`. |
| displayLabel | String \| null | Short badge text shown on UI (e.g. `'Black Friday'`, `'25% Off'`, `'Limited Time'`). If null, system uses default. |
| createdBy | UUID FK | Admin user who created this discount |
| createdAt | DateTime | Record creation timestamp |

### 4.3 Discount Engine Logic

#### 4.3.1 Resolving Active Discount

When the public `/api/v1/pricing` endpoint is called, the backend resolves the active discount as follows:

1. Query all discounts where `isActive=true AND startDate <= now() AND endDate > now()`
2. If `promoCode` is set, only include in response if user has provided the code — otherwise omit from default pricing response
3. If multiple discounts match the same tier/cycle (should not happen if admin UI prevents overlap, but handle gracefully): apply the one with the higher `discountValue`
4. Return the resolved discounted price alongside the original price — do **NOT** return only the discounted price

> The API response always includes both `originalPrice` and `discountedPrice` when a discount is active. This allows the frontend to display the strikethrough original and the highlighted discounted price without any frontend calculation.

#### 4.3.2 Applying Discount at Checkout

When a user initiates a subscription (`POST /api/v1/subscription/subscribe`):

- If a `promoCode` was provided, validate it against the `Discount` table — check `isActive`, date range, tier/cycle match, and `maxRedemptions`
- If the discount is auto-applied (no `promoCode`), backend re-validates the active discount at checkout time to prevent race conditions (discount may have expired between page load and submit)
- If discount is valid: apply the reduced price to the payment intent, store `discountId` on the `Subscription` record, increment `redemptionCount`
- If discount expired between page load and checkout: return error `{ code: 'DISCOUNT_EXPIRED', message: 'This offer has ended. Original price will apply.' }`. Frontend shows an inline error and updates the displayed price.

#### 4.3.3 Discount on Renewal

Discounts do **not** automatically carry over to renewal cycles. On auto-renewal or manual renewal, the standard price applies unless a new discount is active at renewal time. This is consistent with standard SaaS practice.

### 4.4 Discount Admin API

#### `GET /api/v1/admin/discounts`
Returns all discounts, sorted by `startDate` desc. Supports query params: `?status=active|scheduled|expired|all`, `?tier=premium|luxury`

#### `POST /api/v1/admin/discounts`
Creates a new discount campaign.

| | |
|---|---|
| Auth | Admin role required |
| Request Body | `{ name, tier?, billingCycle?, discountType, discountValue, startDate, endDate, promoCode?, maxRedemptions?, displayLabel? }` |
| Validation | `startDate` must be before `endDate`. Reject if overlapping discount exists for same `tier+billingCycle`. `discountValue` must be > 0 and ≤ 100 if percentage type. |
| Response | `{ discount object }` |

#### `PUT /api/v1/admin/discounts/:id`
Updates a discount. Can update `name`, dates, value, `isActive`. Cannot update `tier` or `billingCycle` after creation (create a new one instead).

#### `DELETE /api/v1/admin/discounts/:id`
Soft-deletes a discount (sets `isActive=false`, preserves record for audit). Returns `200` on success.

### 4.5 Promo Code Flow

If an admin creates a discount with a `promoCode`:

1. The package cards show a promo code input field below the CTA button (or in a collapsed expandable section)
2. User enters code and clicks 'Apply' — frontend calls `GET /api/v1/pricing?promoCode=CODE`
3. Backend validates and returns the discounted pricing if valid
4. If valid: card updates to show discounted price with badge `'Promo Applied'`
5. If invalid/expired: inline error `'Code not valid or expired'`
6. On checkout, the `promoCode` is sent in the request body for final server-side validation

---

## 5. End-to-End User Flow

### 5.1 Discovery — AI Visualizer Landing Page

When a user navigates to the AI Visualizer page, they see the package selection landing if they have no active subscription, or the generation interface if they do.

The package selection landing displays three cards side by side (Economy, Premium, Luxury). All prices are loaded from `GET /api/v1/pricing` on mount. Each card contains:

- Tier name and badge
- Tagline
- Benefits list
- Price display — driven entirely by API response (see Section B for exact display format)
- Monthly / Yearly billing toggle — Premium and Luxury only
- Discount badge if `activeDiscount` is present in API response
- CTA button
- Promo code field (if applicable)

### 5.2 Economy Activation

User clicks 'Activate Free' → backend creates subscription (`tier=economy`, `generationsAllowed=1`, `generationsUsed=0`) → redirect to generation interface → after first generation, `generationsUsed=1` → any further attempt shows the upgrade wall.

### 5.3 Paid Subscription

User selects Premium or Luxury, chooses billing cycle → checkout/payment → backend creates subscription record with resolved pricing (after any active discount) → redirect to generation interface with full access.

### 5.4 Upgrade Flow

Economy-exhausted or expired user attempting to generate sees the upgrade wall modal: tier comparison cards (live prices from API), billing toggle, discount badge if applicable, CTA per tier.

### 5.5 Dashboard — Subscription Management

The dashboard Subscription panel shows: tier, status chip, billing cycle, next renewal date, generations used vs allowed, and action buttons. See Section B3 for all state variations.

### 5.6 Cancellation

Cancel button → confirmation modal with optional questionnaire (reason + free text) → backend sets `status=canceled`, `accessUntil=periodEnd` → dashboard updates → access continues until `accessUntil`.

### 5.7 Expiry & Re-engagement

On expiry: generation endpoint returns `403 SUBSCRIPTION_REQUIRED` → AI Visualizer shows 'Access Paused' state → reminder email schedule begins (see Section A / Cron).

---

## Section A — Backend Developer Specification

### A1. Data Models Summary

#### A1.1 Subscription

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| userId | UUID FK | References user account |
| tier | Enum | `economy \| premium \| luxury` |
| status | Enum | `active \| expired \| canceled \| paused` |
| billingCycle | Enum \| null | `monthly \| yearly \| null` (Economy) |
| pricePaid | Decimal \| null | Actual price charged at subscription time (after discount) |
| discountId | UUID FK \| null | Reference to `Discount` record if one was applied |
| generationsAllowed | Integer \| null | Snapshot of quota at subscription time. `null` = unlimited. |
| generationsUsed | Integer | Incremented on each successful generation |
| periodStart | DateTime \| null | Start of current billing period |
| periodEnd | DateTime \| null | End of current billing period |
| accessUntil | DateTime \| null | For canceled subs: access until this date |
| canceledAt | DateTime \| null | When the user triggered cancellation |
| cancelReason | String \| null | Selected reason from cancellation questionnaire |
| cancelFeedback | Text \| null | Free-text feedback at cancellation |
| renewedAt | DateTime \| null | Date of last renewal |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last modified timestamp |

#### A1.2 PricingConfig — see Section 3.1
#### A1.3 Discount — see Section 4.2

### A2. Key API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/pricing` | GET (public) | Fetch all active tier pricing + active discount for package cards |
| `/api/v1/pricing?promoCode=X` | GET (public) | Validate promo code and return discounted pricing if valid |
| `/api/v1/subscription/current` | GET (auth) | Current user's subscription state |
| `/api/v1/subscription/activate` | POST (auth) | Activate Economy tier |
| `/api/v1/subscription/subscribe` | POST (auth) | Initiate paid subscription with payment |
| `/api/v1/subscription/cancel` | POST (auth) | Cancel active subscription |
| `/api/v1/subscription/renew` | POST (auth) | Renew expired or canceled subscription |
| `/api/v1/ai/generate` | POST (auth) | Generate — enforces subscription gate + quota |
| `/api/v1/admin/pricing` | GET (admin) | View all PricingConfig records |
| `/api/v1/admin/pricing/:tier` | PUT (admin) | Update pricing for a tier |
| `/api/v1/admin/discounts` | GET (admin) | List all discount campaigns |
| `/api/v1/admin/discounts` | POST (admin) | Create a discount campaign |
| `/api/v1/admin/discounts/:id` | PUT (admin) | Update a discount campaign |
| `/api/v1/admin/discounts/:id` | DELETE (admin) | Deactivate a discount campaign |

### A3. Subscription State Machine

| From State | Trigger | To State |
|---|---|---|
| None | User activates Economy | `active` (Economy) |
| None / Economy used | User subscribes paid tier | `active` (Premium/Luxury) |
| `active` (paid) | User cancels | `canceled` (access until `periodEnd`) |
| `canceled` | `accessUntil` passes (cron) | `expired` |
| `active` | `periodEnd` passes, no renewal (cron) | `expired` |
| `expired \| canceled` | User renews/subscribes | `active` |
| `active` (paid) | Auto-renew succeeds (cron) | `active` (new period, fresh quota) |
| `active` (paid) | Auto-renew fails (payment) | `paused` |

### A4. Background Jobs (Cron)

#### A4.1 Expiry Checker — runs daily
- Query subscriptions where `status=active AND periodEnd < now()` → attempt auto-renewal; if fails, set `status=expired`
- Query subscriptions where `status=canceled AND accessUntil < now()` → set `status=expired`

#### A4.2 Discount Expiry Cleanup — runs hourly
- Query discounts where `endDate < now() AND isActive=true` → set `isActive=false`
- This ensures no discount is accidentally applied after its end date even if the admin forgets to deactivate it

#### A4.3 Reminder Email Schedule

| Timing | Email |
|---|---|
| 3 days before expiry | 'Your TBM plan expires in 3 days' — renewal CTA |
| 1 day before expiry | 'Last chance — access ends tomorrow' — urgency + renewal CTA |
| Day of expiry | 'Your TBM access has ended' — reactivation CTA |
| 3 days after expiry | 'We miss you at TBM' — soft win-back |
| 7 days after expiry | 'Your renovation vision is waiting' — final re-engagement |

### A5. Enforcement Rules

- Generation endpoint checks subscription gate **server-side on every request** — client state is never trusted
- Economy: `generationsAllowed=1`; any request where `generationsUsed >= 1` returns `403 QUOTA_EXCEEDED`
- Expired/paused subscriptions: return `403 SUBSCRIPTION_REQUIRED`
- Canceled subscriptions: allowed until `accessUntil`; after that, `SUBSCRIPTION_REQUIRED`
- Pricing must always be read from `PricingConfig` — no prices or quotas may be hardcoded in backend logic
- Discount validation must re-run at checkout time (not just at page-load pricing fetch) to prevent applying expired discounts

---

## Section B — UI/UX Designer Specification

### B1. Package Cards — Pricing Display

All prices shown on the package cards come exclusively from the `GET /api/v1/pricing` API response. The UI must handle the following display states:

#### B1.1 No Active Discount
- Economy: `'Free to activate'` — large, prominent green text
- Premium Monthly: `'₦29,990/month'` (or whatever `monthlyPrice` returns)
- Premium Yearly: `'₦23,990/month — ₦287,880 billed annually'` + `'Save 20%'` chip (or whatever `yearlyDiscountPct` returns)
- Luxury Monthly/Yearly: same pattern at Luxury price points

#### B1.2 Active Promotional Discount
- Show the original price with a strikethrough in muted text: `'₦29,990'`
- Show the discounted price prominently in the accent color: `'₦22,490/month'`
- Show the discount badge from `displayLabel` field (e.g. `'Black Friday'`, `'25% Off'`)
- If the discount has an `endDate`, show a countdown or `'Ends [date]'` note below the price
- Yearly cards: apply discount to the effective monthly equivalent and the annual total

> Both `originalPrice` and `discountedPrice` are returned by the API — the frontend does not calculate the discounted amount itself. Simply display what the API returns.

#### B1.3 Loading State
- While pricing API is loading: show skeleton loaders for price fields
- Do not show any price placeholder text like `'₦0.00'` or `'TBD'`
- CTA buttons should be disabled while prices are loading

#### B1.4 Error State
- If pricing API fails: show an error message on the cards (`'Unable to load pricing. Please refresh.'`)
- Do not show any price. Do not allow subscription initiation without confirmed pricing.

### B2. Billing Cycle Toggle

A toggle at the top of the package selection section switches between Monthly and Yearly. Design requirements:

- Toggle has two states: `'Monthly'` and `'Yearly'`. Yearly state shows a `'Save X%'` badge next to the label (X from API)
- Switching the toggle updates Premium and Luxury card prices smoothly — use a subtle fade/cross-fade animation
- Economy card is unaffected — no toggle indicator
- If a promotional discount is active, it applies to the currently selected billing cycle's price

### B3. Dashboard — Subscription Panel States

#### B3.1 Active (Paid)
- Tier name chip (blue for Premium, purple for Luxury), green 'Active' status badge
- Billing cycle and next renewal date
- Generations progress: `'X of Y used this period'` — use a progress bar
- For Luxury (unlimited): show `'Unlimited generations'` with no progress bar
- Actions: `'Cancel Subscription'` (outlined, red-tinted) | `'Upgrade'` link if on Premium

#### B3.2 Active (Economy — quota not used)
- 'Economy — Free Tier', green 'Active' badge, `'0 of 1 generation used'`
- Action: 'Upgrade to Premium or Luxury' — primary CTA

#### B3.3 Economy — Quota Exhausted
- 'Economy', orange 'Quota Used' badge
- 'You have used your one free generation.'
- Action: 'Upgrade Now' — prominent primary button

#### B3.4 Canceled (Within Access Period)
- Tier name, yellow 'Canceled' badge, `'Active until [date]'` in muted text
- Action: 'Reactivate' button (primary)

#### B3.5 Expired
- Tier name grayed out, red 'Expired' badge, `'Access ended [date]'`
- Action: 'Renew Plan' — large prominent primary CTA

#### B3.6 Paused (Payment Failed)
- Red 'Paused' badge, 'We couldn't renew your subscription. Please update your payment method.'
- Action: 'Update Payment Method'

### B4. Cancellation Flow Modal

| Step | Content |
|---|---|
| Step 1 | Confirmation: 'Are you sure? Your access continues until [date].' — show date prominently |
| Step 2 | Questionnaire (optional): reason multi-choice + free text. Skip link available. |
| Step 3 | Final action: 'Yes, Cancel Subscription' (destructive) \| 'Keep My Subscription' (primary) |
| Post-Cancel Toast | 'Subscription canceled. You have access until [date].' — warning style toast |

### B5. Admin Panel — Pricing & Discounts UI

#### B5.1 Pricing Management
- Editable table showing Economy, Premium, Luxury rows with columns: Monthly Price, Annual Price, Yearly Equiv/Month, Yearly Discount %, Generations/Period, Status (Active/Inactive)
- Each cell is inline-editable — click to edit, Tab to move to next field, Save button per row or globally
- Audit log section below the table: `'Last updated [date] by [admin name] — Monthly changed from ₦X to ₦Y'`
- Preview button: opens a modal showing the package cards as users will see them with the new prices

#### B5.2 Discount Campaigns
- List view of all discount campaigns with columns: Name, Tier, Billing Cycle, Type, Value, Start, End, Redemptions, Status badge (Active/Scheduled/Expired)
- 'New Discount' button opens a creation form/modal
- Creation form fields: Campaign Name, Apply to (Tier dropdown + All paid tiers option), Billing Cycle, Discount Type (% or fixed), Value, Start Date, End Date, Promo Code (optional), Max Redemptions (optional), Display Label
- Validation: system prevents creation if overlapping discount exists for same tier + billing cycle combination — show clear error
- 'Deactivate' action per row — soft delete (preserves record)
- Status is visually clear: green chip for Active, blue for Scheduled (future start), gray for Expired

### B6. Upgrade Wall Modal
- Heading: 'You've reached your limit' (Economy) or 'Your access has ended' (expired)
- Body: brief explanation, then compact Premium + Luxury cards side-by-side
- All prices from API — same loading/error/discount display rules as main cards
- Billing cycle toggle inside the modal
- CTA per card: 'Choose Premium' / 'Choose Luxury'
- Not dismissible by default — exits only via plan selection or Escape key

### B7. Design System Notes

| Token | Value |
|---|---|
| Font | `font-manrope` throughout |
| Primary color | `bg-primary` / `text-primary` for accent elements |
| Body text | `text-text-black` |
| Dark areas | `#1A2340` for dashboard/admin card headers |
| Economy color | `#1A7A4A` (green) |
| Premium color | `#1A4A8A` (blue) |
| Luxury color | `#7B2FBE` (purple) |
| Discount badge | `bg-amber-500 text-white` — warm amber/gold to signal urgency |
| Strikethrough price | `text-gray-400` with `line-through` decoration |
| Animations | Framer Motion with `whileInView`, `viewport={{ once: true }}`, staggered delays. Price toggle: `AnimatePresence` with crossfade. |
| Toast | `components/shared/toast.jsx` — success/error/warning/info, top-center |
| Responsiveness | All components must be responsive — admin tables scroll horizontally on mobile |

---

## 6. Open Items

All pricing values in Section 2.2 are initial defaults for development and testing. Admin must update these before launch. The following require product team decision before go-live:

| # | Area | Decision Needed |
|---|---|---|
| 1 | Final Pricing | Confirm production prices for Premium and Luxury (monthly + annual) before launch |
| 2 | Generation Quotas | Confirm Premium quota (currently 50/period) and whether Luxury is truly unlimited |
| 3 | Auto-Renew Default | Should paid subscriptions auto-renew by default, or require explicit opt-in? |
| 4 | Downgrade Policy | Can users downgrade Luxury → Premium? Effective immediately or end of period? |
| 5 | Payment Provider | Confirm payment gateway (Stripe, Paystack, etc.) — discount engine implementation may vary |
| 6 | Win-back Promo | Should win-back emails include a discount code? Admin can create these via the Discount system. |
| 7 | Cancellation Reasons | Finalize the multi-choice reason options for the cancellation questionnaire |
| 8 | Image vs Video Quota | Is the generation quota a shared pool, or separate limits per output type? |

---

*Document v1.1 — prepared for TBM engineering and design teams. All default prices are placeholders for development; admin must set production values before launch.*
