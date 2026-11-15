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

async function queryGSC(token, siteUrl, payload) {
  const url = 'https://www.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(siteUrl) + '/searchAnalytics/query';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error('GSC API Error ' + res.status + ': ' + (await res.text()));
  }
  return await res.json();
}

async function fetchAllRows(token, siteUrl, basePayload, maxRows = 25000) {
  let allRows = [];
  let startRow = 0;
  const rowLimit = 5000;

  while (startRow < maxRows) {
    const payload = {
      ...basePayload,
      rowLimit: rowLimit,
      startRow: startRow
    };
    const data = await queryGSC(token, siteUrl, payload);
    if (!data.rows || data.rows.length === 0) break;
    allRows = allRows.concat(data.rows);
    if (data.rows.length < rowLimit) break;
    startRow += data.rows.length;
  }
  return allRows;
}

function toCsv(headers, rows) {
  const headerLine = headers.join(',');
  const rowLines = rows.map(r => headers.map(h => {
    let val = r[h] !== undefined ? r[h] : '';
    if (typeof val === 'string') {
      val = '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }).join(','));
  return [headerLine, ...rowLines].join('\n');
}

async function main() {
  const siteUrl = 'sc-domain:anyconverter.io';
  const token = await getAccessToken();
  const startDate = '2026-07-10';
  const endDate = '2026-11-08';
  const outDir = path.resolve('reports/seo-remediation-2026-11');

  console.log('Extracting Query-level performance...');
  const queryData = await fetchAllRows(token, siteUrl, { startDate, endDate, dimensions: ['query'] });
  const queryRows = queryData.map(r => ({
    query: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: (r.ctr * 100).toFixed(2) + '%',
    position: r.position.toFixed(1)
  })).sort((a, b) => b.impressions - a.impressions);

  fs.writeFileSync(path.join(outDir, 'TOP_100_EXISTING_QUERIES.csv'), toCsv(['query', 'clicks', 'impressions', 'ctr', 'position'], queryRows.slice(0, 100)));

  console.log('Extracting Page-level performance...');
  const pageData = await fetchAllRows(token, siteUrl, { startDate, endDate, dimensions: ['page'] });
  const pageRows = pageData.map(r => ({
    page: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: (r.ctr * 100).toFixed(2) + '%',
    position: r.position.toFixed(1)
  })).sort((a, b) => b.impressions - a.impressions);

  fs.writeFileSync(path.join(outDir, 'GSC_PAGE_PERFORMANCE.csv'), toCsv(['page', 'clicks', 'impressions', 'ctr', 'position'], pageRows));

  console.log('Extracting Query + Page mapping...');
  const queryPageData = await fetchAllRows(token, siteUrl, { startDate, endDate, dimensions: ['query', 'page'] });
  const queryPageRows = queryPageData.map(r => ({
    query: r.keys[0],
    page: r.keys[1],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: (r.ctr * 100).toFixed(2) + '%',
    position: r.position.toFixed(1)
  })).sort((a, b) => b.impressions - a.impressions);

  fs.writeFileSync(path.join(outDir, 'GSC_KEYWORD_OPPORTUNITIES.csv'), toCsv(['query', 'page', 'clicks', 'impressions', 'ctr', 'position'], queryPageRows));

  console.log('Extracting Query + Page + Country performance for EN, ES, DA categorization...');
  const queryPageCountryData = await fetchAllRows(token, siteUrl, { startDate, endDate, dimensions: ['query', 'page', 'country'] });
  const multiDimRows = queryPageCountryData.map(r => {
    const q = r.keys[0];
    const p = r.keys[1];
    const c = r.keys[2];
    let locale = 'EN';
    if (p.includes('/es/') || /^(es|mx|ar|co|cl|pe|ve)$/i.test(c)) locale = 'ES';
    if (p.includes('/da/') || /^dnk$/i.test(c)) locale = 'DA';
    return {
      query: q,
      page: p,
      country: c,
      locale,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: (r.ctr * 100).toFixed(2) + '%',
      position: r.position.toFixed(1),
      provenance: 'GSC Search Analytics API (sc-domain:anyconverter.io)'
    };
  }).sort((a, b) => b.impressions - a.impressions);

  fs.writeFileSync(path.join(outDir, '06_GSC_KEYWORDS_EN_ES_DA.csv'), toCsv(
    ['query', 'page', 'country', 'locale', 'clicks', 'impressions', 'ctr', 'position', 'provenance'],
    multiDimRows
  ));

  // Language slices
  const enRows = multiDimRows.filter(r => r.locale === 'EN');
  const esRows = multiDimRows.filter(r => r.locale === 'ES');
  const daRows = multiDimRows.filter(r => r.locale === 'DA');

  fs.writeFileSync(path.join(outDir, 'EN_KEYWORD_PRIORITY.csv'), toCsv(['query', 'page', 'country', 'clicks', 'impressions', 'ctr', 'position'], enRows.slice(0, 50)));
  fs.writeFileSync(path.join(outDir, 'ES_KEYWORD_PRIORITY.csv'), toCsv(['query', 'page', 'country', 'clicks', 'impressions', 'ctr', 'position'], esRows.slice(0, 50)));
  fs.writeFileSync(path.join(outDir, 'DA_KEYWORD_PRIORITY.csv'), toCsv(['query', 'page', 'country', 'clicks', 'impressions', 'ctr', 'position'], daRows.slice(0, 50)));

  console.log(`✓ Generated dimension CSVs:`);
  console.log(`  - TOP_100_EXISTING_QUERIES.csv (${queryRows.length} total queries)`);
  console.log(`  - GSC_PAGE_PERFORMANCE.csv (${pageRows.length} pages)`);
  console.log(`  - GSC_KEYWORD_OPPORTUNITIES.csv (${queryPageRows.length} pairs)`);
  console.log(`  - 06_GSC_KEYWORDS_EN_ES_DA.csv (${multiDimRows.length} query-page-country tuples)`);
  console.log(`  - EN_KEYWORD_PRIORITY.csv (${enRows.length} tuples)`);
  console.log(`  - ES_KEYWORD_PRIORITY.csv (${esRows.length} tuples)`);
  console.log(`  - DA_KEYWORD_PRIORITY.csv (${daRows.length} tuples)`);
}

main().catch(err => {
  console.error('Extraction error:', err);
  process.exit(1);
});
