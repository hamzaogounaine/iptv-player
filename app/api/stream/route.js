export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const segment = searchParams.get("segment"); // For proxying segments
  
  if (!id) {
      return new Response("Missing id parameter", { status: 400 });
  }
  
  const username = process.env.IPTV_USERNAME;
  const password = process.env.IPTV_PASSWORD;
  const host =  "http://freeiptv.ottc.xyz:443";

  // If requesting a segment, proxy it directly
  if (segment) {
      const segmentUrl = `${host}/live/${username}/${password}/${segment}`;
      try {
          const response = await fetch(segmentUrl, {
              headers: {
                  "User-Agent": "Mozilla/5.0",
              },
          });

          if (!response.ok) {
              return new Response("Segment not found", { status: response.status });
          }

          return new Response(response.body, {
              headers: {
                  "Content-Type": response.headers.get("Content-Type") || "video/MP2T",
                  "Access-Control-Allow-Origin": "*",
              },
          });
      } catch (error) {
          console.error("Segment fetch error:", error);
          return new Response(`Failed to fetch segment: ${error.message}`, { status: 500 });
      }
  }

  // Otherwise, fetch and modify the m3u8 playlist
  const streamUrl = `${host}/live/${username}/${password}/${id}.m3u8`;
  console.log(streamUrl);

  try {
      const response = await fetch(streamUrl, {
          headers: {
              "User-Agent": "Mozilla/5.0",
          },
      });

      if (!response.ok) {
          return new Response("Stream not found", { status: response.status });
      }
      
      let m3u8Content = await response.text();
      
      // Rewrite URLs in the m3u8 to go through our proxy
      m3u8Content = m3u8Content.split('\n').map(line => {
          // Skip comments and empty lines
          if (line.startsWith('#') || line.trim() === '') {
              return line;
          }
          
          // If it's a URL line, rewrite it
          if (line.trim()) {
              // Extract just the filename/path from the URL
              let segmentPath = line.trim();
              
              // Handle absolute URLs
              if (segmentPath.startsWith('http')) {
                  const url = new URL(segmentPath);
                  segmentPath = url.pathname.split('/').pop();
              }
              
              // Rewrite to go through our proxy
              return `/api/stream?id=${id}&segment=${encodeURIComponent(segmentPath)}`;
          }
          
          return line;
      }).join('\n');
      
      return new Response(m3u8Content, {
          headers: {
              "Content-Type": "application/vnd.apple.mpegurl",
              "Access-Control-Allow-Origin": "*",
          },
      });
  } catch (error) {
      console.error("Stream fetch error:", error);
      return new Response(`Failed to fetch stream: ${error.message}`, { status: 500 });
  }
}