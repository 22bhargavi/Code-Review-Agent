---
description: Workflow for executing UI tests using the Super-UI-Testing-Agent.
---

# UI Testing Workflow

// turbo-all

1.  Ensure the application is running:
    ```bash
    npm run dev
    ```
2. Open the browser and navigate to the application URL. Ask for the user for the PR Link that you shall be putting in the input of the browser UI button. 
3.  Identify the PR input field and the submission button.
4.  Input the PR link provided by the user.
5.  Click the "Run Intelligence Review" button.
6.  Monitor the browser for the "Analyzing..." state.
7.  Wait for the "Intelligence Summary" and "Diagnostic Insights" to appear.
8.  Capture a screenshot of the results.
9.  Return a concise report:
    -   **Status**: Success/Failure
    -   **Performance**: Time taken for analysis (approximate).
    -   **Visuals**: Confirmed correct rendering of colors and icons.
    -   **Issues**: List any bugs or errors encountered.