"use client";

import { useState, useEffect } from "react";

const DISLIKED_ARTWORKS_KEY = "art_gallery_disliked_artworks";

export function useDislikedArtworks() {
  const [dislikedArtworks, setDislikedArtworks] = useState<Set<string>>(new Set());

  // Load disliked artworks from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(DISLIKED_ARTWORKS_KEY);
        if (stored) {
          const disliked = JSON.parse(stored) as string[];
          setDislikedArtworks(new Set(disliked));
        }
      } catch (error) {
        console.error("Error loading disliked artworks from localStorage:", error);
      }
    }
  }, []);

  // Check if an artwork is disliked
  const isDisliked = (artworkId: string) => {
    return dislikedArtworks.has(artworkId);
  };

  // Mark an artwork as disliked
  const markAsDisliked = (artworkId: string) => {
    if (typeof window !== "undefined" && !dislikedArtworks.has(artworkId)) {
      const newDisliked = new Set(dislikedArtworks);
      newDisliked.add(artworkId);
      setDislikedArtworks(newDisliked);
      
      try {
        localStorage.setItem(DISLIKED_ARTWORKS_KEY, JSON.stringify(Array.from(newDisliked)));
      } catch (error) {
        console.error("Error saving disliked artworks to localStorage:", error);
      }
    }
  };

  return { isDisliked, markAsDisliked };
}
