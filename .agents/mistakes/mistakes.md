# Agent Development Mistakes & Lessons Learned

This document serves as an ongoing log of anti-patterns, oversights, and mistakes made by the AI agent during the development of this repository. **Future agents MUST review this file before making related changes to avoid repeating these errors.**

## 1. UI Component State Mixing
* **Mistake**: In the `ReviewButton` component, the `disabled` and `loading` states were coupled. The parent component passed `loading={loading || !prLink}`. This caused the button to physically enter its active spinning "Reviewing..." state simply because the PR link input was empty on page load.
* **Lesson**: Strictly separate `disabled` (for validation) and `loading` (for network activity) into distinct boolean props for all UI components.

## 2. Rendering AI Responses without Markdown Parsing
* **Mistake**: The original UI assumed the n8n webhook would return a highly parsed JSON and attempted to render the AI summary block as raw text (`whitespace-pre-wrap`). The LLM actually generated heavy Markdown (tables, emojis, headings, bullet points), which rendered as raw, unformatted code on the screen.
* **Lesson**: *Always* assume AI-generated text will contain Markdown. Implement `react-markdown` combined with `remark-gfm` and `@tailwindcss/typography` (`prose` classes) at the very beginning when rendering any LLM output to the UI.

## 3. Typo in Package Imports
* **Mistake**: After installing `remark-gfm`, the agent imported it incorrectly as `import remarkGfm from 'remarkGfm'` instead of the standard `'remark-gfm'`. This caused a Vite module resolution crash (500 Error).
* **Lesson**: Double-check standard npm package string names before writing import statements, especially when camelCasing the variable name.

## 4. Missing Tailwind Plugins
* **Mistake**: The agent utilized advanced Tailwind classes like `animate-in`, `fade-in`, and `prose` without actually adding the required plugins (`tailwindcss-animate`, `@tailwindcss/typography`) to `tailwind.config.js`. This resulted in hanging styles and broken UI requests.
* **Lesson**: If using non-native Tailwind feature sets (like typography or animations), ensure both the `npm install` and the `require('...')` in `tailwind.config.js` are executed *before* writing the JSX.

## 5. Parallel Tool Execution Overload (System Error)
* **Mistake**: The agent attempted to create `index.html`, `main.jsx`, and `index.css` via a massive parallel tool block. The tool call malformed, causing `index.css` to silently fail creation. Because it was heavily relied upon by Vite, the entire React application loaded as a silent blank white screen with no console overlays.
* **Lesson**: Check for the existence of core architectural files (like `index.css`) if Vite serves a 500/blank screen. Avoid overloading multiple large file creations into a single immediate parallel invocation. 
