"use client";
import { useIptv } from "@/hooks/iptvContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const ChannelsPage = () => {
  const { cat } = useParams();
  const { channels, loading, fetchChannels, formatStreamUrl } = useIptv();

  useEffect(() => {
    if (cat) {
      fetchChannels(cat);
    }
  }, [cat]);

  if (loading && !channels) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-700 border-t-zinc-400 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl text-zinc-400">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Back button and header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
          >
            <svg 
              className="w-5 h-5 text-zinc-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-white">Back</span>
          </Link>

          <h1 className="text-3xl font-bold text-white">Channels</h1>
        </div>

        {/* Channels Grid */}
        {channels && channels.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {channels.map((chan) => (
              <Link
                href={`/${cat}/${chan.stream_id}`}
                key={chan.stream_id}
                className="block group"
                onClick={() => formatStreamUrl(chan.stream_id)}
              >
                <div className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden transition-colors p-4 h-56 flex flex-col">
                  {/* Channel Icon */}
                  <div className="flex-1 flex items-center justify-center overflow-hidden mb-3">
                    {chan.stream_icon ? (
                      <img
                        src={chan.stream_icon}
                        alt={chan.name}
                        className="max-h-28 max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback icon */}
                    <div className={`${chan.stream_icon ? 'hidden' : 'flex'} w-20 h-20 bg-zinc-800 rounded-lg items-center justify-center`}>
                      <svg className="w-10 h-10 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                  </div>

                  {/* Channel Name */}
                  <p className="text-white text-sm text-center line-clamp-2">
                    {chan.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {channels && channels.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Channels Available</h3>
            <p className="text-zinc-500">There are no channels in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelsPage;