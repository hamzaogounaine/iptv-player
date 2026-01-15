"use client";
import Player from "@/components/Player";
import { useIptv } from "@/hooks/iptvContext";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PlayerPage = () => {
  const { chan } = useParams();
  const router = useRouter();
  const { formatStramUrl, streamUrl } = useIptv();
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (chan) {
      formatStramUrl(chan);
    }
  }, [chan]);

  useEffect(() => {
    if (streamUrl) {
      setIsLoading(false);
    }
  }, [streamUrl]);

  const handleRefresh = () => {
    location.reload()
    setIsLoading(true);
    formatStramUrl(chan);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add your favorite logic here (save to localStorage, context, etc.)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-700 border-t-zinc-400 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl text-zinc-400">Loading Stream...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-white hover:text-zinc-300 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-red-600/80 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">LIVE</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-2 text-white hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Refresh stream"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className="p-2 text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg
                className="w-5 h-5"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Player Container */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-black rounded-lg overflow-hidden aspect-video">
          {chan && streamUrl && <Player />}
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;