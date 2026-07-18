"use client";

import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/shared/admin/dashboard/product-form";
import ProductImageManager from "@/components/shared/admin/dashboard/product-image-manager";
import { useProduct } from "@/hooks/use-product";
import { useAdminUpdateProduct } from "@/hooks/use-admin-products";
import { showToast } from "@/components/shared/toast";
import {
  productToFormValues,
  toUpdateDto,
} from "@/lib/validations/admin-product";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: product, isLoading, isError } = useProduct(id);
  const { mutate: updateProduct, isPending } = useAdminUpdateProduct();

  function handleSubmit(values, { setSubmitting }) {
    // toUpdateDto drops brandType/productType and adds isActive. Sending the
    // create shape here is silently ignored by the backend, which reads in the
    // UI as "my edit didn't save".
    updateProduct(
      { id, dto: toUpdateDto(values) },
      {
        onSuccess: (res) => {
          showToast.success("Product updated", res?.data?.name ?? "");
          router.push("/admin/dashboard/products");
        },
        onError: (err) => showToast.error("Could not update product", err.message),
        onSettled: () => setSubmitting(false),
      },
    );
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
        <h1 className="text-2xl font-semibold text-white">
          {product ? `Edit ${product.name}` : "Edit product"}
        </h1>
      </header>

      {isLoading && <FormSkeleton />}

      {isError && (
        <p className="rounded-lg border border-red-500/25 bg-red-500/[0.06] p-4 text-[13.5px] text-red-200/80">
          Could not load this product. It may have been deleted.{" "}
          <Link href="/admin/dashboard/products" className="underline">
            Back to the list
          </Link>
        </p>
      )}

      {product && (
        <>
          {/* Images are a separate resource with their own endpoints — managed
              here, not through the product DTO. They save immediately, so this
              sits outside the form and does not wait on "Save changes". */}
          <ProductImageManager productId={id} images={product.images ?? []} />

          <div className="h-px bg-white/10" />

          <ProductForm
            mode="edit"
            initialValues={productToFormValues(product)}
            onSubmit={handleSubmit}
            isPending={isPending}
            submitLabel="Save changes"
          />
        </>
      )}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-white/5" />
        </div>
      ))}
    </div>
  );
}
