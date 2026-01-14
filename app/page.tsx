"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { ImageModal } from "./components/ImageModal";
import { useArtworkInteraction } from "./hooks/useArtworkInteraction";
import { Navbar } from "./components/Navbar";
import { AnimatedBubbles } from "./components/AnimatedBubbles";

export default function Home() {
  const artworks = useQuery(api.artworks.list);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);

  return (
    <main className="min-h-screen relative bg-black">
      <AnimatedBubbles />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-left mb-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-purple-400">
              J&M Art Gallery
            </h1>
            <div className="space-y-3 sm:space-y-4 text-base sm:text-lg md:text-xl text-gray-300 leading-tight sm:leading-normal">
              <p className="font-medium text-purple-400">
                Welcome to our creative journey
              </p>
              <p className="hidden sm:block">
                J&M Art Gallery was born from a <span className="text-purple-400 font-medium">shared passion for beauty</span>, creativity, and the transformative power of art. 
                What started as a simple dream between two friends has evolved into a <span className="text-purple-400 font-medium">vibrant space</span> where colors, emotions, 
                and stories come alive on canvas.
              </p>
              <p className="sm:hidden">
                J&M Art Gallery was born from a <span className="text-purple-400 font-medium">shared passion for beauty and creativity</span>. 
                What started as a dream between two friends has evolved into a vibrant space where art comes alive.
              </p>
              <p className="hidden sm:block">
                Our journey began with a love for exploring different mediums, techniques, and perspectives. Every piece 
                in our collection tells a story—whether it's the <span className="text-purple-400 font-medium">quiet moments of inspiration</span>, the bold strokes of experimentation, 
                or the joyful celebration of life's beautiful moments.
              </p>
              <p className="sm:hidden">
                Every piece in our collection tells a story of <span className="text-purple-400 font-medium">inspiration, experimentation</span>, 
                and the celebration of life's beautiful moments.
              </p>
              <p className="font-medium text-purple-400">
                We invite you to explore, connect, and find something that speaks to your heart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Artworks Gallery Section */}
      <section className="px-4 sm:px-6 pb-20 relative z-10">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-purple-400">
            Our Collection
          </h2>

          {artworks === undefined ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading artworks...</p>
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600 mb-4">No artworks yet</p>
              <p className="text-gray-500">Check back soon for new additions to our collection!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork._id}
                  artwork={artwork}
                  onImageClick={() => setSelectedArtwork(artwork)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </main>
  );
}

function ArtworkCard({
  artwork,
  onImageClick,
}: {
  artwork: any;
  onImageClick: () => void;
}) {
  const imageUrl = useQuery(api.files.getFileUrl, {
    storageId: artwork.imageId,
  });
  const likeArtwork = useMutation(api.artworks.like);
  const dislikeArtwork = useMutation(api.artworks.dislike);
  const { isLiked, isDisliked, markAsLiked, markAsDisliked } = useArtworkInteraction();
  
  const hasLiked = isLiked(artwork._id);
  const hasDisliked = isDisliked(artwork._id);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${artwork.title.replace(/[^a-z0-9]/gi, "_")}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) return; // Already liked, do nothing
    
    const hadDisliked = hasDisliked;
    await likeArtwork({ id: artwork._id, hadDisliked });
    markAsLiked(artwork._id);
  };

  const handleDislike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasDisliked) return; // Already disliked, do nothing
    
    const hadLiked = hasLiked;
    await dislikeArtwork({ id: artwork._id, hadLiked });
    markAsDisliked(artwork._id);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 border border-purple-500/20">
      <div
        className="aspect-square relative bg-gray-800 cursor-pointer"
        onClick={onImageClick}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="animate-pulse text-gray-400 text-xs sm:text-sm">Loading...</div>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-900/90 backdrop-blur-sm">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {artwork.title}
        </h2>
        {artwork.artist && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2">By {artwork.artist}</p>
        )}
        {artwork.description && (
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3">
            {artwork.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleLike}
            disabled={hasLiked}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-xs sm:text-sm font-medium min-h-[36px] sm:min-h-[40px] ${
              hasLiked
                ? "bg-red-100 text-red-400 cursor-not-allowed"
                : "bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200"
            }`}
            title={hasLiked ? "You've already liked this artwork" : "Like this artwork"}
          >
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 ${hasLiked ? "fill-red-400" : "fill-red-600"}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{artwork.likes || 0}</span>
          </button>
          <button
            onClick={handleDislike}
            disabled={hasDisliked}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-xs sm:text-sm font-medium min-h-[36px] sm:min-h-[40px] ${
              hasDisliked
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300"
            }`}
            title={hasDisliked ? "You've already disliked this artwork" : "Dislike this artwork"}
          >
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 ${hasDisliked ? "fill-gray-500" : "fill-gray-600"}`}
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ transform: "rotate(180deg)" }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{artwork.dislikes || 0}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 active:scale-95 transition-all duration-200 text-xs sm:text-sm font-medium min-h-[36px] sm:min-h-[40px] justify-center flex-shrink-0"
            title="Download image"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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
  );
}

function ArtworkModal({ artwork, onClose }: { artwork: any; onClose: () => void }) {
  const imageUrl = useQuery(api.files.getFileUrl, {
    storageId: artwork.imageId,
  });
  const likeArtwork = useMutation(api.artworks.like);
  const dislikeArtwork = useMutation(api.artworks.dislike);
  const artworks = useQuery(api.artworks.list);
  const { isLiked, isDisliked, markAsLiked, markAsDisliked } = useArtworkInteraction();
  
  const currentArtwork = artworks?.find((a) => a._id === artwork._id);
  const likes = currentArtwork?.likes || artwork.likes || 0;
  const dislikes = currentArtwork?.dislikes || artwork.dislikes || 0;
  const hasLiked = isLiked(artwork._id);
  const hasDisliked = isDisliked(artwork._id);

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${artwork.title.replace(/[^a-z0-9]/gi, "_")}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleLike = async () => {
    if (hasLiked) return; // Already liked, do nothing
    
    const hadDisliked = hasDisliked;
    await likeArtwork({ id: artwork._id, hadDisliked });
    markAsLiked(artwork._id);
  };

  const handleDislike = async () => {
    if (hasDisliked) return; // Already disliked, do nothing
    
    const hadLiked = hasLiked;
    await dislikeArtwork({ id: artwork._id, hadLiked });
    markAsDisliked(artwork._id);
  };

  return (
    <ImageModal
      imageUrl={imageUrl}
      title={artwork.title}
      artist={artwork.artist}
      description={artwork.description}
      likes={likes}
      dislikes={dislikes}
      hasLiked={hasLiked}
      hasDisliked={hasDisliked}
      onClose={onClose}
      onDownload={handleDownload}
      onLike={handleLike}
      onDislike={handleDislike}
    />
  );
}
