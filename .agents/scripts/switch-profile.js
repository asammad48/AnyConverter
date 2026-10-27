#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '..', 'mcp_config.json');

const PROFILES = {
  'seo': {
    name: 'PROFILE 1 — SEO RESEARCH',
    enabled: ['google-search-console', 'cloudflare-api'],
    disabled: ['chrome-devtools', 'playwright', 'github', 'stitch', 'google-analytics']
  },
  'design': {
    name: 'PROFILE 2 — DESIGN AND TESTING',
    enabled: ['chrome-devtools', 'playwright', 'github', 'stitch', 'cloudflare-api'],
    disabled: ['google-search-console', 'google-analytics']
  },
  'diagnostics': {
    name: 'PROFILE 3 — DIAGNOSTICS & AUDIT',
    enabled: ['google-search-console', 'cloudflare-api', 'chrome-devtools', 'github'],
    disabled: ['playwright', 'stitch', 'google-analytics']
  }
};

function main() {
  const arg = (process.argv[2] || '').toLowerCase().replace(/^--?/, '');

  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found at: ${configPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(configPath, 'utf8');
  let config;
  try {
    config = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse ${configPath}:`, err.message);
    process.exit(1);
  }

  if (!config.mcpServers) config.mcpServers = {};

  if (!arg || arg === 'status') {
    console.log('Current MCP Server Status:');
    for (const [key, val] of Object.entries(config.mcpServers)) {
      const state = val.disabled ? 'DISABLED' : 'ENABLED';
      console.log(`  - ${key.padEnd(24)}: ${state}`);
    }
    console.log('\nAvailable Profiles:');
    console.log('  node .agents/scripts/switch-profile.js seo          # Profile 1: SEO Research');
    console.log('  node .agents/scripts/switch-profile.js design       # Profile 2: Design & Testing');
    console.log('  node .agents/scripts/switch-profile.js diagnostics  # Profile 3: Diagnostics & Audit');
    return;
  }

  const profile = PROFILES[arg];
  if (!profile) {
    console.error(`Unknown profile: "${arg}". Available: seo, design, diagnostics, status`);
    process.exit(1);
  }

  for (const serverName of profile.enabled) {
    if (config.mcpServers[serverName]) {
      config.mcpServers[serverName].disabled = false;
    }
  }

  for (const serverName of profile.disabled) {
    if (config.mcpServers[serverName]) {
      config.mcpServers[serverName].disabled = true;
    }
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log(`Switched to ${profile.name}`);
  console.log(`Enabled : ${profile.enabled.join(', ')}`);
  console.log(`Disabled: ${profile.disabled.join(', ')}`);
}

main();
