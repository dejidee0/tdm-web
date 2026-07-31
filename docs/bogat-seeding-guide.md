# Bogat Product Seeding Guide

A field-by-field guide for the **content fields that were not seeded** on the 120
Bogat catalogue products. Values are taken verbatim from
`BOGAT_Luxury_Collections_Corrected_Grouping.pdf`. Where the catalogue doesn't
specify a value, it says so — **do not invent one**, especially for natural-stone
attributes that vary per design.

Enter these in the admin product form: **Admin → Products → (row) → Edit**.
Clicking any row opens its edit page.

---

## What is already seeded (skip these)

Do **not** re-enter — verified populated on all 120 products (live check):

- **Name**, **SKU**, **Description**, **Short description**
- **Price** + **Variants** (600 / 800 / 1000 / 1200 mm, per-size pricing)
- **Key features** (the "Signature details" list)
- **Tags**, **AI keywords**, **Category**, **Brand**, **Type**
- **Quality tier** — already set to `Luxury` on all 120

## What does NOT need per-product entry

The **ordering notes** (8–12 week lead time, natural-stone variation, site survey,
"excludes VAT/delivery/installation") are **identical for every collection** and are
already shown on the product page as static reassurance copy. Don't spend time
entering them 120 times — they're handled.

---

## Universal values — apply to ALL 120 designs

| Admin field | Value |
|---|---|
| **Material type** | `Natural stone` |
| **Installation** | `Wall-mounted (floating)` |
| **Warranty** | *Client to confirm — the catalogue states no warranty term. Leave blank until confirmed.* |

> **Quality tier** is **already seeded** as `Luxury` on all 120 — do not re-enter.

**Per-design attributes the catalogue does NOT specify** — leave blank, or fill from
the actual product, never guessed:

- **Material** (the specific stone, e.g. "Calacatta marble") — varies per design
- **Colour** — varies per design
- **Finish** — varies per design
- **Dimensions** — the exact W×D×H; the size variant already covers width
- **Images** — you are handling these separately via the dashboard

---

## Collection → SKU map

Apply each collection's values to every design in its SKU range.

| # | Collection | SKU range | Designs |
|---|---|---|---|
| 01 | Eclat Atelier | `BGT-EAT-001` … `BGT-EAT-031` | 31 |
| 02 | Joaillerie Stone | `BGT-JOA-001` … `BGT-JOA-026` | 26 |
| 03 | Monolithe Prive | `BGT-MON-001` … `BGT-MON-013` | 13 |
| 04 | Levitation Royale | `BGT-LEV-001` … `BGT-LEV-008` | 8 |
| 05 | Symphonie Deux | `BGT-SYM-001` … `BGT-SYM-007` | 7 |
| 06 | Maison Sculptee | `BGT-MSC-001` … `BGT-MSC-020` | 20 |
| 07 | Terra Sculpte | `BGT-TER-001` … `BGT-TER-015` | 15 |

> Each bullet below = **one row** in the form's list editors.
> "What's included" and "What's not included" are two separate fields.

---

## 01 · Eclat Atelier — `BGT-EAT-*`

**What's included**
- Stone basin and vanity top
- Cabinet
- Illuminated mirror
- LED drivers
- Mounting structure

**What's not included** *(quoted separately)*
- Tapware
- Accessories
- Installation
- Delivery

**Recommended for**
`Primary and en-suite bathrooms seeking a complete, room-defining focal point.`

**Meta description** *(≤160 chars)*
`A complete, room-defining vanity: integrated stone basin, furniture-grade storage, illuminated mirror and architectural lighting. Made to order by Bogat.`

---

## 02 · Joaillerie Stone — `BGT-JOA-*`

**What's included**
- Stone basin
- Concealed support frame
- Lighting system (where specified)

**What's not included** *(available as options)*
- Mirror
- Tapware
- Lower shelf
- Installation
- Delivery

**Recommended for**
`Refined bathrooms wanting a jewellery-like stone basin over practical floating storage.`

**Meta description** *(≤160 chars)*
`Refined stone-and-cabinet vanities: a distinctive natural-stone basin above floating storage, with calm proportions and premium detailing. Made to order.`

---

## 03 · Monolithe Prive — `BGT-MON-*`

**What's included**
- Stone basin
- Cabinet
- Concealed steel support
- Standard waste

**What's not included** *(quoted separately)*
- Mirror
- Tapware
- Lighting
- Installation
- Delivery

**Recommended for**
`Bathrooms wanting a dramatic yet welcoming illuminated-stone focal point.`

**Meta description** *(≤160 chars)*
`Illuminated stone vanities using warm backlighting, glowing stone and halo mirrors to create a dramatic but welcoming focal point. Made to order by Bogat.`

---

## 04 · Levitation Royale — `BGT-LEV-*`

**What's included**
- Stone basin
- Concealed steel brackets
- Standard waste

**What's not included** *(optional)*
- Decorative trap
- Tapware
- Mirror
- Lighting
- Installation
- Delivery

**Recommended for**
`Powder rooms, guest suites and design-led bathrooms.`

**Meta description** *(≤160 chars)*
`A minimal floating stone washbasin with an open underside, precision wall fixing and an exposed designer bottle trap. Made to order by Bogat.`

---

## 05 · Symphonie Deux — `BGT-SYM-*`

**What's included**
- Two basins
- Vanity counter
- Cabinet or shelf configuration
- Concealed support

**What's not included** *(quoted separately)*
- Tapware
- Mirror
- Installation
- Delivery

**Recommended for**
`Shared and master bathrooms wanting a twin-basin statement centrepiece.`

**Meta description** *(≤160 chars)*
`A confident collection of statement stone basins, deep profiles and furniture-like floating bases, developed as individual bathroom centrepieces.`

---

## 06 · Maison Sculptee — `BGT-MSC-*`

**What's included**
- Stone vessel
- Counter
- Concealed mounting system

**What's not included** *(selectable options)*
- Cabinet
- Shelf
- Mirror
- Tapware
- Lighting
- Installation
- Delivery

**Recommended for**
`Generous bathrooms, including twin-basin and open-shelf arrangements.`

**Meta description** *(≤160 chars)*
`Vessel and wider vanity compositions for generous bathrooms, including twin-basin and open-shelf arrangements. Made to order by Bogat.`

---

## 07 · Terra Sculpte — `BGT-TER-*`

**What's included**
- Artisan stone basin
- Concealed support

**What's not included** *(quoted to specification)*
- Cabinet
- Mirror
- Tapware
- Lighting
- Installation
- Delivery

**Recommended for**
`Serene resort-style and nature-led interiors.`

**Meta description** *(≤160 chars)*
`An artisanal series of tactile basins with natural, chiseled or irregular edges, grounded by warm timber and understated detailing. Made to order.`

---

## Meta title — formula (per design)

Keep under 70 characters:

```
<Product name> — <Collection> | Bogat
```

Examples:
- `Eclat Atelier Amber — Eclat Atelier | Bogat`
- `Terra Sculpte Luna — Terra Sculpte | Bogat`

Use the collection's **Meta description** above for every design in that collection
(they share the collection story).

---

## Optional — Specifications table (key / value)

If you want a spec table on the product page, these apply to every collection.
Add as key/value rows in the **Specifications** field:

| Key | Value |
|---|---|
| Lead time | `8–12 weeks (made to order)` |
| Available widths | `600 / 800 / 1000 / 1200 mm` |
| Bespoke widths | `Up to 1400 mm, quoted individually` |
| Stone | `Natural, individually selected slab` |
| Mounting | `Concealed wall support` |

> Bespoke widths (1400 mm) are the catalogue's "quoted individually" tier — there is
> no fixed price, which is why it's a spec line, not a size variant.

---

## Field checklist (per product)

- [ ] What's included
- [ ] What's not included
- [ ] Recommended for
- [ ] Material type → `Natural stone`
- [ ] Installation → `Wall-mounted (floating)`
- [ ] Meta title (formula)
- [ ] Meta description (per collection)
- [ ] Specifications (optional, universal set)
- [ ] Images (handled separately)
- [ ] Material / Colour / Finish / Dimensions — **only if known per design; never guessed**
- [ ] Warranty — **only once the client confirms a term**
