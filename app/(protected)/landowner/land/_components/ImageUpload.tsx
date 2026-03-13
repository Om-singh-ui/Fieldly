"use client";

import { useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // derive previews safely
  const previewUrls = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images],
  );

  // cleanup memory
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const openFileDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    inputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // ⭐ CRITICAL
    e.stopPropagation(); // ⭐ CRITICAL

    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (files.length + images.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Max ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (files.some((f) => f.size > maxSize)) {
      toast({
        title: "File too large",
        description: "Each image must be < 5MB",
        variant: "destructive",
      });
      return;
    }

    if (files.some((f) => !f.type.startsWith("image/"))) {
      toast({
        title: "Invalid file",
        description: "Only images allowed",
        variant: "destructive",
      });
      return;
    }

    onImagesChange([...images, ...files]);

    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()} 
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <h3 className="text-lg font-semibold mb-4">Upload Images</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {previewUrls.map((url, index) => (
          <div
            key={url}
            className="relative aspect-square rounded-lg overflow-hidden border group"
          >
            <Image
              src={url}
              alt={`Land image ${index + 1}`}
              fill
              className="object-cover"
            />

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeImage(index);
              }}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={openFileDialog}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#b7cf8a] flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#b7cf8a] transition"
          >
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs">Upload Image</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleImageUpload}
      />

      <p className="text-sm text-gray-500 mt-2">
        Upload up to {maxImages} images (Max 5MB each)
      </p>
    </div>
  );
}
