/**
 * Vercel Function — Spotify Currently Playing Proxy
 * Endpoint: GET /api/spotify
 *
 * Reads credentials from Vercel environment variables:
 *   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 *
 * Caches access tokens in memory (~59 min) to minimize Spotify API calls.
 */

export const maxDuration = 10;

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const basic = Buffer.from(
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET,
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + basic,
    },
    body: "grant_type=refresh_token&refresh_token=" + process.env.SPOTIFY_REFRESH_TOKEN,
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // refresh 60s early
  return cachedToken!;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "no-cache, no-store",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const token = await getAccessToken();

    const playerRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: "Bearer " + token },
    });

    // 204 = nothing playing, 202 = accepted but no content
    if (playerRes.status === 204 || playerRes.status === 202) {
      return Response.json({ is_playing: false }, { headers: CORS_HEADERS });
    }

    if (!playerRes.ok) {
      return Response.json(
        { error: "Spotify returned " + playerRes.status },
        { status: 502, headers: CORS_HEADERS },
      );
    }

    const data = await playerRes.json();

    return Response.json(
      {
        is_playing: data.is_playing || false,
        progress_ms: data.progress_ms || 0,
        track: data.item?.name || null,
        artist: data.item?.artists?.[0]?.name || null,
        duration_ms: data.item?.duration_ms || 0,
        album_art: data.item?.album?.images?.[1]?.url || data.item?.album?.images?.[0]?.url || null,
      },
      { headers: CORS_HEADERS },
    );
  } catch (err) {
    console.error("Spotify proxy error:", (err as Error).message);
    return Response.json({ error: "Internal error" }, { status: 500, headers: CORS_HEADERS });
  }
}
