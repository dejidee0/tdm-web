"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/shared/admin/dashboard/product-form";
import ProductImageStager from "@/components/shared/admin/dashboard/product-image-stager";
import {
  useAdminCreateProduct,
  useAdminUploadProductImage,
} from "@/hooks/use-admin-products";
import { showToast } from "@/components/shared/toast";
import {
  createProductInitialValues,
  toCreateDto,
} from "@/lib/validations/admin-product";

export default function NewProductPage() {
  const router = useRouter();
  // Images are staged here and uploaded after create — the upload endpoint
  // needs a productId, which does not exist until the product is created.
  const [stagedImages, setStagedImages] = useState([]);

  const { mutateAsync: createProduct, isPending: isCreating } = useAdminCreateProduct();
  const { mutateAsync: uploadImage } = useAdminUploadProductImage();
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(values, { setSubmitting }) {
    let product;
    try {
      // toCreateDto sends brandType + productType and no isActive — the shape
      // POST /admin/AdminProducts accepts.
      const res = await createProduct(toCreateDto(values));
      product = res?.data;
    } catch (err) {
      showToast.error("Could not create product", err.message);
      setSubmitting(false);
      return;
    }

    const id = product?.id;

    // No images to attach — done.
    if (!id || stagedImages.length === 0) {
      showToast.success("Product created", product?.name ?? "");
      setSubmitting(false);
      router.push("/admin/dashboard/products");
      return;
    }

    // Upload the staged images in order. A failure here must not lose the
    // product that already exists: report what failed and send the admin to the
    // edit page, where the image manager can finish the job.
    setIsUploading(true);
    let uploaded = 0;
    const failures = [];
    for (const [index, img] of stagedImages.entries()) {
      try {
        await uploadImage({
          productId: id,
          file: img.file,
          opts: {
            isPrimary: img.isPrimary,
            displayOrder: index + 1,
            altText: img.altText.trim() || undefined,
          },
        });
        uploaded += 1;
      } catch (err) {
        failures.push(`${img.file.name}: ${err.message}`);
      }
    }
    setIsUploading(false);
    setSubmitting(false);

    if (failures.length === 0) {
      showToast.success("Product created", `${uploaded} image(s) uploaded.`);
      router.push("/admin/dashboard/products");
    } else {
      showToast.warning(
        `Product created, ${failures.length} image(s) failed`,
        "Finish uploading them on the edit page.",
      );
      router.push(`/admin/dashboard/products/${id}/edit`);
    }
  }

  const busy = isCreating || isUploading;

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
        <h1 className="text-2xl font-semibold text-white">New product</h1>
        <p className="mt-1 text-[13px] text-white/40">
          Brand and type are set once and cannot be changed afterwards.
        </p>
      </header>

      {/* Staged above the form, uploaded on submit. Kept outside <ProductForm>
          because it is a separate resource with its own endpoint — the form DTO
          carries no images. */}
      <ProductImageStager value={stagedImages} onChange={setStagedImages} />

      <div className="h-px bg-white/10" />

      <ProductForm
        mode="create"
        initialValues={createProductInitialValues}
        onSubmit={handleSubmit}
        isPending={busy}
        submitLabel={
          stagedImages.length
            ? `Create product & upload ${stagedImages.length} image(s)`
            : "Create product"
        }
      />
    </div>
  );
}
