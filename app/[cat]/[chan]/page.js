"use client";
import Player from "@/components/Player";
import { useIptv } from "@/hooks/iptvContext";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PlayerPage = () => {
  const { chan } = useParams();
  const router = useRouter();
  const { formatStramUrl, streamUrl } = useIptv();
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    let timeout;
    if (showControls && !isLoading) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isLoading]);

  const handleMouseMove = () => {
    setShowControls(true);
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
    <div
      className="relative min-h-screen bg-black"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      {/* Top Navigation Bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 transition-all duration-300 ${
          showControls ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="bg-gradient-to-b from-black/90 to-transparent p-4">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm rounded-lg transition-colors border border-zinc-800"
            >
              <svg
                className="w-5 h-5 text-white"
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
              <span className="text-white">Back</span>
            </button>

            {/* Live indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-red-900/30 backdrop-blur-sm rounded-lg border border-red-900/50">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Player Area */}
      <div className="relative w-full h-screen flex items-center justify-center">
        {chan && streamUrl && (
          <div className="w-full h-full">
            <Player />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${
          showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="bg-gradient-to-t from-black/90 to-transparent p-6">
          <div className="max-w-[1920px] mx-auto">
            {/* Video Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Previous */}
              <button className="w-12 h-12 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors border border-zinc-800">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>

              {/* Rewind */}
              <button className="w-12 h-12 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors border border-zinc-800">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>

              {/* Play/Pause */}
              <button className="w-16 h-16 bg-white hover:bg-zinc-200 rounded-full flex items-center justify-center transition-colors shadow-lg">
                <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </button>

              {/* Forward */}
              <button className="w-12 h-12 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors border border-zinc-800">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>

              {/* Next */}
              <button className="w-12 h-12 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors border border-zinc-800">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Volume */}
                <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm rounded-lg transition-colors border border-zinc-800">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Settings */}
                <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm rounded-lg transition-colors border border-zinc-800">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              {/* Fullscreen */}
              <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm rounded-lg transition-colors border border-zinc-800">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;