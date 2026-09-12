# Phase 03 Day 09 - JSON And CSV Briefs

Generated: 2026-09-10

## Objective

Create rewrite briefs for `/json-formatter/`, `/csv-to-sql/`, and `/csv-query/`.

## `/json-formatter/` Brief

Verified tool facts:

- Parses JSON with `JSON.parse`.
- Formats/minifies with `JSON.stringify`.
- Supports 2-space, 4-space, and tab indentation.
- Can sort object keys ascending or descending.
- Provides validation errors, stats, tree rendering, copy/download.
- Converts to YAML through local logic.
- Converts to CSV only when the JSON is an object or array of objects.

Recommended intro:

`Use JSON Formatter to validate, format, minify, and inspect JSON in your browser. Choose indentation, sort keys when needed, switch to a tree view, and export YAML or CSV when the JSON shape supports it.`

Practical example:

`Example: Paste an API response, format it with 2-space indentation, sort keys to compare objects, then use the validation message to find syntax errors before saving `formatted.json`.`

Limits:

- Invalid JSON stops formatting.
- CSV conversion is shape-limited.
- Very large JSON depends on browser memory.

## `/csv-to-sql/` Brief

Verified tool facts:

- Parses pasted CSV or uploaded CSV with PapaParse.
- File parsing uses 5 MB chunks.
- Supports auto or selected delimiter.
- Header row can be enabled/disabled.
- Type detection samples the first 50 rows.
- Supports MySQL, PostgreSQL, and SQLite style identifier quoting.
- Can generate DROP TABLE, CREATE TABLE, and INSERT statements.
- Batch insert mode uses 500 rows per INSERT.
- Empty values become `NULL`; single quotes are escaped by doubling.
- Download default: `data.sql`.

Recommended intro:

`Use CSV to SQL to turn pasted or uploaded CSV data into CREATE TABLE and INSERT statements. Choose the SQL dialect, review the detected column types, override types when needed, and download a `.sql` file.`

Practical example:

`Example: Upload a customer export with headers, choose PostgreSQL, review the first 50-row type suggestions, enable batch inserts for a shorter script, and download `data.sql`.`

Limits:

- Type detection is a first-50-row estimate.
- Generated SQL should be reviewed before running against production databases.
- Large files are chunked but still limited by browser memory and output size.

## `/csv-query/` Brief

Current mismatch:

- H1 says CSV Query Tool.
- SEO H2 currently says "Csv to sql: practical uses", which conflicts with the actual page intent.

Verified tool facts:

- Parses uploaded CSV with PapaParse using `header: true`.
- Creates a SQL.js database in the browser.
- Loads SQL.js WASM from cdnjs.
- Creates a table named `data`.
- Stores all CSV columns as TEXT.
- Default query is `SELECT * FROM data LIMIT 10`.
- Results are paginated, sortable, and exportable as CSV or JSON.
- Query history is in memory only.

Recommended intro:

`Use CSV Query to run SQL SELECT-style analysis on an uploaded CSV in your browser. The file is loaded into an in-memory table named `data`, so you can filter, sort, group, and export query results without setting up a database.`

Practical example:

`Example: Upload a sales CSV, run `SELECT region, COUNT(*) FROM data GROUP BY region`, inspect the paginated result table, and export the answer as CSV or JSON.`

Limits:

- Columns are loaded as TEXT, so numeric comparisons may need casts.
- SQL.js/WASM browser memory limits apply.
- Do not position this as CSV-to-SQL script generation; that is `/csv-to-sql/`.

## Day 09 Handoff

Phase 04 should fix the `/csv-query/` SEO heading mismatch and keep `/csv-query/` separate from `/csv-to-sql/` by intent: querying versus script generation.
