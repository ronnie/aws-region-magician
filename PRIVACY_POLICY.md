# Privacy Policy – AWS Region Magician

**Last updated:** 02/10/2026

AWS Region Magician ("the extension") is a Chrome extension that redirects AWS Console URLs to your preferred region. This policy describes what data the extension uses and does not use.

## Data we do not collect

- The extension **does not collect, store, or transmit any personal data** to the developer or any third party.
- It does **not** read the content of web pages, form data, or your AWS account information.
- It does **not** track your browsing history, analytics, or usage outside of the redirect behavior described below.

## Data stored on your device

The extension uses **Chrome's built-in storage** (sync storage) only to save your preferences on your device and, if you are signed into Chrome, across your Chrome profile:

- Your chosen **preferred regions** for AWS Commercial, AWS GovCloud (US), and AWS China
- Whether **"Pause redirects"** is on or off
- Whether **"Debug mode"** is on or off (for optional console logging)

This data stays in your browser and is subject to Chrome's sync and privacy policies. We do not have access to it.

## How the extension works

When you open a tab to an AWS Console URL (e.g. `console.aws.amazon.com`), the extension uses Chrome's Declarative Net Request API to redirect that request to your preferred region. Only the **URL** (host and region parameter) is modified; no page content is read or sent to us. Redirects apply only to the AWS Console domains declared by the extension; no other sites are affected.

## Changes to this policy

If this privacy policy changes, we will update the "Last updated" date and, where appropriate, notify users via the Chrome Web Store listing or the extension itself.

## Contact

If you have questions about this privacy policy or the extension, please use the support channel linked from the Chrome Web Store listing (e.g. GitHub repository or contact email).
