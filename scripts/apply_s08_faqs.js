#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const faqData = {
  'ip-address-lookup': [
    {
      q: 'How do I look up my public IP address?',
      a: 'Your public IP address is automatically detected and displayed as soon as you open this page. You can also type any IPv4 or IPv6 address into the search input to look up its country, city, ISP, ASN, and timezone.'
    },
    {
      q: 'What is the difference between a public and private IP address?',
      a: 'A public IP address is assigned by your internet service provider (ISP) and identifies your device or router on the global internet. A private IP address (such as 192.168.x.x or 10.x.x.x) is used only within your local home or office network.'
    },
    {
      q: 'Can someone find my physical street address from my IP address?',
      a: "No. IP geolocation identifies the geographic region, city, or postal code routing point of your ISP's network hub, not your exact physical home address or GPS coordinates."
    },
    {
      q: 'Is my IP address or search query logged on this site?',
      a: 'No. All IP lookups run directly from your browser with zero server logging. AnyConverter does not record, track, or sell your IP address or lookup history.'
    },
    {
      q: 'What does the ASN number mean?',
      a: 'An ASN (Autonomous System Number) is a globally unique identifier for a large network or internet service provider (such as Comcast, AT&T, or Google Cloud) that controls IP routing on the internet.'
    },
    {
      q: 'Does using a VPN or proxy change my IP address?',
      a: 'Yes. When connected to a VPN or proxy, web services see the IP address and geolocation of the VPN server rather than your personal ISP-assigned IP address.'
    }
  ],

  'discount-calculator': [
    {
      q: 'How do I calculate a discount percentage formula?',
      a: 'To calculate a discount percentage, divide the discount amount by the original price and multiply by 100. For example, if an item drops from $100 to $80, the $20 savings divided by $100 equals 0.20, which is a 20% discount.'
    },
    {
      q: 'How do I calculate the final sale price after a discount?',
      a: 'Multiply the original price by the discount percentage divided by 100 to find your savings, then subtract that savings from the original price. For a $50 item with a 15% discount: 50 × 0.15 = $7.50 savings, making the sale price $42.50.'
    },
    {
      q: 'Can I calculate stacked or double discounts (e.g., 20% off plus an extra 10%)?',
      a: 'Yes. Stacked discounts apply sequentially rather than additively. For example, a $100 item with 20% off becomes $80, and an additional 10% off $80 reduces it by $8 to a final price of $72 (an effective 28% total discount, not 30%).'
    },
    {
      q: 'How do I find the original price before a discount was applied?',
      a: 'Divide the discounted sale price by (1 minus the discount rate). For example, if you paid $60 after a 25% discount, divide $60 by 0.75 to find the original pre-sale price of $80.'
    },
    {
      q: 'What is the difference between a percentage discount and a fixed-amount discount?',
      a: 'A percentage discount reduces the cost relative to the item price (e.g., 20% off), whereas a fixed discount subtracts an exact dollar amount (e.g., $15 off coupon) regardless of total price.'
    }
  ],

  'daily-planner': [
    {
      q: 'How does the daily planner save my tasks and schedule?',
      a: 'Your daily schedule, time blocks, and task completion states are automatically saved directly in your web browser using local storage. Your planner data persists across page refreshes and browser restarts without requiring an account.'
    },
    {
      q: 'Can I view and schedule plans for past or future dates?',
      a: 'Yes. Use the date picker at the top to navigate to any date. Each calendar day maintains an independent schedule and task list, allowing you to plan upcoming days or review completed routines.'
    },
    {
      q: 'What is time blocking and how do I use it in the planner?',
      a: 'Time blocking is a productivity method where you divide your day into dedicated time slots for specific tasks. Enter start times and estimated durations to build a visual schedule that prevents multitasking and context switching.'
    },
    {
      q: 'Can I export or print my daily schedule?',
      a: "Yes. You can print your schedule or save it as a clean PDF document using your browser's print dialog (Ctrl+P or Cmd+P), formatted specifically for daily desk reference."
    },
    {
      q: 'Is there a limit to how many tasks or time blocks I can add?',
      a: 'No. You can add as many tasks and scheduled blocks as you need. Modern browser local storage easily accommodates thousands of entries with instant loading and zero lag.'
    }
  ],

  'internet-speed-test': [
    {
      q: 'What is considered a good download and upload speed?',
      a: 'For general web browsing and HD streaming, 25 Mbps download is sufficient. For 4K streaming, remote work, and video conferencing, 50 to 100 Mbps is recommended. Competitive gaming and large file uploads benefit from 100+ Mbps download and 20+ Mbps upload.'
    },
    {
      q: 'What is the difference between download speed, upload speed, and ping?',
      a: 'Download speed measures how fast data transfers from the internet to your device. Upload speed measures how quickly you send data to others. Ping (latency) measures the round-trip reaction time in milliseconds; lower ping means a more responsive connection.'
    },
    {
      q: "Why does my speed test result differ from my ISP's advertised speed?",
      a: "Advertised speeds represent theoretical maximums under optimal conditions. Real-world speeds can be affected by Wi-Fi interference, distance from the router, network congestion during peak hours, background downloads, and router hardware limits."
    },
    {
      q: 'How can I improve my internet speed test results?',
      a: 'Connect your computer directly via an Ethernet cable rather than Wi-Fi, close bandwidth-heavy streaming or cloud sync apps, restart your modem and router, and run tests at different times of day to rule out ISP throttling.'
    },
    {
      q: 'Does running this speed test upload or log personal data?',
      a: 'No. The speed test transmits temporary dummy data chunks solely to calculate bandwidth throughput and round-trip latency. No personal browsing data, IP logs, or files are collected or stored.'
    }
  ],

  'pdf-merge': [
    {
      q: 'How many PDF files can I merge at once?',
      a: "There is no arbitrary file count limit. You can combine two PDFs or dozens of documents in a single operation. The only constraint is your device's available browser memory."
    },
    {
      q: 'Are my PDF files uploaded to an external server?',
      a: 'No. All document processing, page extraction, and merging executes 100% locally in your web browser using WebAssembly and client-side JavaScript without uploading to any server.'
    },
    {
      q: 'Can I choose specific pages or change the page order before merging?',
      a: 'Yes. You can drag and drop files to reorder them, sort them alphabetically, and expand individual documents to deselect unwanted pages before creating the final merged file.'
    },
    {
      q: 'Will merging reduce the resolution or visual quality of my PDF?',
      a: 'No. Pages and embedded vector graphics, fonts, and images are copied directly into the new PDF container without lossy recompression or downsampling.'
    },
    {
      q: 'Why did a blank page appear in my merged document?',
      a: 'If you enable double-sided printing mode, a blank page is automatically inserted after any document with an odd number of pages so that subsequent documents start on a clean front sheet.'
    }
  ],

  'pdf-forms': [
    {
      q: 'Why does my PDF say it has no interactive form fields?',
      a: 'Not all PDF forms contain interactive digital form fields (AcroForms or XFA). If form blanks are simply static text or scanned images, fields cannot be automatically selected. For static documents, use a PDF annotation tool to overlay text.'
    },
    {
      q: 'What does flattening a PDF form mean?',
      a: 'Flattening converts active interactive form fields (such as text boxes, checkboxes, and radio buttons) into permanent, uneditable page content. This ensures answers display identically across all PDF readers and cannot be altered.'
    },
    {
      q: 'Can I save my filled PDF form and edit it later?',
      a: 'Yes. If you download your completed PDF without flattening, interactive form fields remain editable so you or a recipient can update values in any standard PDF viewer.'
    },
    {
      q: 'Are my filled form responses or uploaded files kept private?',
      a: 'Yes. Form rendering, field population, and PDF export occur entirely inside your browser sandbox. Confidential personal or financial data entered into form fields is never transmitted to any external server.'
    },
    {
      q: 'Does this form filler support digital signatures and checkboxes?',
      a: 'Yes. Standard interactive checkboxes, radio buttons, dropdown menus, and text fields are supported and can be clicked, typed, and saved with complete layout fidelity.'
    }
  ],

  'extract-pdf-pages': [
    {
      q: 'How do I extract specific pages from a PDF?',
      a: 'Select or drop your PDF into the tool, click on the specific pages you wish to keep, or enter a page range. Then click Extract to generate and download a new PDF containing only your selected pages.'
    },
    {
      q: 'Can I change the order of extracted pages in the new PDF?',
      a: 'Yes. Enable the "Keep the order I click" option to arrange extracted pages in the exact sequence you select them, allowing you to reorder pages as you split.'
    },
    {
      q: 'Are my documents uploaded to a remote server during extraction?',
      a: 'No. Page reading, rendering, and extraction occur entirely within your web browser. Confidential documents and private PDFs remain secure on your local device.'
    },
    {
      q: 'Does extracting pages degrade text sharpness or image quality?',
      a: 'No. Pages are extracted as native vector and raster streams without rasterization or recompression, preserving original print quality, fonts, and embedded hyperlinks.'
    },
    {
      q: 'Can I extract individual pages as separate PDF files?',
      a: 'Yes. You can choose to bundle selected pages into a single new document or export each chosen page as an independent single-page PDF file.'
    }
  ],

  'keyboard-tester': [
    {
      q: 'How do I test if a keyboard key is working or stuck?',
      a: 'Press any key on your physical keyboard. The corresponding key on the visual layout lights up in real time, increments its press count, and displays its JavaScript event code, scan code, and latency.'
    },
    {
      q: 'How do I test for keyboard ghosting or key rollover?',
      a: 'Keyboard ghosting occurs when multiple simultaneous keystrokes fail to register. Press and hold combinations of keys (such as W, A, S, D, and Shift or multiple arrow keys) simultaneously to verify that all inputs register without dropping.'
    },
    {
      q: 'Why do special keys like Print Screen or Fn not respond?',
      a: 'Certain hardware keys (such as Fn on laptops) are handled directly by hardware firmware and do not emit standard OS keyboard events. Additionally, browser shortcuts (like F11 or Ctrl+W) may be intercepted by your browser before reaching the page.'
    },
    {
      q: 'Can I test keyboard chatter or double-typing issues?',
      a: 'Yes. If a mechanical switch is chattering or bouncing, a single physical keystroke will register multiple times in rapid succession. The press counter and event log will highlight abnormally high key counts.'
    },
    {
      q: 'Does this keyboard tester support Mac, Windows, and numeric keypads?',
      a: 'Yes. The tester detects key event codes across Windows, macOS, Linux, and ChromeOS, supporting full ANSI layouts, function rows, navigation clusters, and numpads.'
    }
  ],

  'sticky-notes': [
    {
      q: 'Are my online sticky notes private and secure?',
      a: "Yes. Your sticky notes are stored locally in your browser's localStorage. No notes, text, or personal data are ever uploaded to a server or tracked across websites."
    },
    {
      q: 'Will my sticky notes disappear if I close or refresh the browser?',
      a: 'No. Notes auto-save instantaneously as you type. They remain accessible whenever you return to the page on the same browser and device, even after restarting your computer.'
    },
    {
      q: 'How can I back up or transfer my sticky notes to another computer?',
      a: 'Click the Export button to save all your sticky notes into a clean JSON backup file or plain text. You can restore your notes on another device anytime using the Import feature.'
    },
    {
      q: 'Can I organize and prioritize notes by color or pinned status?',
      a: 'Yes. Assign any note one of several distinct color tags for visual categorization, and click the pin icon to keep high-priority notes locked at the top of your digital board.'
    },
    {
      q: 'How many sticky notes can I create on the board?',
      a: 'There is no preset limit. You can create dozens or hundreds of notes. Modern browsers provide ample local storage capacity for extensive written notes and reminders.'
    }
  ],

  'gst-vat-calculator': [
    {
      q: 'What is the difference between GST and VAT?',
      a: 'GST (Goods and Services Tax) and VAT (Value Added Tax) are both consumption taxes levied on the value added at each stage of the supply chain. The terminology varies primarily by jurisdiction: Canada, Australia, and New Zealand use GST, while the UK and European Union use VAT.'
    },
    {
      q: 'How do I calculate and remove GST from a gross total price?',
      a: 'To remove GST from a gross amount, divide the total price by (1 + tax rate / 100). For example, with a 10% GST rate on a $110 purchase: 110 ÷ 1.10 = $100 net price, meaning $10 was GST.'
    },
    {
      q: 'How do I add GST or VAT to a net price?',
      a: 'Multiply the net pre-tax price by the tax rate percentage to calculate the tax amount, then add it to the net price. For example, on a $200 purchase with a 20% VAT rate: 200 × 0.20 = $40 tax, giving a gross total of $240.'
    },
    {
      q: 'What are standard VAT and GST rates in the UK, Australia, and Canada?',
      a: 'The standard UK VAT rate is 20% (with a 5% reduced rate for select goods). Australia levies a flat 10% GST. Canada applies a 5% federal GST, which combines with provincial taxes in HST provinces (e.g., 13% in Ontario, 15% in Atlantic provinces).'
    },
    {
      q: 'Can this calculator be used for invoicing and tax returns?',
      a: 'Yes. You can switch between "Add Tax" and "Remove Tax" modes to determine accurate pre-tax subtotals, exact tax liabilities, and gross invoice amounts for business accounting and tax filings.'
    }
  ]
};

function buildStandardFaqHtml(faqs) {
  const items = faqs.map(item => {
    return `        <details class="faq-item">
          <summary class="faq-question">${item.q} <span class="faq-icon">+</span></summary>
          <div class="faq-answer">${item.a}</div>
        </details>`;
  }).join('\n');

  return `<section class="faq">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-list">
${items}
      </div>
    </section>`;
}

function buildStandardFaqSchema(faqs) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function buildDcFaqHtmlSsr(faqs) {
  const items = faqs.map((item, idx) => {
    const openAttr = idx === 0 ? ' open' : '';
    const clickIdx = idx + 5;
    return `<details${openAttr} style="background:#fff;border:1px solid #e6ded4;border-radius:12px;padding:0 18px"><summary data-dc-click="${clickIdx}" style="cursor:pointer;padding:16px 0;font-size:16px;font-weight:600;list-style-position:outside">${item.q}</summary><p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#3a332e">${item.a}</p></details>`;
  }).join('');

  return `<section style="display:flex;flex-direction:column;gap:16px"><h2 style="margin:0;font-family:'Bricolage Grotesque',ui-sans-serif,system-ui,sans-serif;font-size:28px;line-height:1.15;letter-spacing:-0.02em;text-wrap:balance">Frequently asked questions</h2><div style="display:flex;flex-direction:column;gap:8px">${items}</div></section>`;
}

function buildDcFaqHtmlTemplate(faqs) {
  const items = faqs.map((item, idx) => {
    const openAttr = idx === 0 ? ' open' : '';
    return `<details${openAttr} style="background:#fff;border:1px solid #e6ded4;border-radius:12px;padding:0 18px"><summary onClick="{{ onFaq }}" style="cursor:pointer;padding:16px 0;font-size:16px;font-weight:600;list-style-position:outside">${item.q}</summary><p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#3a332e">${item.a}</p></details>`;
  }).join('');

  return `<section style="display:flex;flex-direction:column;gap:16px"><h2 style="margin:0;font-family:'Bricolage Grotesque',ui-sans-serif,system-ui,sans-serif;font-size:28px;line-height:1.15;letter-spacing:-0.02em;text-wrap:balance">Frequently asked questions</h2><div style="display:flex;flex-direction:column;gap:8px">${items}</div></section>`;
}

// Apply updates
for (const [slug, faqs] of Object.entries(faqData)) {
  const filePath = path.join(process.cwd(), slug, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  if (slug === 'pdf-merge' || slug === 'extract-pdf-pages') {
    // 1. Update JSON-LD inside @graph
    const graphRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i;
    const graphMatch = html.match(graphRegex);
    if (graphMatch) {
      const graphObj = JSON.parse(graphMatch[1]);
      const faqIndex = graphObj['@graph'].findIndex(x => x['@type'] === 'FAQPage');
      const newFaqNode = {
        "@type": "FAQPage",
        "mainEntity": faqs.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      };
      if (faqIndex !== -1) {
        graphObj['@graph'][faqIndex] = newFaqNode;
      } else {
        graphObj['@graph'].push(newFaqNode);
      }
      const replGraph = `<script type="application/ld+json">${JSON.stringify(graphObj)}</script>`;
      html = html.replace(graphRegex, () => replGraph);
    }

    // 2. Replace SSR FAQ section
    const ssrFaqRegex = /<section\s+style="display:flex;flex-direction:column;gap:16px">\s*<h2[^>]*>Frequently asked questions<\/h2>\s*<div[^>]*>[\s\S]*?<\/div>\s*<\/section>/i;
    const replSsr = buildDcFaqHtmlSsr(faqs);
    html = html.replace(ssrFaqRegex, () => replSsr);

    // 3. Replace Template FAQ section (inside <script type="text/x-dc-template" id="dc-template">)
    const tplFaqRegex = /<section\s+style="display:flex;flex-direction:column;gap:16px">\s*<h2[^>]*>Frequently asked questions<\/h2>\s*<div[^>]*>[\s\S]*?<\/div>\s*<\/section>/i;
    const replTpl = buildDcFaqHtmlTemplate(faqs);
    html = html.replace(tplFaqRegex, () => replTpl);

  } else {
    // Standard tool pages
    // 1. Replace JSON-LD FAQPage script
    const faqSchemaRegex = /<script\s+type="application\/ld\+json">([\s\S]*?FAQPage[\s\S]*?)<\/script>/i;
    const newSchemaHtml = buildStandardFaqSchema(faqs);
    if (faqSchemaRegex.test(html)) {
      html = html.replace(faqSchemaRegex, () => newSchemaHtml);
    } else {
      html = html.replace('</head>', () => `  ${newSchemaHtml}\n</head>`);
    }

    // 2. Replace visible HTML FAQ section
    const faqSectionRegex = /<section\s+class="faq"[^>]*>[\s\S]*?<\/section>/i;
    const newFaqHtml = buildStandardFaqHtml(faqs);
    if (faqSectionRegex.test(html)) {
      html = html.replace(faqSectionRegex, () => newFaqHtml);
    } else {
      console.warn(`[WARN] No faq section regex match in ${slug}`);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[UPDATED] ${slug}/index.html (${faqs.length} FAQs)`);
}

console.log('All 10 tool pages updated with expanded FAQs.');
