// ── MCTT Server Status Page

const SERVER_ICONS = {
  survival: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  proxy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
  hub: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  minigame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  modpack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
};

const TYPE_LABELS = {
  survival: 'Survival SMP',
  proxy: 'Network Proxy',
  hub: 'Hub Server',
  minigame: 'Minigame',
  modpack: 'Modpack',
  server: 'Server',
};

function formatMemory(mb) {
  if (!mb || mb === 0) return 'Unlimited';
  if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
  return mb + ' MB';
}

async function fetchMCTTStatus() {
  try {
    const res = await fetch('/api/pterodactyl');
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (e) {
    console.error('Failed to fetch MCTT status:', e);
    return null;
  }
}

function renderNetworkBanner(network) {
  const dot = document.getElementById('netDot');
  const status = document.getElementById('netStatus');
  const players = document.getElementById('netPlayers');
  const version = document.getElementById('netVersion');
  const banner = document.getElementById('networkBanner');

  if (network.online) {
    dot.classList.add('online');
    dot.classList.remove('offline');
    status.textContent = 'Online';
    banner.classList.add('online');
    banner.classList.remove('offline');
  } else {
    dot.classList.add('offline');
    dot.classList.remove('online');
    status.textContent = 'Offline';
    banner.classList.add('offline');
    banner.classList.remove('online');
  }

  players.textContent = network.players?.online ?? 0;
  if (network.version) {
    version.textContent = 'Versions ' + network.version;
  }
}

function srvStatusClass(srv) {
  if (srv.suspended) return 'suspended';
  switch (srv.current_state) {
    case 'running':  return 'active';
    case 'starting':
    case 'stopping': return 'starting';
    case 'stopped':
    case 'offline':  return 'offline';
    default:         return srv.current_state ? 'offline' : 'active';
  }
}

function srvStatusLabel(srv) {
  if (srv.suspended) return 'Suspended';
  switch (srv.current_state) {
    case 'running':  return 'Online';
    case 'starting': return 'Starting';
    case 'stopping': return 'Stopping';
    case 'stopped':
    case 'offline':  return 'Offline';
    default:         return srv.current_state ? 'Offline' : 'Active';
  }
}

function renderServers(servers) {
  const grid = document.getElementById('serverGrid');
  if (!servers || servers.length === 0) {
    grid.innerHTML = '<div class="mctt-empty">No servers available</div>';
    return;
  }

  // Sort: proxy first, then hub, then survival, then rest
  const order = { proxy: 0, hub: 1, survival: 2, minigame: 3, modpack: 4, server: 5 };
  servers.sort((a, b) => (order[a.type] ?? 9) - (order[b.type] ?? 9));

  grid.innerHTML = servers.map((srv, i) => `
    <div class="mctt-server-card rv d${(i % 4) + 1}">
      <div class="mctt-srv-icon">${SERVER_ICONS[srv.type] || SERVER_ICONS.server}</div>
      <div class="mctt-srv-info">
        <div class="mctt-srv-name">${srv.name}</div>
        <div class="mctt-srv-type">${TYPE_LABELS[srv.type] || 'Server'}</div>
      </div>
      <div class="mctt-srv-meta">
        <div class="mctt-srv-status ${srvStatusClass(srv)}">
          <span class="mctt-srv-dot"></span>
          ${srvStatusLabel(srv)}
        </div>
        <div class="mctt-srv-memory">${formatMemory(srv.memory_mb)} RAM</div>
      </div>
    </div>
  `).join('');

  // Re-trigger GSAP for newly added elements
  if (typeof gsap !== 'undefined') {
    gsap.utils.toArray('.mctt-server-card').forEach(card => {
      gsap.fromTo(card,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08 }
      );
    });
  }
}

// Initial load
async function init() {
  const data = await fetchMCTTStatus();
  if (data) {
    renderNetworkBanner(data.network);
    renderServers(data.servers);
  } else {
    document.getElementById('netStatus').textContent = 'Error';
    document.getElementById('serverGrid').innerHTML = '<div class="mctt-empty">Failed to load server status. Try refreshing.</div>';
  }
}

init();

// Auto-refresh every 30 seconds
setInterval(async () => {
  const data = await fetchMCTTStatus();
  if (data) {
    renderNetworkBanner(data.network);
    renderServers(data.servers);
  }
}, 30000);
