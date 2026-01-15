export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const username = process.env.NEXT_PUBLIC_IPTV_USERNAME
    const password = process.env.NEXT_PUBLIC_IPTV_PASSWORD
  
    const streamUrl = `http://freeiptv.ottc.xyz:80/live/${username}/${password}/${id}.m3u8`;
  
    const response = await fetch(streamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });
  
    return new Response(response.body, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  