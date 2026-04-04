# UI/UX Quality Contract

## AI Anti-Patterns Detection

Every UI MDU self-review must check these. If any pattern is detected → fix before marking complete.

### 1. Rainbow Palette
- **Detect**: Extract all unique color values (hex/rgb/tailwind classes). Count semantic colors beyond neutral grays.
- **Fail**: More than 3 semantic colors (primary + secondary + accent) plus gray scale.
- **Fix**: Strip to primary + neutral + one accent. Every other color must justify its existence against a specific UI state (error/warning/success are functional, not decorative).

### 2. Shadow Inflation
- **Detect**: Count elements with box-shadow / `shadow-*` classes.
- **Fail**: >30% of components have shadows, or multiple shadow intensities used without hierarchy reason.
- **Fix**: Default is 0 shadow. Use one light shadow level for elevated elements (modals, dropdowns, floating actions). Nothing else gets shadow.

### 3. Border-Radius Inflation
- **Detect**: Count distinct border-radius values used.
- **Fail**: >3 distinct radius values, or all elements share the same large radius.
- **Fix**: Define exactly 2-3 radius tokens: small (buttons/inputs), medium (cards/panels), large (modals/overlays). Apply consistently.

### 4. Spacing Chaos
- **Detect**: Extract all margin/padding values. Check if they follow a consistent scale.
- **Fail**: Values that don't fit a base-4 or base-8 scale (e.g., 15px, 22px, 30px mixed in).
- **Fix**: Use a strict spacing scale from ADR-UI. Every spacing value must be a token from the scale.

### 5. Flat Hierarchy
- **Detect**: Extract all font-size values. Calculate ratios between adjacent levels.
- **Fail**: Less than 1.25x ratio between heading levels, or more than 6 distinct sizes.
- **Fix**: Use a type scale with clear ratios (1.25/1.333/1.5). Max 5 levels: display, heading, subheading, body, caption.

### 6. Gratuitous Decoration
- **Detect**: For each gradient, animation, transition, or hover effect, answer: "What user task does this serve?"
- **Fail**: Cannot name a specific function (guide attention / indicate state / provide feedback / aid navigation).
- **Fix**: Remove it. If the UI feels "empty" after removal, the layout has a structural problem — fix that instead.

### 7. Density Mismatch
- **Detect**: Identify page type: workspace (dashboard/table/form/editor) vs. content (marketing/docs/blog).
- **Fail**: Workspace pages with excessive whitespace and centered narrow content. Content pages crammed with data.
- **Fix**: Workspace → maximize information density, use full width, compact spacing. Content → generous whitespace, constrained width (65ch), reading rhythm.

### 8. Template Layout
- **Detect**: Is the page structure derived from user task flow, or from a generic pattern?
- **Fail**: Hero + Cards + CTA pattern used for a tool/dashboard. Identical grid layout on every page regardless of content.
- **Fix**: Start from the user's primary action on this page. Layout flows from: primary action area (60%+ weight) → supporting context → secondary actions.

### 9. No Rhythm
- **Detect**: Are all page sections equal in visual weight and spacing?
- **Fail**: Every section has the same height, padding, and emphasis. The page reads like a spreadsheet of equal-weight rows.
- **Fix**: Establish one dominant section (the reason the user is on this page). Others are clearly subordinate in size, spacing, and contrast.

### 10. Fake Responsive
- **Detect**: Compare mobile and desktop layouts. Does mobile have its own information priority?
- **Fail**: Mobile is just desktop columns stacked vertically with the same order and emphasis.
- **Fix**: Mobile must re-prioritize: what does the user need first on a small screen? Hide or collapse secondary info. Touch targets ≥44px.

---

## Design Decision Protocol (ADR-UI)

If the project has a frontend, this ADR is **REQUIRED** in DECISIONS.md. Phase 5 will halt on UI MDUs if missing.

Create during Phase 2 Step 5. Every field must contain a concrete value, not a direction.

```
ADR-UI: Design System Contract

1. User & Task:
   - Primary user: [role/persona]
   - Primary task: [what they come to do]
   - Page type: workspace / content / hybrid
   - Information density: high / medium / low

2. Color Palette:
   - Primary: [hex] — used for: [specific elements]
   - Neutral: [hex range] — used for: backgrounds, borders, muted text
   - Accent: [hex] — used for: [specific interactive elements]
   - Semantic: error [hex], warning [hex], success [hex]
   - Dark mode: yes/no — method: [CSS vars / tailwind dark: / theme provider]

3. Type Scale (max 5 levels):
   - Display: [size/weight] — used for: [page titles only]
   - Heading: [size/weight] — used for: [section headers]
   - Subheading: [size/weight] — used for: [card titles, labels]
   - Body: [size/weight] — used for: [primary content]
   - Caption: [size/weight] — used for: [metadata, timestamps, hints]

4. Spacing Scale:
   - Base unit: [4px / 8px]
   - Tokens: [list, e.g., 4/8/12/16/24/32/48/64]
   - Component internal padding: [token]
   - Section gap: [token]
   - Page margin: [token]

5. Border Radius:
   - Small (buttons, inputs): [value]
   - Medium (cards, panels): [value]
   - Large (modals, overlays): [value]

6. Component Inventory:
   - [List only components this project actually needs]
   - [Do NOT include components "just in case"]

7. Layout:
   - Navigation: [top / side / none] — [fixed / sticky / static]
   - Content area: [full-width / max-width Npx / sidebar+main]
   - Grid system: [columns / flexbox / CSS grid] — [breakpoints]

8. Motion:
   - Transitions: [duration]ms [easing] — only for: [specific interactions]
   - Loading states: [skeleton / spinner / progressive] — never: [which to avoid]
   - No animation on: [list elements that should NOT animate]
```
