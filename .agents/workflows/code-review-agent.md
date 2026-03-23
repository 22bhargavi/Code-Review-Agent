---
description: Modifies the AI Code Review UI to accept a PR link and send it to the n8n webhook
---

# Code Review Agent Workflow

This workflow executes the exact steps required to transform the AI Code Review UI from a generic trigger button into a specific PR-based review tool. Follow these steps meticulously:

1. **Modify App State:** Add a new state variable in `src/App.jsx` to hold the `prLink` string. Example: `const [prLink, setPrLink] = useState('')`.
2. **Add Input Field:** Update the UI in `src/App.jsx` to include a properly styled `<input>` element above the `ReviewButton`. The user will use this to enter their PR link or repository URL. Ensure the styling matches the existing zinc/indigo dark theme (e.g., `bg-zinc-900`, `border-zinc-800`, `focus:ring-indigo-500`).
3. **Update Button Logic:** Modify the `ReviewButton` (or the rendering logic) so that it is disabled when `prLink` is empty. 
4. **Update Webhook Call:** Modify the `triggerReview` fetch call in `src/App.jsx`. Change the empty JSON body to pass the `prLink` to the n8n webhook. Example: `body: JSON.stringify({ prLink })` or whichever key the n8n webhook expects.
5. **Verify Changes:** If not already running, start the dev server (`npm run dev`) and verify via the `browser_subagent` that the input renders correctly and the POST request includes the body.
