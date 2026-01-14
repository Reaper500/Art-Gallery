"use client";

import { useState, useEffect } from "react";

const LIKED_ARTWORKS_KEY = "art_gallery_liked_artworks";

export function useLikedArtworks() {
  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());

  // Load liked artworks from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LIKED_ARTWORKS_KEY);
        if (stored) {
          const liked = JSON.parse(stored) as string[];
          setLikedArtworks(new Set(liked));
        }
      } catch (error) {
        console.error("Error loading liked artworks from localStorage:", error);
      }
    }
  }, []);

  // Check if an artwork is liked
  const isLiked = (artworkId: string) => {
    return likedArtworks.has(artworkId);
  };

  // Mark an artwork as liked
  const markAsLiked = (artworkId: string) => {
    if (typeof window !== "undefined" && !likedArtworks.has(artworkId)) {
      const newLiked = new Set(likedArtworks);
      newLiked.add(artworkId);
      setLikedArtworks(newLiked);
      
      try {
        localStorage.setItem(LIKED_ARTWORKS_KEY, JSON.stringify(Array.from(newLiked)));
      } catch (error) {
        console.error("Error saving liked artworks to localStorage:", error);
      }
    }
  };

  return { isLiked, markAsLiked };
}
