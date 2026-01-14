"use client";

import { useEffect } from "react";
import Image from "next/image";

interface ImageModalProps {
  imageUrl: string | null;
  title: string;
  artist?: string;
  description?: string;
  likes: number;
  dislikes: number;
  hasLiked: boolean;
  hasDisliked: boolean;
  onClose: () => void;
  onDownload: () => void;
  onLike: () => void;
  onDislike: () => void;
}

export function ImageModal({
  imageUrl,
  title,
  artist,
  description,
  likes,
  dislikes,
  hasLiked,
  hasDisliked,
  onClose,
  onDownload,
  onLike,
  onDislike,
}: ImageModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {title}
            </h2>
            {artist && (
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                By {artist}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className="relative flex-1 bg-gray-100 min-h-0 flex items-center justify-center p-4">
          {imageUrl && (
            <div className="relative w-full h-full max-h-[60vh] flex items-center justify-center">
              <Image
                src={imageUrl}
                alt={title}
                width={1200}
                height={1200}
                className="max-w-full max-h-full object-contain rounded-lg"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Footer with description and buttons */}
        <div className="p-4 border-t border-gray-200 bg-white">
          {description && (
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              {description}
            </p>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={onLike}
              disabled={hasLiked}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base min-h-[44px] ${
                hasLiked
                  ? "bg-red-100 text-red-400 cursor-not-allowed"
                  : "bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200"
              }`}
              title={hasLiked ? "You've already liked this artwork" : "Like this artwork"}
            >
              <svg
                className={`w-5 h-5 ${hasLiked ? "fill-red-400" : "fill-red-600"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{likes}</span>
            </button>
            <button
              onClick={onDislike}
              disabled={hasDisliked}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base min-h-[44px] ${
                hasDisliked
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300"
              }`}
              title={hasDisliked ? "You've already disliked this artwork" : "Dislike this artwork"}
            >
              <svg
                className={`w-5 h-5 ${hasDisliked ? "fill-gray-500" : "fill-gray-600"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ transform: "rotate(180deg)" }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{dislikes}</span>
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors font-medium text-sm sm:text-base min-h-[44px] justify-center flex-shrink-0"
              title="Download image"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="hidden sm:inline">DL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
