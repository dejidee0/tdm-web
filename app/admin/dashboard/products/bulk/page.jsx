"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, CheckCircle2, Upload, Loader2 } from "lucide-react";
import { useAdminBulkCreateProducts } from "@/hooks/use-admin-products";
import { useCategories } from "@/hooks/use-products";
import { showToast } from "@/components/shared/toast";
import {
  createProductInitialValues,
  createProductSchema,
  toCreateDto,
} from "@/lib/validations/admin-product";

/**
 * Bulk import.
 *
 * `POST /admin/AdminProducts/bulk` takes a bare `CreateProductDto[]` and writes
 * straight to the catalogue. Every row is therefore validated here, against the
 * same Yup schema the single-product form uses, before one request is sent — a
 * textarea wired directly to that endpoint is a footgun.
 *
 * The response is a per-row report, not a product list. A 200 does **not** mean
 * every row landed: read `data.created` and `data.failed`.
 */
export default function BulkImportPage() {
  const router = useRouter();
  const [rows, setRows] = useState(null); // [{ raw, values, error }]
  const [parseError, setParseError] = useState(null);
  const [report, setReport] = useState(null);

  const { data: categories } = useCategories();
  const { mutate: bulkCreate, isPending } = useAdminBulkCreateProducts();

  const validIds = new Set((categories ?? []).map((c) => c.id));

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setReport(null);
    setParseError(null);
    setRows(null);

    let parsed;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      setParseError("That file is not valid JSON.");
      return;
    }
    if (!Array.isArray(parsed)) {
      setParseError("The file must contain a JSON array of products.");
      return;
    }
    if (parsed.length === 0) {
      setParseError("The array is empty — nothing to import.");
      return;
    }

    // Validate every row before anything is sent. Defaults fill the fields the
    // spec marks nullable but the backend still expects to receive.
    const validated = await Promise.all(
      parsed.map(async (raw) => {
        const values = { ...createProductInitialValues, ...raw };
        try {
          await createProductSchema.validate(values, { abortEarly: false });
        } catch (err) {
          return { raw, values, error: err.errors?.join("; ") ?? "Invalid row" };
        }
        // Yup cannot know which category ids exist; the backend would answer a
        // 400 per row, which the bulk endpoint reports rather than throws.
        if (!validIds.has(values.categoryId)) {
          return { raw, values, error: `Unknown categoryId "${values.categoryId}"` };
        }
        return { raw, values, error: null };
      }),
    );
    setRows(validated);
  }

  const validRows = rows?.filter((r) => !r.error) ?? [];
  const invalidRows = rows?.filter((r) => r.error) ?? [];

  function handleImport() {
    bulkCreate(validRows.map((r) => toCreateDto(r.values)), {
      onSuccess: (res) => {
        const data = res?.data ?? {};
        setReport(data);
        // A 200 with failures is not a success. Say which it was.
        if (data.failed > 0) {
          showToast.warning(
            `${data.created} of ${data.totalSubmitted} created`,
            `${data.failed} row(s) were rejected by the backend.`,
          );
        } else {
          showToast.success(`${data.created} product(s) created`);
          router.push("/admin/dashboard/products");
        }
      },
      onError: (err) => showToast.error("Bulk import failed", err.message),
    });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/dashboard/products"
        className="inline-flex items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Products
      </Link>

      <header>
        <h1 className="text-2xl font-semibold text-white">Bulk import</h1>
        <p className="mt-1 text-[13px] text-white/40">
          A JSON array of products. Every row is validated here before anything
          is sent.
        </p>
      </header>

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-white/15 py-12 transition-colors hover:border-white/30">
        <Upload className="h-5 w-5 text-white/30" strokeWidth={1.5} />
        <span className="text-[14px] text-white/70">Choose a .json file</span>
        <span className="text-[12px] text-white/30">
          An array of objects with at least: name, description, categoryId,
          brandType, productType
        </span>
        <input type="file" accept="application/json,.json" onChange={handleFile} className="hidden" />
      </label>

      {parseError && (
        <p className="rounded-lg border border-red-500/25 bg-red-500/[0.06] p-4 text-[13.5px] text-red-200/80">
          {parseError}
        </p>
      )}

      {/* Preview. Nothing is sent until the admin reads this and confirms. */}
      {rows && !report && (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-4 text-[13px]">
            <span className="text-emerald-300">{validRows.length} valid</span>
            {invalidRows.length > 0 && (
              <span className="text-amber-300">{invalidRows.length} will be skipped</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-[13px]">
              <thead className="sticky top-0 bg-[#0b0b0b]">
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/35">
                  <th className="px-4 py-2.5 font-medium">#</th>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-2.5 text-white/30">{i + 1}</td>
                    <td className="px-4 py-2.5 text-white/80">
                      {r.raw?.name || <span className="text-white/25">no name</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      {r.error ? (
                        <span className="text-amber-300/80">{r.error}</span>
                      ) : (
                        <span className="text-emerald-300/80">Ready</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {invalidRows.length > 0 && (
            <div className="flex gap-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] p-3.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/80" strokeWidth={2} />
              <p className="text-[12.5px] leading-relaxed text-amber-100/70">
                {invalidRows.length} row(s) will not be sent. Fix them in the file
                and re-upload, or import the {validRows.length} valid row(s) now.
              </p>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={isPending || validRows.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 text-[14px] font-semibold text-black disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Importing…" : `Import ${validRows.length} product(s)`}
          </button>
        </section>
      )}

      {/* The backend's per-row report. `failures` was empty in every observed
          response, so its element shape is unknown — render it defensively. */}
      {report && (
        <section className="space-y-4 rounded-xl border border-white/10 p-5">
          <div className="flex items-center gap-2">
            {report.failed > 0 ? (
              <AlertTriangle className="h-4 w-4 text-amber-400" strokeWidth={2} />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" strokeWidth={2} />
            )}
            <h2 className="text-[15px] font-medium text-white">
              {report.created} of {report.totalSubmitted} created
            </h2>
          </div>

          {report.failed > 0 && (
            <div className="space-y-2">
              <p className="text-[13px] text-amber-200/70">
                {report.failed} row(s) were rejected:
              </p>
              <ul className="space-y-1 text-[12.5px] text-white/50">
                {(report.failures ?? []).map((f, i) => (
                  <li key={i} className="rounded bg-white/5 px-3 py-2 font-mono">
                    {typeof f === "string" ? f : JSON.stringify(f)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href="/admin/dashboard/products"
            className="inline-block text-[13px] text-[#D4AF37] hover:underline"
          >
            Back to products
          </Link>
        </section>
      )}
    </div>
  );
}
