# AI Code Review Tool Skills

## Tech Stack
- React (Functional Components + Hooks)
- Tailwind CSS (Minimal, Modern, Dark Theme)
- Vite (Build Tool)

## Component Architecture
- **App**: Main container, state management for fetching data.
- **Header**: Branding and status.
- **ReviewButton**: Action trigger with loading state.
- **SummaryPanel**: Markdown-friendly display of the AI summary.
- **FileGroup**: Collapsible group for comments per file.
- **CommentItem**: Individual comment display with line numbers.

## Backend Integration
- **Endpoint**: `POST https://confidently-uninvoiced-christine.ngrok-free.dev/webhook/review-mr`
- **Logic**: Fetching data on click, handling loading/error states, parsing n8n response.

## Styling Principles
- **Aesthetics**: Dark theme, developer-centric (GitHub/VS Code inspired).
- **Interactions**: Smooth hover effects, subtle transitions, responsive layout.
- **Typography**: Clean, monospace for code snippets/line numbers.
