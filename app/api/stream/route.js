export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (!id) {
      return new Response("Missing id parameter", { status: 400 });
  }
  
  const username = process.env.IPTV_USERNAME;
  const password = process.env.IPTV_PASSWORD;

  const streamUrl = `http://freeiptv.ottc.xyz:443/live/${username}/${password}/${id}.m3u8`;

  try {
      const response = await fetch(streamUrl, {
          headers: {
              "User-Agent": "Mozilla/5.0",
          },
      });

      if (!response.ok) {
          return new Response("Stream not found", { status: response.status });
      }
      
      // Get the m3u8 content as text
      const m3u8Content = await response.text();
      
      // Return the content as-is for now to see what it contains
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