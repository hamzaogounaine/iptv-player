export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const segment = searchParams.get("segment");
    
    if (!id) {
        return new Response("Missing id parameter", { status: 400 });
    }
    
    const username = process.env.NEXT_PUBLIC_IPTV_USERNAME;
    const password = process.env.NEXT_PUBLIC_IPTV_PASSWORD;
    const host = "http://freeiptv.ottc.xyz";
  
    // If requesting a segment, proxy it directly
    if (segment) {
        const segmentUrl = `${host}${segment}`;
        console.log("Fetching segment:", segmentUrl);
        
        try {
            const response = await fetch(segmentUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                },
            });
  
            if (!response.ok) {
                console.error("Segment not found:", response.status);
                return new Response("Segment not found", { status: response.status });
            }
  
            return new Response(response.body, {
                headers: {
                    "Content-Type": response.headers.get("Content-Type") || "video/MP2T",
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "no-cache",
                },
            });
        } catch (error) {
            console.error("Segment fetch error:", error);
            return new Response(`Failed to fetch segment: ${error.message}`, { status: 500 });
        }
    }
  
    // Fetch and modify the m3u8 playlist
    const streamUrl = `${host}/live/${username}/${password}/${id}.m3u8`;
    console.log("Fetching playlist:", streamUrl);
  
    try {
        const response = await fetch(streamUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        });
  
        if (!response.ok) {
            console.error("Stream not found:", response.status);
            return new Response("Stream not found", { status: response.status });
        }
        
        let m3u8Content = await response.text();
        
        // Rewrite segment URLs to go through our proxy
        const lines = m3u8Content.split('\n');
        const modifiedLines = lines.map(line => {
            const trimmed = line.trim();
            
            // Skip comments and empty lines
            if (!trimmed || trimmed.startsWith('#')) {
                return line;
            }
            
            // This is a segment path - proxy it
            // The segments look like: /1768515537/40fa10113578aa60e7dfaf29310e329e/t1/xyz-xxx/play
            return `/api/stream?id=${id}&segment=${encodeURIComponent(trimmed)}`;
        });
        
        const modifiedContent = modifiedLines.join('\n');
        
        return new Response(modifiedContent, {
            headers: {
                "Content-Type": "application/vnd.apple.mpegurl",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.error("Stream fetch error:", error);
        return new Response(`Failed to fetch stream: ${error.message}`, { status: 500 });
    }
  }