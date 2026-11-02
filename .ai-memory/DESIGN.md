# Design System Memory — AnyConverter

## 1. Visual Architecture & Design Language
AnyConverter utilizes a clean, high-utility, modern design language optimized for speed and clarity.

### Color Tokens
- **Primary Brand:** Deep Indigo / Slate Blue (`#4f46e5` / `#3b82f6`)
- **Surface & Backgrounds:**
  - Base: `#ffffff`
  - Light Neutral / Canvas: `#f8fafc` (Slate 50)
  - Card & Container: `#ffffff` with subtle borders (`#e2e8f0` Slate 200)
  - Dark Mode Surfaces (where applicable): `#0f172a` (Slate 900)
- **Text & Contrast:**
  - Heading / Primary: `#0f172a` (Slate 900)
  - Body: `#334155` (Slate 700)
  - Muted / Secondary: `#64748b` (Slate 500)
- **Status & Feedback:**
  - Success: `#10b981` (Emerald 500)
  - Warning: `#f59e0b` (Amber 500)
  - Error: `#ef4444` (Red 500)

## 2. Layout & Typography Rules
- **Font Stack:** System Sans-Serif (`Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`) for zero layout shifts and instant font loading.
- **Header & Navigation:** Sticky, slim header with clean brand logo, search/category links, and minimal clutter.
- **Tool Workspace Area:**
  - Hero header with clean H1, concise value proposition, and immediate tool interactive area above the fold.
  - Action bar / toolbar standardized across tools (e.g. `ac-action-bar` or sub-tabs for consistency).
  - High-contrast inputs, file drop zones, and clear primary CTA buttons.
  - Comprehensive explanation, FAQ, and related tools section below the interactive canvas.

## 3. Google Stitch & UI Integration
- When integrating designs from Google Stitch (`stitch.googleapis.com/mcp`):
  - Retain AnyConverter's core CSS classes and component conventions.
  - Avoid heavy external dependencies or bloated component libraries.
  - Maintain fluid responsiveness across 320px, 375px, 768px, 1024px, and 1440px viewports.
