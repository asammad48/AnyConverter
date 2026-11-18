# Third-party skill attribution

The following skills under `.agents/skills/` were vendored from public open-source
Claude Skill repositories on 2026-11-18. Upstream content is included unmodified
in `SKILL.md` and `references/*`. Project-specific skills (prefixed
`anyconverter-*`, plus `ui-ux-pro-max` and `anyconverter-design-quality`) are
first-party and not from these upstreams.

| Skill folder | Upstream repo | License | Upstream path |
|---|---|---|---|
| `seo-audit` | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | MIT | `skills/seo-audit` |
| `ai-seo` | coreyhaines31/marketingskills | MIT | `skills/ai-seo` |
| `schema` | coreyhaines31/marketingskills | MIT | `skills/schema` |
| `programmatic-seo` | coreyhaines31/marketingskills | MIT | `skills/programmatic-seo` |
| `site-architecture` | coreyhaines31/marketingskills | MIT | `skills/site-architecture` |
| `link-building` | coreyhaines31/marketingskills | MIT | `skills/link-building` |
| `analytics` | coreyhaines31/marketingskills | MIT | `skills/analytics` |
| `seo-hreflang` | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | MIT | `skills/seo-hreflang` |
| `seo-sitemap` | AgriciDaniel/claude-seo | MIT | `skills/seo-sitemap` |

**Repositories reviewed but NOT installed (license / overlap reasons):**

- `Illyism/seo-skills` — no SPDX license declared → cannot redistribute. Useful as a
  reference only.
- `borghei/Claude-Skills` — `NOASSERTION` license → cannot redistribute.
- `thatrebeccarae/claude-marketing` — MIT, but `aeo-geo-optimizer` overlaps with
  installed `ai-seo`; other skills (Klaviyo/Shopify/Braze/Meta ads) are not applicable
  to AnyConverter's static tools platform.

Both AgriciDaniel/claude-seo and coreyhaines31/marketingskills are MIT-licensed.
See each upstream repo for full license text. Project-specific skills are
authored for this repo under the project's own license.
