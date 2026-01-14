export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
  
    const streamUrl = `http://freeiptv.ottc.xyz:80/live/544657673522/329236004368/${id}.m3u8`;
  
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
  