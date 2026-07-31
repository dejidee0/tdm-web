// hooks/use-admin-products.js
//
// Mutations for the /admin/AdminProducts surface. Reads come from
// hooks/use-products.js — the admin surface has no GET, and the public product
// list is the same data.
//
// Images are a separate resource: uploaded multipart to
// POST /admin/adminproducts/{id}/images/upload, and they come back inside
// `Product.images[]`. The swagger snapshot's older JSON `AddProductImageDto`
// (POST {id}/images) is superseded by that upload endpoint and is not used.

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsAPI } from "@/lib/api/admin";
import { productKeys } from "@/hooks/use-products";

/**
 * Invalidate every product query after a write.
 *
 * Two prefixes, not one. React Query matches by key prefix, and this codebase
 * has two unrelated product namespaces:
 *
 *   ["products", …]  — the list (`productKeys.list`), featured, categories
 *   ["product",  id] — the single-product detail (`hooks/use-product.js`)
 *
 * `productKeys.detail(id)` exists and returns `["products","detail",id]`, but
 * nothing reads it: `useProduct` keys on the singular `["product", id]`.
 * Invalidating only `productKeys.all` therefore leaves an open edit page
 * showing the values it had before the save. Until the two namespaces are
 * merged, both must be invalidated.
 */
function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all }); // ["products"]
    queryClient.invalidateQueries({ queryKey: ["product"] }); // detail
  };
}

/**
 * POST /admin/AdminProducts → ApiEnvelope<Product>
 *
 * Build the body with `toCreateDto()` from lib/validations/admin-product.js:
 * CreateProductDto carries `brandType` and `productType` and has no `isActive`.
 */
export function useAdminCreateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (dto) => adminProductsAPI.createProduct(dto),
    onSuccess: invalidate,
  });
}

/**
 * PUT /admin/AdminProducts/{id} → ApiEnvelope<Product>
 *
 * Build the body with `toUpdateDto()`. UpdateProductDto has neither
 * `brandType` nor `productType` — a product's brand and type are immutable —
 * and it adds `isActive`.
 */
export function useAdminUpdateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ id, dto }) => adminProductsAPI.updateProduct(id, dto),
    onSuccess: invalidate,
  });
}

/** DELETE /admin/AdminProducts/{id} → ApiEnvelope<boolean>, not a Product. */
export function useAdminDeleteProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (id) => adminProductsAPI.deleteProduct(id),
    onSuccess: invalidate,
  });
}

/**
 * POST /admin/AdminProducts/bulk — the body is a bare `CreateProductDto[]`.
 *
 * The response is a per-row report, not a product list. Created rows live under
 * `data.createdProducts`; rejected rows under `data.failures`. **A 200 does not
 * mean every row succeeded** — read `data.failed` before reporting success.
 */
export function useAdminBulkCreateProducts() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (dtos) => adminProductsAPI.bulkCreateProducts(dtos),
    onSuccess: invalidate,
  });
}

/**
 * POST /admin/adminproducts/{productId}/images/upload — multipart.
 * @param {{ productId: string, file: File, opts?: import("@/lib/api/types").UploadImageParams }} args
 * Returns ApiEnvelope<ProductImage>. The image lands in `Product.images[]`, so
 * this invalidates the product caches to refetch the updated list.
 */
export function useAdminUploadProductImage() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ productId, file, opts }) =>
      adminProductsAPI.uploadProductImage(productId, file, opts),
    onSuccess: invalidate,
  });
}

/** DELETE /admin/AdminProducts/images/{imageId} */
export function useAdminDeleteProductImage() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (imageId) => adminProductsAPI.deleteProductImage(imageId),
    onSuccess: invalidate,
  });
}

/** PUT /admin/AdminProducts/{productId}/images/{imageId}/primary */
export function useAdminSetPrimaryImage() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ productId, imageId }) =>
      adminProductsAPI.setPrimaryImage(productId, imageId),
    onSuccess: invalidate,
  });
}
