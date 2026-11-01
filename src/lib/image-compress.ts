/**
 * Client-Side Image Compression Utility
 * Helps prevent Supabase Storage egress limit exhaustion by compressing
 * raw high-res mobile photos (5MB - 10MB) down to optimized WebP (<250KB).
 */

export interface ImageCompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
}

/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Converts to WebP format if supported, maintaining clear legibility of receipts.
 */
export async function compressImageFile(
  file: File,
  options: ImageCompressOptions = {}
): Promise<File> {
  // If not an image or already tiny SVG, return original
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  // If already under 150KB and already WebP, return original
  if (file.size <= 150 * 1024 && file.type === "image/webp") {
    return file;
  }

  // Ensure window & HTML5 Canvas exist (client-side only)
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    maxSizeBytes = 250 * 1024, // 250KB target max
  } = options;

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onerror = () => {
      console.warn("[ImageCompress] FileReader error, returning original file");
      resolve(file);
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        console.warn("[ImageCompress] Image load error, returning original file");
        resolve(file);
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate scaling
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }

          // Use better smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Try exporting as image/webp first
          const tryBlob = (mime: string, q: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(file);
                  return;
                }

                // If blob is still larger than maxSizeBytes and q > 0.5, compress further
                if (blob.size > maxSizeBytes && q > 0.55) {
                  tryBlob(mime, q - 0.15);
                  return;
                }

                const ext = mime === "image/webp" ? "webp" : "jpg";
                const cleanName = file.name.replace(/\.[^/.]+$/, "");
                const compressedFile = new File([blob], `${cleanName}.${ext}`, {
                  type: mime,
                  lastModified: Date.now(),
                });

                console.log(
                  `[ImageCompress] Compressed from ${(file.size / 1024).toFixed(1)}KB -> ${(compressedFile.size / 1024).toFixed(1)}KB (${mime}, q=${q})`
                );

                resolve(compressedFile);
              },
              mime,
              q
            );
          };

          // Check webp support
          const isWebpSupported = canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
          tryBlob(isWebpSupported ? "image/webp" : "image/jpeg", quality);
        } catch (err) {
          console.warn("[ImageCompress] Canvas compression failed:", err);
          resolve(file);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

