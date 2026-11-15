const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function getAccessToken() {
  const credsPath = 'C:\\Users\\abdul.sammad\\.gemini\\credentials\\anyconverterio-1a118e4f2ba9.json';
  const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  const encode = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsignedToken = encode(header) + '.' + encode(claimSet);
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsignedToken);
  sign.end();
  const signature = sign.sign(creds.private_key, 'base64url');
  const jwt = unsignedToken + '.' + signature;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt })
  });
  const data = await res.json();
  return data.access_token;
}

async function inspectUrl(token, url) {
  try {
    const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl: 'sc-domain:anyconverter.io'
      })
    });
    if (!res.ok) {
      const err = await res.text();
      return { url, error: `${res.status}: ${err}` };
    }
    const data = await res.json();
    const result = data.inspectionResult || {};
    const idx = result.indexStatusResult || {};
    return {
      url,
      inspectionTimestamp: new Date().toISOString(),
      verdict: idx.verdict || 'UNKNOWN',
      coverageState: idx.coverageState || 'UNKNOWN',
      robotsTxtState: idx.robotsTxtState || 'UNKNOWN',
      indexingState: idx.indexingState || 'UNKNOWN',
      pageFetchState: idx.pageFetchState || 'UNKNOWN',
      googleCanonical: idx.googleCanonical || '',
      userCanonical: idx.userCanonical || '',
      lastCrawlTime: idx.lastCrawlTime || '',
      crawledAs: idx.crawledAs || '',
      referringUrls: idx.referringUrls || []
    };
  } catch (err) {
    return { url, error: err.message };
  }
}

function classifyStatus(row) {
  if (row.error) return 'API_ERROR';
  const cov = (row.coverageState || '').toLowerCase();
  const verd = (row.verdict || '').toLowerCase();
  if (verd === 'pass' || cov.includes('indexed')) {
    return 'INDEXED';
  }
  if (cov.includes('unknown')) {
    return 'NOT_INDEXED_UNKNOWN';
  }
  if (cov.includes('discovered')) {
    return 'NOT_INDEXED_DISCOVERED';
  }
  if (cov.includes('crawled')) {
    return 'NOT_INDEXED_CRAWLED';
  }
  return 'OTHER';
}

function toCsv(headers, rows) {
  const headerLine = headers.join(',');
  const rowLines = rows.map(r => headers.map(h => {
    let val = r[h] !== undefined ? r[h] : '';
    if (Array.isArray(val)) val = val.join('; ');
    if (typeof val === 'string') {
      val = '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }).join(','));
  return [headerLine, ...rowLines].join('\n');
}

async function main() {
  const token = await getAccessToken();
  const testUrls = [
    // Phase 2 Priority Targets
    'https://anyconverter.io/json-compare/',
    'https://anyconverter.io/reverse-percentage-calculator/',
    'https://anyconverter.io/camt053-to-csv/',
    'https://anyconverter.io/es/camt053-to-csv/',
    'https://anyconverter.io/da/camt053-to-csv/',
    'https://anyconverter.io/barcode-generator/',
    'https://anyconverter.io/es/barcode-generator/',
    'https://anyconverter.io/da/barcode-generator/',
    'https://anyconverter.io/parquet-to-csv/',
    'https://anyconverter.io/developer-tools/',
    'https://anyconverter.io/productivity-tools/',
    'https://anyconverter.io/pdf-tools/',
    'https://anyconverter.io/calculators/',
    'https://anyconverter.io/da/calculators/',
    'https://anyconverter.io/es/calculators/',
    // Core Roots
    'https://anyconverter.io/',
    'https://anyconverter.io/es/',
    'https://anyconverter.io/da/',
    // High Traffic & Key Tools
    'https://anyconverter.io/ip-address-lookup/',
    'https://anyconverter.io/sticky-notes/',
    'https://anyconverter.io/es/sticky-notes/',
    'https://anyconverter.io/da/todo-list/',
    'https://anyconverter.io/da/loan-calculator/',
    'https://anyconverter.io/da/mortgage-calculator/',
    'https://anyconverter.io/loan-calculator/',
    'https://anyconverter.io/es/loan-calculator/',
    'https://anyconverter.io/mortgage-calculator/',
    'https://anyconverter.io/es/mortgage-calculator/',
    'https://anyconverter.io/json-formatter/',
    'https://anyconverter.io/es/json-formatter/',
    'https://anyconverter.io/da/json-formatter/',
    'https://anyconverter.io/world-clock/',
    'https://anyconverter.io/es/world-clock/',
    'https://anyconverter.io/da/world-clock/',
    'https://anyconverter.io/pdf-merge/',
    'https://anyconverter.io/es/pdf-merge/',
    'https://anyconverter.io/redact-pdf/',
    'https://anyconverter.io/percentage-difference-calculator/',
    'https://anyconverter.io/date-difference-calculator/',
    'https://anyconverter.io/time-duration-calculator/'
  ];

  console.log(`Starting URL Inspection for ${testUrls.length} priority URLs...`);
  const results = [];
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`[${i + 1}/${testUrls.length}] Inspecting ${url}...`);
    const res = await inspectUrl(token, url);
    res.classification = classifyStatus(res);
    results.push(res);
    // Slight pause to avoid rate limits
    await new Promise(r => setTimeout(r, 600));
  }

  const outDir = path.resolve('reports/seo-remediation-2026-11');
  fs.mkdirSync(outDir, { recursive: true });

  const headers = [
    'url', 'classification', 'verdict', 'coverageState',
    'robotsTxtState', 'indexingState', 'pageFetchState',
    'googleCanonical', 'userCanonical', 'lastCrawlTime',
    'crawledAs', 'referringUrls', 'inspectionTimestamp'
  ];

  const csvContent = toCsv(headers, results);
  fs.writeFileSync(path.join(outDir, '03_INDEXABILITY_VERIFICATION.csv'), csvContent, 'utf8');
  fs.writeFileSync(path.join(outDir, 'INDEXING_STATUS_RECHECK.csv'), csvContent, 'utf8');
  fs.writeFileSync(path.join(outDir, 'url_inspection_raw.json'), JSON.stringify(results, null, 2), 'utf8');

  console.log('✓ URL Inspection audit complete. Summary of verdicts:');
  const counts = {};
  results.forEach(r => {
    counts[r.classification] = (counts[r.classification] || 0) + 1;
  });
  console.log(JSON.stringify(counts, null, 2));
}

main().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});
