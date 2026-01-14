"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function AdminPage() {
  const router = useRouter();
  const { checkAuth, logout } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artist, setArtist] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createArtwork = useMutation(api.artworks.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const artworks = useQuery(api.artworks.list);
  const removeArtwork = useMutation(api.artworks.remove);

  useEffect(() => {
    // Check authentication and redirect if not logged in
    if (!checkAuth()) {
      router.push("/login");
    }
  }, [router, checkAuth]);

  // Don't render if not authenticated (will redirect)
  if (!checkAuth()) {
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) {
      alert("Please select an image and provide a title");
      return;
    }

    setIsUploading(true);
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload the file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await result.json();

      // Create artwork record
      await createArtwork({
        title: title.trim(),
        description: description.trim() || undefined,
        artist: artist.trim() || undefined,
        imageId: storageId,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setArtist("");
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      alert("Artwork uploaded successfully!");
    } catch (error) {
      console.error("Error uploading artwork:", error);
      alert("Failed to upload artwork. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this artwork?")) {
      try {
        await removeArtwork({ id: id as any });
      } catch (error) {
        console.error("Error deleting artwork:", error);
        alert("Failed to delete artwork.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors text-sm sm:text-base font-medium"
            >
              Logout
            </button>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Upload and manage artworks</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Upload Form */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Upload New Artwork
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 active:file:bg-gray-700 file:cursor-pointer"
                  required
                />
                {previewUrl && (
                  <div className="mt-4 aspect-square relative w-full max-w-xs mx-auto sm:mx-0 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artist
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-y text-black"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gray-900 text-white py-3 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 active:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-base sm:text-sm min-h-[44px]"
              >
                {isUploading ? "Uploading..." : "Upload Artwork"}
              </button>
            </form>
          </div>

          {/* Artworks List */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Manage Artworks ({artworks?.length || 0})
            </h2>
            <div className="space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
              {artworks === undefined ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="mt-2 text-gray-600 text-sm sm:text-base">Loading...</p>
                </div>
              ) : artworks.length === 0 ? (
                <p className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
                  No artworks uploaded yet
                </p>
              ) : (
                artworks.map((artwork) => (
                  <ArtworkListItem
                    key={artwork._id}
                    artwork={artwork}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ArtworkListItem({
  artwork,
  onDelete,
}: {
  artwork: any;
  onDelete: (id: string) => void;
}) {
  const imageUrl = useQuery(api.files.getFileUrl, {
    storageId: artwork.imageId,
  });

  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-50 transition-colors">
      <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={artwork.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-400 text-xs">Loading...</div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{artwork.title}</h3>
        {artwork.artist && (
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">By {artwork.artist}</p>
        )}
        {artwork.description && (
          <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
            {artwork.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(artwork._id)}
        className="px-3 py-2 sm:px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors text-xs sm:text-sm font-medium flex-shrink-0 min-h-[44px] self-center"
      >
        Delete
      </button>
    </div>
  );
}
