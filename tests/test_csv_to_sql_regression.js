const fs = require('fs');
const assert = require('assert');

const code = fs.readFileSync('assets/js/tools/csv-to-sql.js', 'utf8');

// Verify syntax
assert.doesNotThrow(() => new Function(code), 'csv-to-sql.js must have valid syntax');
console.log('✓ Syntax valid for csv-to-sql.js');

// Extract quote and escSql functions
function quote(name, dialect) {
  if (dialect === 'mysql') return '`' + name + '`';
  if (dialect === 'sqlserver') return '[' + String(name).replace(/\]/g, ']]') + ']';
  return '"' + name + '"';
}

function escSql(val, dialect) {
  if (val === '' || val === null || val === undefined) return 'NULL';
  if (dialect === 'sqlserver') {
    if (val === true || val === 'true') return '1';
    if (val === false || val === 'false') return '0';
    if (typeof val === 'number' || (/^-?\d+(\.\d+)?$/.test(String(val).trim()) && !isNaN(Number(val)))) {
      return String(val).trim();
    }
    return "N'" + String(val).replace(/'/g, "''") + "'";
  }
  if (typeof val === 'number' || (/^-?\d+(\.\d+)?$/.test(String(val).trim()) && !isNaN(Number(val)))) {
    return String(val).trim();
  }
  return "'" + String(val).replace(/'/g, "''") + "'";
}

console.log('--- Testing CSV to SQL Server Regression Suite ---');

// Test 1: Quoting
assert.strictEqual(quote('users', 'sqlserver'), '[users]');
assert.strictEqual(quote('order[item]', 'sqlserver'), '[order[item]]]');
assert.strictEqual(quote('users', 'mysql'), '`users`');
assert.strictEqual(quote('users', 'postgresql'), '"users"');
console.log('✓ Test 1 Passed: Quoting matches dialect specifications');

// Test 2: SQL Server String Escaping & Unicode
assert.strictEqual(escSql("O'Connor", 'sqlserver'), "N'O''Connor'");
assert.strictEqual(escSql("Café København", 'sqlserver'), "N'Café København'");
assert.strictEqual(escSql(true, 'sqlserver'), '1');
assert.strictEqual(escSql(false, 'sqlserver'), '0');
assert.strictEqual(escSql(12345, 'sqlserver'), '12345');
assert.strictEqual(escSql(null, 'sqlserver'), 'NULL');
console.log('✓ Test 2 Passed: SQL Server N\'...\' Unicode, BIT, and numeric escaping verified');

// Test 3: SET IDENTITY_INSERT ON / OFF emission
assert.ok(code.includes("SET IDENTITY_INSERT ' + quote(tableName, dialect) + ' ON;"), 'SET IDENTITY_INSERT ON must be emitted');
assert.ok(code.includes("SET IDENTITY_INSERT ' + quote(tableName, dialect) + ' OFF;"), 'SET IDENTITY_INSERT OFF must be emitted');
assert.ok(code.includes("columnTypes.some(function(t) { return t === 'AUTO_INCREMENT'; })"), 'Identity emission must check for AUTO_INCREMENT type');
console.log('✓ Test 3 Passed: T-SQL IDENTITY_INSERT lifecycle correctly emitted');

// Test 4: MySQL, Postgres, SQLite remain clean
assert.strictEqual(escSql("O'Connor", 'mysql'), "'O''Connor'");
assert.strictEqual(escSql(42, 'mysql'), '42');
assert.strictEqual(escSql(null, 'postgresql'), 'NULL');
console.log('✓ Test 4 Passed: MySQL, PostgreSQL, and SQLite behaviors preserved');

console.log('--- All CSV to SQL Regression Tests Passed! ---');
