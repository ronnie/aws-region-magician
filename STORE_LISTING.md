# Chrome Web Store Listing – AWS Region Magician

---

## Short description (132 characters max)

```
Redirects AWS Console to your preferred region across all accounts and roles. Set it once. Supports AWS, GovCloud, AWS China.
```

---

## Detailed description

---

**Keep the AWS Console in your preferred region**

AWS Region Magician redirects every AWS Console URL to the region you choose across AWS Commercial, AWS GovCloud (US), and AWS China. You no longer have worry about changing the region after every account or role switch or endlessly updating default region settings.

**Why it's useful**

The AWS Console's "Default region" (in account preferences) can follow "Last used region," which works when you use one account. If you often assume different customer account roles, each new session has no "last used" region and the console may open in a random region. This extension forces every console load to your preferred region (e.g. us-east-1), no matter which account or role you're in.

**What it does**

• Redirects AWS Commercial, AWS GovCloud (US), and AWS China console URLs to your chosen region  
• Preserves the full path and query string — only the region (host and region param) changes  
• Lets you set a preferred region for each: AWS Commercial, GovCloud (US), and China  
• "Pause redirects" toggle in the popup or Options turns redirects off temporarily  
• Settings sync across your Chrome devices (Chrome sync storage)

**How to use**

1. Install the extension.  
2. Click the extension icon and choose "Open options," or right‑click the icon → Options.  
3. Pick your preferred regions for AWS Commercial, GovCloud (US), and China. Changes apply immediately.  
4. Open any AWS Console link; it will load in your preferred region. Use "Pause redirects" when you want the console to open in the URL's region instead.

**Privacy**

The extension only redirects browser requests to AWS console domains. It does not read page content, inject scripts into pages, or send your data elsewhere. Preferences are stored locally and in Chrome sync storage.

---

## Category

Productivity

(Alternatives: Developer Tools, Workflow)

---

## Privacy practices

**Single purpose description:**  
Redirects the user's browser when they open AWS Console URLs so the console loads in their chosen AWS region. No data is collected or sent to third parties.

**Data usage:**  
- The extension does **not** collect, store, or transmit personal data to the developer or third parties.  
- It uses Chrome's **storage** API (sync) only to save the user's preferred regions and settings on their device / Chrome account.  
- It does not access page content, form data, or browsing history beyond triggering redirects on AWS console domains.

**Permission justifications** (use in the "Justification" fields for each permission):

| Permission | Justification |
|------------|---------------|
| **Storage** | To save and sync the user's preferred AWS regions (Commercial, GovCloud, China) and the "Pause redirects" and "Debug mode" settings across their Chrome profile. |
| **Declarative Net Request (with host access)** | To apply redirect rules so that when the user opens an AWS Console URL, the request is rewritten to their preferred region. Required for the extension's core functionality. |
| **Declarative Net Request Feedback** | To allow optional debug logging (when "Debug mode" is on) so the user can confirm redirects in the service worker console. Used only for troubleshooting. |
| **Host permissions** (console.aws.amazon.com, console.amazonaws-us-gov.com, console.amazonaws.cn) | Redirects apply only to these AWS Console domains. No other sites are accessed or modified. |

---

## External links (if needed)

- **Homepage:** https://github.com/ronnie/aws-region-magician
- **Support:** https://github.com/ronnie/aws-region-magician/issues
- **Privacy policy:** https://github.com/ronnie/aws-region-magician/blob/main/PRIVACY_POLICY.md
