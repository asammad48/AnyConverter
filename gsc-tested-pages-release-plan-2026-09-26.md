# GSC-Tested Pages Release Plan - 2026-09-26

Source: Google Search Console, `anyconverter.io`, Performance > Search results > Pages, last 3 months.

## What Google Is Testing

Search Console showed 144 visible tested page rows after expanding the Pages table to 500 rows. Earlier the paginated table showed `1-10 of 215`; after a clean reload and row expansion it showed `1-145 of 145`, with 144 parsed page rows. The release plan below is based on the expanded visible rows and prioritizes impressions first.

## Highest Priority Pages

These pages have the strongest Search Console signal and should be part of the tomorrow release.

| Priority | Page | 3-month clicks | 3-month impressions | Action |
| --- | --- | ---: | ---: | --- |
| P0 | `/ip-address-lookup/` | 0 | 3,253 | Updated title/meta for location, ISP, ASN, timezone promise |
| P0 | `/discount-calculator/` | 0 | 506 | Updated title/meta for sale price, percent off, fixed discount, savings |
| P0 | `/internet-speed-test/` | 0 | 419 | Updated title for download/upload/ping intent |
| P0 | `/pdf-forms/` | 0 | 392 | Updated title/meta for fill, flatten, private completion |
| P0 | `/es/remove-pdf-pages/` | 0 | 334 | Updated Spanish meta for removing pages/ranges and privacy |
| P1 | `/da/internet-speed-test/` | 0 | 284 | Updated Danish title/meta for download/upload/ping |
| P1 | `/extract-pdf-pages/` | 0 | 175 | Updated title/meta for selected pages and ranges |
| P1 | `/es/ocr-pdf/` | 0 | 168 | Updated Spanish meta for scanned PDFs/images to editable text |
| P1 | `/pdf-merge/` | 0 | 151 | Normalized title punctuation for cleaner SERP rendering |
| P1 | `/es/qr-code-generator/` | 0 | 133 | Updated Spanish meta for URLs/text/email/phone and PNG download |
| P1 | `/es/pdf-merge/` | 2 | 322 | Updated Spanish meta/OG for combining PDFs |
| P1 | `/` | 2 | 210 | Updated homepage title/meta for clearer brand/category match |

## Other GSC-Tested Pages Seen

These had impressions and should be reviewed after the tomorrow release if the first batch improves CTR:

- `/es/extract-pdf-pages/` - 105 impressions
- `/keyboard-tester/` - 103
- `/es/rotate-pdf/` - 99
- `/da/mortgage-calculator/` - 86
- `/gst-vat-calculator/` - 81
- `/uuid-generator/` - 80
- `/add-watermark/` - 80
- `/es/pdf-compress/` - 79
- `/es/pdf-split/` - 79
- `/monitor-color-test/` - 75
- `/da/bmi-calculator/` - 75
- `/remove-pdf-pages/` - 73
- `/es/tip-calculator/` - 67
- `/add-page-numbers/` - 65
- `/da/qr-code-generator/` - 63
- `/es/blood-type-compatibility/` - 62
- `/es/calorie-calculator/` - 56
- `/csv-to-sql/` - 55
- `/da/pdf-compress/` - 52
- `/csv-query/` - 51
- `/dead-pixel-checker/` - 50
- `/viewport-size/` - 49
- `/da/invoice-generator/` - 49
- `/es/sticky-notes/` - 48
- `/team-picker/` - 44
- `/es/word-counter/` - 44
- `/meeting-timer/` - 43
- `/blood-type-compatibility/` - 42
- `/px-to-rem/` - 42
- `/es/compare-pdf/` - 42
- `/tip-calculator/` - 41
- `/da/todo-list/` - 40
- `/es/pdf-to-jpg/` - 40
- `/es/jpg-to-pdf/` - 40
- `/es/unlock-pdf/` - 40
- `/es/text-diff-checker/` - 39
- `/sticky-notes/` - 36
- `/password-strength-checker/` - 35
- `/daily-planner/` - 34
- `/da/pdf-to-jpg/` - 34
- `/es/` - 33
- `/da/age-calculator/` - 32
- `/es/base64-encoder/` - 32
- `/mortgage-calculator/` - 31
- `/es/discount-calculator/` - 29
- `/da/ocr-pdf/` - 29
- `/da/word-counter/` - 28
- `/es/webcam-tester/` - 27
- `/microphone-tester/` - 26
- `/da/loan-calculator/` - 25
- `/sleep-calculator/` - 23
- `/ocr-pdf/` - 23
- `/da/countdown-timer/` - 21
- `/es/json-formatter/` - 21
- `/es/optimize-pdf/` - 21
- `/decision-maker/` - 20
- `/da/coin-flip/` - 19
- `/dice-roller/` - 19
- `/es/px-to-rem/` - 18
- `/es/random-number-generator/` - 18
- `/es/sign-pdf/` - 17
- `/crop-pdf/` - 17
- `/press/` - 16
- `/roman-numeral-converter/` - 16
- `/da/` - 16

## Notes

- The biggest CTR opportunity is still `/ip-address-lookup/`: it has the most impressions and no 3-month clicks in the Pages table, but it produced clicks in the latest 24-hour view.
- For tomorrow, do not rewrite every low-impression page. Release the focused metadata batch, then watch Search Console for 3-7 days.
- Also check HTTP variants after release: GSC showed `http://anyconverter.io/` and `http://anyconverter.io/es/morse-code-converter/` with clicks. HTTPS reporting is clean, but these URLs should still redirect canonically to HTTPS.
