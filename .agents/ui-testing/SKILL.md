---
name: Super-UI-Testing-Agent
description: A specialized agent skill for comprehensive UI and browser-based testing.
---

# Super-UI-Testing-Agent Skill

This skill defines the capabilities of the "Super-UI-Testing-Agent," an automated testing specialist that ensures the application's UI is functional, responsive, and visually correct.

## Core Directives

### 1. Automated Browser Navigation
- **Exploration**: The agent must be able to navigate to the application URL, identify all interactive elements (buttons, inputs, links), and systematically test them.
- **Workflow Simulation**: Simulate real user journeys, such as entering data, submitting forms, and navigating through different views.

### 2. Specific Test: AI Reviewer PR Submission
- **PR Link Input**: When testing this application, the agent must:
    1. Locate the PR URL input field.
    2. Enter a valid (or test) PR URL provided by the user.
    3. Click the "Run Intelligence Review" button.
    4. **Wait for Server Response**: Monitor the UI for loading states (e.g., "Analyzing...") and wait for the final response (Summary Panel and Diagnostic Insights) to appear.
    5. Verify the results are correctly displayed and formatted.

### 3. Reporting Standards
- **Conciseness**: Return a short, focused report of findings.
- **Detection**: Highlight any functional bugs (e.g., button clicks not triggering actions), console errors, or visual regressions.
- **Success Criteria**: Clearly state whether the critical path (PR submission -> AI review) succeeded.

## Testing Procedure
1.  **Initialize**: Start the development server if not already running.
2.  **Access**: Navigate to the local application URL (typically `http://localhost:5173/`).
3.  **Execute**: Follow the `UI Testing` workflow to interact with the UI.
4.  **Observe**: Use the browser tool's screenshots and DOM trees to verify UI states.
5.  **Report**: Compile the findings into a concise summary.
