"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Upload, Pencil, Trash2, Search } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useAdminDeleteProduct } from "@/hooks/use-admin-products";
import { showToast } from "@/components/shared/toast";
import ConfirmDeleteModal from "@/components/shared/admin/dashboard/confirm-delete-modal";

const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const editHref = (id) => `/admin/dashboard/products/${id}/edit`;

  // The admin surface has no GET — this is the same list the storefront reads.
  // `activeOnly: false` so inactive products remain manageable.
  const { data, isLoading, isError } = useProducts({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    activeOnly: false,
    ...(search.trim() ? { searchTerm: search.trim() } : {}),
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useAdminDeleteProduct();

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  function handleDelete() {
    if (!pendingDelete) return;
    deleteProduct(pendingDelete.id, {
      onSuccess: () => {
        showToast.success("Product deleted", `"${pendingDelete.name}" is gone.`);
        setPendingDelete(null);
      },
      // err.message is already user-safe — lib/errors.js replaced it.
      onError: (err) => showToast.error("Could not delete", err.message),
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="mt-1 text-[13px] text-white/40">
            {data ? `${data.totalCount} total` : " "}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/dashboard/products/bulk"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-[13px] font-medium text-white/80 transition-colors hover:text-white"
          >
            <Upload className="h-4 w-4" strokeWidth={1.75} />
            Bulk import
          </Link>
          <Link
            href="/admin/dashboard/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-[13px] font-semibold text-black"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
            New product
          </Link>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products…"
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-[14px] text-white placeholder:text-white/25 focus:border-[#D4AF37]/60 focus:outline-none"
        />
      </div>

      {/* Error — the boundary in app/admin/error.jsx only catches throws, and a
          failed query resolves rather than throwing. Handle it here. */}
      {isError && (
        <p className="rounded-lg border border-red-500/25 bg-red-500/[0.06] p-4 text-[13.5px] text-red-200/80">
          Could not load products. Refresh, or check that the API is reachable.
        </p>
      )}

      {isLoading && <ProductsSkeleton />}

      {/* Empty is a state, not an edge case. Distinguish "no products at all"
          from "no products matching this search" — they need different actions. */}
      {!isLoading && !isError && items.length === 0 && (
        <div className="rounded-xl border border-white/10 py-16 text-center">
          <p className="text-[15px] text-white/60">
            {search ? `No products match "${search}".` : "No products yet."}
          </p>
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-[13px] text-[#D4AF37] hover:underline"
            >
              Clear the search
            </button>
          ) : (
            <Link
              href="/admin/dashboard/products/new"
              className="mt-3 inline-block text-[13px] text-[#D4AF37] hover:underline"
            >
              Create the first one
            </Link>
          )}
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/35">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  // Row-click to edit — the familiar table gesture. Keyboard and
                  // screen-reader users still get the focusable Edit link in the
                  // actions cell, so this is a mouse enhancement, not the only path.
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
                  onClick={() => {
                    // Don't hijack a click that was actually a text selection.
                    if (window.getSelection()?.toString()) return;
                    router.push(editHref(p.id));
                  }}
                  className="cursor-pointer border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.04]"
                >
                  <td className="px-4 py-3">
                    <p className="text-[14px] text-white">{p.name}</p>
                    <p className="text-[12px] text-white/30">{p.sku ?? "no SKU"}</p>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-white/60">{p.brandName}</td>
                  <td className="px-4 py-3 text-[13px] text-white/60">
                    {p.categoryName}
                  </td>
                  {/* priceDisplay is always a string, including "Request Price"
                      for quote-only products where `price` is null. */}
                  <td className="px-4 py-3 text-[13px] text-white/80">
                    {p.priceDisplay}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        p.isActive
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={editHref(p.id)}
                        aria-label={`Edit ${p.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-md p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDelete(p);
                        }}
                        aria-label={`Delete ${p.name}`}
                        className="rounded-md p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[13px]">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-white/15 px-3 py-2 text-white/70 disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-white/40">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-white/15 px-3 py-2 text-white/70 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDeleteModal
          isOpen
          onClose={() => setPendingDelete(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
          itemName={pendingDelete.name}
          itemLabel="Product"
        />
      )}
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="space-y-2 rounded-xl border border-white/10 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />
          <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
          <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
          <div className="h-4 w-16 animate-pulse rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}
