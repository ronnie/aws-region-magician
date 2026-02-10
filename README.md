# AWS Region Magician

A Chrome extension that keeps the AWS Console on your preferred region. Any console URL (base or region-prefixed) for **AWS Commercial**, **AWS GovCloud (US)**, or **AWS China** is redirected to your chosen region while preserving path and query.

## Why use this?

The AWS Console has a **Default Region** setting (in the account menu) that can be set to a specific region or to "Last used region." That works when you use the same account repeatedly. This extension helps when you **frequently assume different customer account roles**: each new role has no "last used" region, so the console often opens in an arbitrary region. AWS Region Magician forces every console load to your preferred region, regardless of account or role—so you stay in e.g. `us-east-1` without changing it after every switch.

## How it works

- Uses the **Declarative Net Request API** (Manifest V3) with **transform** redirects: the host is rewritten to your preferred region subdomain and the `region` query param is set or replaced; path and other query params are preserved.
- Rules match **main_frame** requests only on `*.console.aws.amazon.com`, `*.console.amazonaws-us-gov.com`, and `*.console.amazonaws.cn` (base or region subdomain).
- You set **three** preferred regions: **AWS Commercial**, **AWS GovCloud (US)**, and **AWS China** (Beijing/Ningxia). They are stored in **Chrome sync storage** and used as soon as you change them (no Save button).
- **Pause redirects** turns off all redirects so console URLs load as-is; toggle it in Options or in the extension popup.

## Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Turn **Developer mode** on (top right).
3. Click **Load unpacked**.
4. Select the folder that contains this project (the one with `manifest.json`).

## Using the extension

### Popup (click the extension icon)

- **Pause redirects** – Check to disable redirects; uncheck to enable. Same setting as in Options.
- **Open options** – Opens the full Options page.
- **Console links** – Quick links to open AWS Commercial, GovCloud (US), and China consoles in a new tab (redirects apply unless paused).

Hovering the extension icon shows a tooltip with your current **Commercial** and **GovCloud** regions (e.g. `AWS Region Magician – us-east-1 • us-gov-east-1`). Chrome may append " has access to this site " for pages where the extension has host access.

### Options (⋮ → Options)

- **Preferred AWS Commercial Region** – Dropdown grouped by geography (Americas, Europe, Asia Pacific, Middle East & Africa). Default: `us-east-1`.
- **Preferred AWS GovCloud (US) Region** – Default: `us-gov-east-1`.
- **Preferred AWS China Region** – Default: `cn-north-1`.
- **Pause redirects** – When checked, no redirects are applied.
- **Debug mode** – When checked, the service worker logs rule updates and redirect matches (for troubleshooting purposes).
- **Console links** – Open AWS Commercial, GovCloud (US), and China consoles in a new tab to test redirects.

Changes are saved automatically when you change a dropdown or toggle.


## Project layout

- `manifest.json` – Extension manifest (Manifest V3).
- `background.js` – Service worker: applies or removes Declarative Net Request rules on install, startup, and when preferences (regions or Pause) change; updates the extension icon tooltip.
- `shared.js` – Storage keys and default region constants used by options and popup (loaded before options.js / popup.js). background.js cannot load scripts; its key names are kept in sync with this file.
- `options.html` / `options.js` – Options page: region dropdowns (commercial with grouped list), Pause redirects, Debug mode, and console test links.
- `popup.html` / `popup.js` – Popup: Pause redirects toggle, Open options link, and console test links.
- `README.md` – This file.

## Storage keys (chrome.storage.sync)

| Key | Used by | Purpose |
|-----|---------|---------|
| `preferredRegion` | background, options | AWS Commercial preferred region (e.g. us-east-1). |
| `preferredGovRegion` | background, options | AWS GovCloud (US) preferred region. |
| `preferredChinaRegion` | background, options | AWS China preferred region. |
| `redirectsPaused` | background, options, popup | When true, redirects are disabled. |
| `debugLogging` | background, options | When true, service worker logs to console. |

When adding or renaming a key, update `shared.js`, `background.js`, and this table.

## Permissions

- **storage** – To save and read preferred regions and settings (Chrome sync).
- **declarativeNetRequestWithHostAccess** – To add and remove the redirect rules.
- **declarativeNetRequestFeedback** – Enables redirect-matched debug logging in the service worker (`onRuleMatchedDebug`); for unpacked/development use.
- **Host permissions** for `console.aws.amazon.com`, `console.amazonaws-us-gov.com`, and `console.amazonaws.cn` (and region subdomains) – so redirects apply only to those AWS consoles.

No content scripts run on pages; redirects are handled entirely by Declarative Net Request.

## Troubleshooting / viewing logs

- **Debug mode** – In **Options**, turn on **Debug mode**. When enabled, the service worker logs rule updates and redirect matches; when off, no extension logging runs.

- **Service worker console** – The extension uses a Manifest V3 **service worker**. To see its console:
  1. Go to `chrome://extensions/`.
  2. Find **AWS Region Magician** and click the **Service worker** link.
  The worker may be inactive until you click the extension icon or open Options. Use the **Console** tab for `[AWS Region Magician]` messages and errors.

- **Options page console** – Open Options, then right‑click the page → **Inspect** → **Console** for options-page-only logs.

- **Confirm redirects** – Open `https://console.aws.amazon.com/` in a new tab. In DevTools → **Network**, reload and check the first main request; it should show a redirect to your preferred region host (e.g. `us-east-1.console.aws.amazon.com/...`). In the service worker console you can run `chrome.declarativeNetRequest.getDynamicRules()` to verify dynamic rules.

- **Redirect matched (debug)** – With **declarativeNetRequestFeedback** and **Debug mode** on, the service worker logs e.g. `[AWS Region Magician] Redirect matched: commercial → https://console.aws.amazon.com/...` when a redirect runs.

---

## FAQs

**Does this work with AWS GovCloud (US) and AWS China?**  
Yes! You can set separate preferred regions for **AWS Commercial**, **AWS GovCloud (US)**, and **AWS China**. Each console domain is redirected to its corresponding preferred region.

**Can I temporarily disable redirects?**  
Yes. Turn on **Pause redirects** in the popup or in Options. Redirects are disabled until you turn it off. Your preferred regions are unchanged.

**Do my settings sync across Chrome?**  
Yes. Preferences are stored in **Chrome sync storage**, so they sync across devices where you're signed into Chrome with the same account.

**Will it work if I'm not logged in to AWS?**  
Yes. The extension only rewrites the URL (host and `region` query param). Login and permissions are handled by AWS as usual after the redirect.

**What if I open a console link in a new tab?**  
Redirects apply to every new main-frame load of an AWS console URL. So opening a console link in a new tab will still redirect to your preferred region (unless 'Pause redirects' is on).

**Does this change my AWS account's default region?**  
No. It only redirects the browser when you open console URLs. Your account's default region in AWS is unchanged.

**I don't use AWS GovCloud (US) or AWS China. Do I need to set those?**  
No. You can leave them at the defaults. They only affect console URLs for those domains when you open them.

**Where do the region lists come from?**  
They follow the [AWS Regions table](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html) for AWS Commercial regions; AWS GovCloud (US) and AWS China use their standard two regions each.

--

## Project Repository

<https://github.com/ronnie/aws-region-magician>

## Support

Please [create a new issue](https://github.com/ronnie/aws-region-magician/issues) in the project's GitHub repo.
