/**
 * Vercel Serverless Function — Pterodactyl + Minecraft Status Proxy
 * Endpoint: GET /api/pterodactyl
 *
 * Reads PTERODACTYL_API_KEY from Vercel environment variables.
 * Returns server list from Pterodactyl panel + live MC status from mcsrvstat.us
 */

const PANEL_URL = 'https://panel.tame.gg';
const MC_ADDRESS = 'play.tame.gg';

// Cache to avoid hammering APIs
let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 15000; // 15 seconds

// Servers to display publicly (by name substring)
const PUBLIC_SERVERS = [
  'MCTT01', 'MCTT02', 'MCTTv3', 'hub', 'velo',
  'parkour', 'one block', 'AK01'
];

function classifyServer(name, env) {
  const lower = name.toLowerCase();
  const jar = env?.SERVER_JARFILE || '';
  if (lower.includes('velo') || jar.includes('bungeecord')) return 'proxy';
  if (lower.includes('hub')) return 'hub';
  if (lower.includes('parkour') || lower.includes('minigame')) return 'minigame';
  if (lower.includes('one block') || lower.includes('modpack')) return 'modpack';
  if (lower.includes('mctt') || lower.includes('smp')) return 'survival';
  if (lower.includes('ak01') || lower.includes('archive')) return 'survival';
  return 'server';
}

function cleanServerName(name) {
  // Remove "tame | " prefix
  return name.replace(/^tame\s*\|\s*/i, '').trim();
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Return cache if fresh
  if (cachedData && Date.now() - cacheTime < CACHE_TTL) {
    return res.status(200).json(cachedData);
  }

  const apiKey = process.env.PTERODACTYL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'PTERODACTYL_API_KEY not configured' });
  }

  try {
    // Fetch both in parallel
    const [pteroRes, mcRes] = await Promise.all([
      fetch(`${PANEL_URL}/api/application/servers`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }),
      fetch(`https://api.mcsrvstat.us/3/${MC_ADDRESS}`),
    ]);

    // Parse Pterodactyl servers
    let servers = [];
    if (pteroRes.ok) {
      const pteroData = await pteroRes.json();
      servers = (pteroData.data || [])
        .map(s => s.attributes)
        .filter(s => {
          const name = s.name || '';
          return PUBLIC_SERVERS.some(pub => name.toLowerCase().includes(pub.toLowerCase()));
        })
        .filter(s => {
          // Exclude dev servers
          const name = (s.name || '').toLowerCase();
          return !name.includes('dev') && !name.includes('restapi');
        })
        .map(s => ({
          name: cleanServerName(s.name),
          type: classifyServer(s.name, s.container?.environment),
          memory_mb: s.limits?.memory || 0,
          suspended: s.suspended || false,
        }));
    }

    // Parse Minecraft status
    let network = { online: false, players: { online: 0, max: 0 }, version: null, address: MC_ADDRESS };
    if (mcRes.ok) {
      const mcData = await mcRes.json();
      network = {
        online: mcData.online || false,
        players: mcData.players || { online: 0, max: 0 },
        version: mcData.version || null,
        motd: mcData.motd?.clean?.[0] || null,
        address: MC_ADDRESS,
      };
    }

    const result = { network, servers, fetched_at: Date.now() };
    cachedData = result;
    cacheTime = Date.now();

    return res.status(200).json(result);
  } catch (err) {
    console.error('Pterodactyl proxy error:', err.message);
    return res.status(500).json({ error: 'Internal error' });
  }
};
