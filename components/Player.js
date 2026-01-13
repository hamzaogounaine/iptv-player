"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { useIptv } from "@/hooks/iptvContext";

export default function Player() {
  const { streamUrl } = useIptv();
  const videoRef = useRef(null);

  useEffect(() => {
    if (!streamUrl) return;

    const video = videoRef.current;
    

    // If browser supports HLS natively (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.play();
    } else if (Hls.isSupported()) {
      // Use HLS.js for Chrome/Firefox
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      // Clean up on unmount
      return () => {
        hls.destroy();
      };
    }
  }, [streamUrl]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      style={{ width: "100%", height: "100%" }}
    />
  );
}
