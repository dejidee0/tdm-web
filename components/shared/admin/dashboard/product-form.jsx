"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { AlertTriangle, Loader2, Plus, X } from "lucide-react";
import { useCategories } from "@/hooks/use-products";
import {
  BRAND_TYPES,
  PRODUCT_TYPES,
  createProductSchema,
  updateProductSchema,
} from "@/lib/validations/admin-product";

const input =
  "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-[14px] text-white placeholder:text-white/25 focus:border-[#D4AF37]/60 focus:outline-none transition-colors";
const label = "block text-[12px] font-medium text-white/60 mb-1.5";
const errorText = "mt-1 text-[12px] text-red-400";

function Field({ formik, name, children, hint }) {
  const touched = formik.touched[name];
  const error = formik.errors[name];
  return (
    <div>
      {children}
      {hint && !(touched && error) && (
        <p className="mt-1 text-[12px] text-white/30">{hint}</p>
      )}
      {touched && error && <p className={errorText}>{error}</p>}
    </div>
  );
}

/** A plain text field bound to `name`, to keep the many attribute inputs terse. */
function TextField({ formik, name, label: labelText, placeholder, hint }) {
  return (
    <Field formik={formik} name={name} hint={hint}>
      <label className={label} htmlFor={name}>
        {labelText}
      </label>
      <input
        id={name}
        className={input}
        placeholder={placeholder}
        {...formik.getFieldProps(name)}
      />
    </Field>
  );
}

/** Editor for a `string[]` value (keyFeatures, whatsIncluded, …): one row per
 *  bullet, add/remove, stored straight onto the Formik array. */
function StringListField({ formik, name, label: labelText, placeholder }) {
  const items = formik.values[name] ?? [];
  const set = (next) => formik.setFieldValue(name, next);
  return (
    <div>
      <label className={label}>{labelText}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={input}
              value={item}
              placeholder={placeholder}
              onChange={(e) =>
                set(items.map((v, j) => (j === i ? e.target.value : v)))
              }
            />
            <button
              type="button"
              aria-label={`Remove ${labelText} item`}
              onClick={() => set(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg border border-white/10 px-3 text-white/40 transition-colors hover:border-red-400/40 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => set([...items, ""])}
        className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-[#D4AF37] transition-opacity hover:opacity-80"
      >
        <Plus className="h-3.5 w-3.5" /> Add item
      </button>
    </div>
  );
}

/** Editor for `specifications`: an array of { key, value } rows. */
function SpecificationsField({ formik }) {
  const items = formik.values.specifications ?? [];
  const set = (next) => formik.setFieldValue("specifications", next);
  return (
    <div>
      <label className={label}>Specifications</label>
      <div className="space-y-2">
        {items.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={`${input} sm:max-w-[40%]`}
              placeholder="Label (e.g. Origin)"
              value={row?.key ?? ""}
              onChange={(e) =>
                set(items.map((r, j) => (j === i ? { ...r, key: e.target.value } : r)))
              }
            />
            <input
              className={input}
              placeholder="Value (e.g. Italy)"
              value={row?.value ?? ""}
              onChange={(e) =>
                set(items.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))
              }
            />
            <button
              type="button"
              aria-label="Remove specification"
              onClick={() => set(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg border border-white/10 px-3 text-white/40 transition-colors hover:border-red-400/40 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => set([...items, { key: "", value: "" }])}
        className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-[#D4AF37] transition-opacity hover:opacity-80"
      >
        <Plus className="h-3.5 w-3.5" /> Add specification
      </button>
    </div>
  );
}

/**
 * Create and edit share this form, but not their payload.
 *
 * `mode="create"` validates with createProductSchema (brandType + productType);
 * `mode="edit"` with updateProductSchema (isActive, and brand/type immutable).
 * The two DTOs differ by exactly those fields — see lib/validations/admin-product.js.
 */
export default function ProductForm({
  mode,
  initialValues,
  onSubmit,
  isPending,
  submitLabel,
}) {
  const isEdit = mode === "edit";
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const formik = useFormik({
    initialValues,
    validationSchema: isEdit ? updateProductSchema : createProductSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const busy = formik.isSubmitting || isPending;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      {/* ── Basics ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[13px] uppercase tracking-[0.12em] text-white/40">
          Basics
        </h2>

        <Field formik={formik} name="name">
          <label className={label} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className={input}
            placeholder="Matte Black Basin Tap"
            {...formik.getFieldProps("name")}
          />
        </Field>

        <Field formik={formik} name="description">
          <label className={label} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className={input}
            placeholder="What it is, what it's made of, where it fits."
            {...formik.getFieldProps("description")}
          />
        </Field>

        <Field formik={formik} name="shortDescription">
          <label className={label} htmlFor="shortDescription">
            Short description
          </label>
          <input
            id="shortDescription"
            className={input}
            placeholder="One line for cards and search results"
            {...formik.getFieldProps("shortDescription")}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field formik={formik} name="sku">
            <label className={label} htmlFor="sku">
              SKU
            </label>
            <input id="sku" className={input} {...formik.getFieldProps("sku")} />
          </Field>

          <Field
            formik={formik}
            name="categoryId"
            hint={categoriesLoading ? "Loading categories…" : undefined}
          >
            <label className={label} htmlFor="categoryId">
              Category
            </label>
            <select
              id="categoryId"
              className={input}
              disabled={categoriesLoading}
              {...formik.getFieldProps("categoryId")}
            >
              <option value="">Select a category…</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Brand and type are set once, at creation. UpdateProductDto does not
            carry them, so the edit form shows them read-only rather than
            offering a control that would silently do nothing. */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field formik={formik} name="brandType">
            <label className={label} htmlFor="brandType">
              Brand {isEdit && <span className="text-white/25">· immutable</span>}
            </label>
            <select
              id="brandType"
              className={`${input} ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isEdit}
              {...formik.getFieldProps("brandType")}
            >
              {BRAND_TYPES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </Field>

          <Field formik={formik} name="productType">
            <label className={label} htmlFor="productType">
              Type {isEdit && <span className="text-white/25">· immutable</span>}
            </label>
            <select
              id="productType"
              className={`${input} ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isEdit}
              {...formik.getFieldProps("productType")}
            >
              {PRODUCT_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[13px] uppercase tracking-[0.12em] text-white/40">
          Pricing
        </h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#D4AF37]"
            {...formik.getFieldProps("showPrice")}
            checked={formik.values.showPrice}
          />
          <span className="text-[14px] text-white/80">Show the price publicly</span>
        </label>
        <p className="text-[12px] text-white/30 -mt-2">
          Unchecked makes this a quote-only product: the storefront renders
          &ldquo;Request Price&rdquo; and no price is sent to the browser.
        </p>

        {/* price is required iff showPrice — the same coupling the response
            contract enforces (price is null exactly when showPrice is false). */}
        {formik.values.showPrice && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field formik={formik} name="price">
              <label className={label} htmlFor="price">
                Price (₦)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                className={input}
                {...formik.getFieldProps("price")}
              />
            </Field>

            <Field
              formik={formik}
              name="compareAtPrice"
              hint="Optional. Shown struck through, so it must exceed the price."
            >
              <label className={label} htmlFor="compareAtPrice">
                Compare-at price (₦)
              </label>
              <input
                id="compareAtPrice"
                type="number"
                step="0.01"
                className={input}
                {...formik.getFieldProps("compareAtPrice")}
              />
            </Field>
          </div>
        )}
      </section>

      {/* ── Inventory ──────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[13px] uppercase tracking-[0.12em] text-white/40">
          Inventory
        </h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#D4AF37]"
            {...formik.getFieldProps("trackInventory")}
            checked={formik.values.trackInventory}
          />
          <span className="text-[14px] text-white/80">Track inventory</span>
        </label>

        {formik.values.trackInventory && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field formik={formik} name="stockQuantity">
              <label className={label} htmlFor="stockQuantity">
                Stock quantity
              </label>
              <input
                id="stockQuantity"
                type="number"
                className={input}
                {...formik.getFieldProps("stockQuantity")}
              />
            </Field>

            <Field formik={formik} name="lowStockThreshold">
              <label className={label} htmlFor="lowStockThreshold">
                Low-stock threshold
              </label>
              <input
                id="lowStockThreshold"
                type="number"
                className={input}
                {...formik.getFieldProps("lowStockThreshold")}
              />
            </Field>
          </div>
        )}

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#D4AF37]"
              {...formik.getFieldProps("isFeatured")}
              checked={formik.values.isFeatured}
            />
            <span className="text-[14px] text-white/80">Featured</span>
          </label>

          {isEdit && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#D4AF37]"
                {...formik.getFieldProps("isActive")}
                checked={formik.values.isActive}
              />
              <span className="text-[14px] text-white/80">Active</span>
            </label>
          )}
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <h2 className="text-[13px] uppercase tracking-[0.12em] text-white/40">
            Content
          </h2>
          <p className="mt-1 text-[12px] text-white/30">
            The marketing copy shown on the product page — features, what the
            buyer gets, and the spec table.
          </p>
        </div>

        <StringListField
          formik={formik}
          name="keyFeatures"
          label="Key features"
          placeholder="Integrated stone basin"
        />
        <StringListField
          formik={formik}
          name="whatsIncluded"
          label="What's included"
          placeholder="Stone basin and vanity top"
        />
        <StringListField
          formik={formik}
          name="whatsNotIncluded"
          label="What's not included"
          placeholder="Tapware, installation"
        />
        <SpecificationsField formik={formik} />
      </section>

      {/* ── Attributes ─────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[13px] uppercase tracking-[0.12em] text-white/40">
          Attributes
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField formik={formik} name="material" label="Material" placeholder="Natural marble" />
          <TextField formik={formik} name="color" label="Colour" placeholder="Emperador brown" />
          <TextField formik={formik} name="finishType" label="Finish" placeholder="Polished" />
          <TextField formik={formik} name="installationType" label="Installation" placeholder="Wall-mounted" />
          <TextField formik={formik} name="dimensions" label="Dimensions" placeholder="1200 × 500 × 200 mm" />
          <TextField formik={formik} name="warranty" label="Warranty" placeholder="2 years" />
          <TextField formik={formik} name="materialType" label="Material type" placeholder="Stone" />
          <TextField formik={formik} name="qualityTier" label="Quality tier" placeholder="Premium" />
        </div>
        <TextField
          formik={formik}
          name="recommendedFor"
          label="Recommended for"
          placeholder="Powder rooms, guest suites"
        />
      </section>

      {/* ── Write-only fields ──────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[13px] uppercase tracking-[0.12em] text-white/40">
          Ordering &amp; SEO
        </h2>

        {/* The backend accepts these four on write and returns none of them on
            any read endpoint. So an edit form cannot show their current values,
            and saving replaces whatever is stored. Say so, rather than
            presenting empty boxes that look like "no value set". */}
        {isEdit && (
          <div className="flex gap-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] p-3.5">
            <AlertTriangle
              className="h-4 w-4 shrink-0 text-amber-400/80 mt-0.5"
              strokeWidth={2}
            />
            <p className="text-[12.5px] leading-relaxed text-amber-100/70">
              The API never returns these fields, so their current values
              cannot be shown. <strong className="font-semibold">Saving overwrites
              them</strong> with whatever is below — re-enter them, or they will
              be cleared.
            </p>
          </div>
        )}

        <Field
          formik={formik}
          name="displayOrder"
          hint="Lower sorts first."
        >
          <label className={label} htmlFor="displayOrder">
            Display order
          </label>
          <input
            id="displayOrder"
            type="number"
            className={input}
            {...formik.getFieldProps("displayOrder")}
          />
        </Field>

        <Field formik={formik} name="metaTitle" hint="Up to 70 characters.">
          <label className={label} htmlFor="metaTitle">
            Meta title
          </label>
          <input id="metaTitle" className={input} {...formik.getFieldProps("metaTitle")} />
        </Field>

        <Field formik={formik} name="metaDescription" hint="Up to 160 characters.">
          <label className={label} htmlFor="metaDescription">
            Meta description
          </label>
          <textarea
            id="metaDescription"
            rows={2}
            className={input}
            {...formik.getFieldProps("metaDescription")}
          />
        </Field>

        <TextField
          formik={formik}
          name="tags"
          label="Tags"
          placeholder="bathroom, vanity, luxury"
          hint="Comma-separated."
        />
        <TextField
          formik={formik}
          name="aiKeywords"
          label="AI keywords"
          placeholder="Comma-separated keywords for AI search"
          hint="Comma-separated."
        />
      </section>

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-t border-white/10 pt-6">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 text-[14px] font-semibold text-black transition-opacity disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/admin/dashboard/products"
          className="rounded-lg border border-white/15 px-5 py-2.5 text-[14px] text-white/70 transition-colors hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
