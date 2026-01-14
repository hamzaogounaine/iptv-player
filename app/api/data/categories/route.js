export async function GET() {
    const params = new URLSearchParams({
      username: process.env.NEXT_PUBLIC_IPTV_USERNAME,
      password: process.env.NEXT_PUBLIC_IPTV_PASSWORD,
      action: "get_live_categories",
    });
  
    const url = `${process.env.NEXT_PUBLIC_IPTV_HOST}/player_api.php?${params.toString()}`;
  
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        cache: "no-store",
      });
  
      if (!res.ok) {
        return new Response("Failed to fetch categories", { status: 500 });
      }
  
      const data = await res.json();
  
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err) {
      return new Response("Server error", { status: 500 });
    }
  }
  