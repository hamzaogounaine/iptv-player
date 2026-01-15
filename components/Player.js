"use client";

import { useEffect, useRef } from "react";
import { useIptv } from "@/hooks/iptvContext";

export default function Player() {
  const { streamUrl } = useIptv();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    // Load Plyr CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.plyr.io/3.7.8/plyr.css";
    document.head.appendChild(link);

    // Load Plyr JS
    const script = document.createElement("script");
    script.src = "https://cdn.plyr.io/3.7.8/plyr.js";
    script.async = true;
    script.onload = () => {
      if (videoRef.current && window.Plyr) {
        playerRef.current = new window.Plyr(videoRef.current, {
          controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'fullscreen'
          ],
          autoplay: true,
          muted: false,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Load HLS.js from CDN for HLS support
    if (!window.Hls) {
      const hlsScript = document.createElement("script");
      hlsScript.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      hlsScript.onload = () => initializeStream();
      document.body.appendChild(hlsScript);
    } else {
      initializeStream();
    }

    function initializeStream() {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
        });
        hlsRef.current = hls;
        
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          // Ensure autoplay
          video.play().catch(error => {
            console.log("Autoplay failed:", error);
            // If autoplay fails, user interaction is required
          });
        });

        hls.on(window.Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
        });
        
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(error => {
            console.log("Autoplay failed:", error);
          });
        });
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl]);

  if (!streamUrl) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        Select a channel to start streaming
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <video 
        ref={videoRef}
        playsInline
        autoPlay
        muted={false}
      />
    </div>
  );
}