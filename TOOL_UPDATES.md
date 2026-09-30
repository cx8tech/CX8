# Updating tool files

This guide explains how to replace a tool on the CX8 website yourself, using GitHub's website. No developer tools are needed.

## How it works

Each tool is one HTML file in the folder **`public/tools/`** of this repository. When a file in that folder changes on GitHub, Vercel automatically rebuilds and publishes the website. This usually takes 1–2 minutes.

| Tool | File to replace |
|---|---|
| 1 — Engineering Units Converter | `public/tools/tool1.html` |
| 2 — Kv / Flow Rate Calculator | `public/tools/tool2.html` |
| 3 — Valve Torque Calculator | `public/tools/tool3.html` |
| 4 — Actuator / Valve Match | `public/tools/tool4.html` |
| 5 — Actuator Cross Reference | `public/tools/tool5.html` |
| 6 — Advanced Compressor Tool | `public/tools/tool6.html` |

## Which tools are safe to replace

- **Tools 1 and 2: safe.** The website uses these files exactly as you wrote them. You can replace them directly.
- **Tools 3, 4 and 6: contact Keya first.** The website versions have extra code added, so that only logged-in users can download PDFs. If you upload your original file, that code is lost. The automatic check (see below) will stop the upload from going live.
- **Tool 5: never upload your original file.** Your original Tool 5 file contains the full actuator dataset. On the website, that data is kept in a protected database instead, so it can't be copied from the page. Always send Tool 5 changes to Keya.
- **New tools (7, 8, …):** uploading the file is not enough, because the tool also has to be added to the Tools page. Send new tools to Keya.

Only change files inside `public/tools/`. Do not edit anything in the other folders (`src`, `api`, `supabase`, `ci`) or the files `package.json` and `vercel.json`.

## Steps to replace a tool

1. Rename your file on your computer to match the table above exactly, for example `tool1.html`. The name must match exactly, including lower-case letters.
2. On GitHub, open the repository and go into the `public` folder, then the `tools` folder.
3. Click **Add file → Upload files**, and drag your file in.
4. At the bottom, write a short description, for example "Update Tool 1 unit list".
5. Leave **Commit directly to the main branch** selected and click **Commit changes**.
6. Wait 1–2 minutes, then open the tool on the website and refresh the page to check it.

## The automatic safety check

Before each publish, a check runs on all tool files. It stops the update if:

- a file contains the Tool 5 actuator dataset, or
- a file has a "Download PDF" button without the login check.

If the check stops an update, **the website stays on the previous version**, so nothing breaks for users. On GitHub, your change shows a red ✗ next to it. Send the file to Keya to fix.

## Undoing a change

If an update went live but something looks wrong:

1. Open the project on **vercel.com** and go to **Deployments**.
2. Find the last deployment from before your change.
3. Click the **⋯** menu next to it and choose **Promote to Production** (in some accounts it's called **Instant Rollback**).

The website goes back to that version within a minute. Then let Keya know, so the file on GitHub can be fixed too.
