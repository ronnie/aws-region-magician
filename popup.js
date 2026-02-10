/**
 * Popup: Pause redirects toggle and link to options.
 * Depends on shared.js for REDIRECTS_PAUSED_KEY.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const pauseCheckbox = document.getElementById('pauseRedirects');
  const openOptionsLink = document.getElementById('openOptions');

  const { [REDIRECTS_PAUSED_KEY]: redirectsPaused } = await chrome.storage.sync.get(REDIRECTS_PAUSED_KEY);
  pauseCheckbox.checked = !!redirectsPaused;

  pauseCheckbox.addEventListener('change', async () => {
    await chrome.storage.sync.set({ [REDIRECTS_PAUSED_KEY]: pauseCheckbox.checked });
  });

  openOptionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});
