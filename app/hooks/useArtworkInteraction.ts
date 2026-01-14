"use client";

import { useState, useEffect } from "react";

const LIKED_ARTWORKS_KEY = "art_gallery_liked_artworks";
const DISLIKED_ARTWORKS_KEY = "art_gallery_disliked_artworks";

export function useArtworkInteraction() {
  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());
  const [dislikedArtworks, setDislikedArtworks] = useState<Set<string>>(new Set());

  // Load liked and disliked artworks from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const likedStored = localStorage.getItem(LIKED_ARTWORKS_KEY);
        if (likedStored) {
          const liked = JSON.parse(likedStored) as string[];
          setLikedArtworks(new Set(liked));
        }
        
        const dislikedStored = localStorage.getItem(DISLIKED_ARTWORKS_KEY);
        if (dislikedStored) {
          const disliked = JSON.parse(dislikedStored) as string[];
          setDislikedArtworks(new Set(disliked));
        }
      } catch (error) {
        console.error("Error loading artwork interactions from localStorage:", error);
      }
    }
  }, []);

  // Check if an artwork is liked
  const isLiked = (artworkId: string) => {
    return likedArtworks.has(artworkId);
  };

  // Check if an artwork is disliked
  const isDisliked = (artworkId: string) => {
    return dislikedArtworks.has(artworkId);
  };

  // Mark an artwork as liked (removes dislike if exists)
  const markAsLiked = (artworkId: string) => {
    if (typeof window !== "undefined") {
      const newLiked = new Set(likedArtworks);
      const newDisliked = new Set(dislikedArtworks);
      
      // Remove from disliked if it was disliked
      if (newDisliked.has(artworkId)) {
        newDisliked.delete(artworkId);
        setDislikedArtworks(newDisliked);
        try {
          localStorage.setItem(DISLIKED_ARTWORKS_KEY, JSON.stringify(Array.from(newDisliked)));
        } catch (error) {
          console.error("Error saving disliked artworks to localStorage:", error);
        }
      }
      
      // Add to liked
      if (!newLiked.has(artworkId)) {
        newLiked.add(artworkId);
        setLikedArtworks(newLiked);
        try {
          localStorage.setItem(LIKED_ARTWORKS_KEY, JSON.stringify(Array.from(newLiked)));
        } catch (error) {
          console.error("Error saving liked artworks to localStorage:", error);
        }
      }
    }
  };

  // Mark an artwork as disliked (removes like if exists)
  const markAsDisliked = (artworkId: string) => {
    if (typeof window !== "undefined") {
      const newLiked = new Set(likedArtworks);
      const newDisliked = new Set(dislikedArtworks);
      
      // Remove from liked if it was liked
      if (newLiked.has(artworkId)) {
        newLiked.delete(artworkId);
        setLikedArtworks(newLiked);
        try {
          localStorage.setItem(LIKED_ARTWORKS_KEY, JSON.stringify(Array.from(newLiked)));
        } catch (error) {
          console.error("Error saving liked artworks to localStorage:", error);
        }
      }
      
      // Add to disliked
      if (!newDisliked.has(artworkId)) {
        newDisliked.add(artworkId);
        setDislikedArtworks(newDisliked);
        try {
          localStorage.setItem(DISLIKED_ARTWORKS_KEY, JSON.stringify(Array.from(newDisliked)));
        } catch (error) {
          console.error("Error saving disliked artworks to localStorage:", error);
        }
      }
    }
  };

  return { isLiked, isDisliked, markAsLiked, markAsDisliked };
}
