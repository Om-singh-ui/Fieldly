"use client";

import { useRef, useMemo, useEffect, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);

  const previewUrls = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images]
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const validateFiles = (files: File[]) => {
    if (files.length + images.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Max ${maxImages} images allowed`,
        variant: "destructive",
      });
      return false;
    }

    const maxSize = 5 * 1024 * 1024;

    if (files.some((f) => f.size > maxSize)) {
      toast({
        title: "File too large",
        description: "Each image must be < 5MB",
        variant: "destructive",
      });
      return false;
    }

    if (files.some((f) => !f.type.startsWith("image/"))) {
      toast({
        title: "Invalid file",
        description: "Only images allowed",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFiles = (files: File[]) => {
    if (!files.length) return;
    if (!validateFiles(files)) return;
    onImagesChange([...images, ...files]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.target.files || []);
    handleFiles(files);

    if (inputRef.current) inputRef.current.value = "";
  };

  const openFileDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    inputRef.current?.click();
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`transition rounded-xl p-2 ${
        isDragging ? "bg-[#f5f9ec] border border-[#b7cf8a]" : ""
      }`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
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
            className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 text-gray-500 transition ${
              isDragging
                ? "border-[#b7cf8a] text-[#7a9a3a] bg-[#f5f9ec]"
                : "border-gray-300 hover:border-[#b7cf8a] hover:text-[#7a9a3a]"
            }`}
          >
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs">
              {isDragging ? "Drop images" : "Upload Image"}
            </span>
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
        Drag & drop or upload up to {maxImages} images (Max 5MB each)
      </p>
    </div>
  );
}