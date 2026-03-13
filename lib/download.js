/**
 * Triggers a browser file download from a Blob response.
 * @param {Blob} blob - The response blob
 * @param {string} filename - The download filename
 * @param {string} [mimeType] - MIME type fallback if not in blob headers
 */
export function downloadBlob(blob, filename, mimeType = "text/csv") {
  const resolvedBlob =
    blob instanceof Blob ? blob : new Blob([blob], { type: mimeType });
  const url = window.URL.createObjectURL(resolvedBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
