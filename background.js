/**
 * Service worker: applies Declarative Net Request redirects so any AWS Console
 * URL (base or region-prefixed, commercial, Gov, and China) is rewritten to the
 * user's preferred region. Uses transform to preserve path/query and only change
 * host and region param. Rules are updated on install and when storage changes.
 *
 * Storage key names must match shared.js (service workers cannot load that file).
 */

const DEFAULT_REGION = 'us-east-1';
const DEFAULT_REGION_GOV = 'us-gov-east-1';
const DEFAULT_REGION_CN = 'cn-north-1';

const STORAGE_KEY = 'preferredRegion';
const STORAGE_KEY_GOV = 'preferredGovRegion';
const STORAGE_KEY_CN = 'preferredChinaRegion';

const DEBUG_LOGGING_KEY = 'debugLogging';
const REDIRECTS_PAUSED_KEY = 'redirectsPaused';

const RULE_ID = 1;
const RULE_ID_GOV = 2;
const RULE_ID_CN = 3;

async function isDebugLoggingEnabled() {
  const o = await chrome.storage.sync.get(DEBUG_LOGGING_KEY);
  return !!o[DEBUG_LOGGING_KEY];
}

// Match any URL on the console domain: base (console.*) or region-prefixed (region.console.*).
// The (?:[a-z0-9-]+\\.)? group makes the region subdomain optional so base URLs match.
const REGEX_FILTER = '^https://(?:[a-z0-9-]+\\.)?console\\.aws\\.amazon\\.com/.*';
const REGEX_FILTER_GOV = '^https://(?:[a-z0-9-]+\\.)?console\\.amazonaws-us-gov\\.com/.*';
const REGEX_FILTER_CN = '^https://(?:[a-z0-9-]+\\.)?console\\.amazonaws\\.cn/.*';

async function getPreferredRegions() {
  const o = await chrome.storage.sync.get([STORAGE_KEY, STORAGE_KEY_GOV, STORAGE_KEY_CN]);
  return {
    region: o[STORAGE_KEY] || DEFAULT_REGION,
    govRegion: o[STORAGE_KEY_GOV] || DEFAULT_REGION_GOV,
    chinaRegion: o[STORAGE_KEY_CN] || DEFAULT_REGION_CN,
  };
}

async function updateActionTitle() {
  const o = await chrome.storage.sync.get([STORAGE_KEY, STORAGE_KEY_GOV]);
  const region = o[STORAGE_KEY] || DEFAULT_REGION;
  const govRegion = o[STORAGE_KEY_GOV] || DEFAULT_REGION_GOV;
  chrome.action.setTitle({ title: `AWS Region Magician – ${region} • ${govRegion}` });
}

async function applyRules() {
  const debug = await isDebugLoggingEnabled();
  const paused = (await chrome.storage.sync.get(REDIRECTS_PAUSED_KEY))[REDIRECTS_PAUSED_KEY];
  if (paused) {
    try {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [RULE_ID, RULE_ID_GOV, RULE_ID_CN],
        addRules: [],
      });
      if (debug) console.log('[AWS Region Magician] Redirects paused – rules removed.');
    } catch (err) {
      if (debug) console.error('[AWS Region Magician] Failed to remove rules:', err);
    }
    return;
  }

  const { region, govRegion, chinaRegion } = await getPreferredRegions();
  if (debug) console.log('[AWS Region Magician] Applying rules:', { region, govRegion, chinaRegion });

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID, RULE_ID_GOV, RULE_ID_CN],
      addRules: [
        {
          id: RULE_ID,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              transform: {
                host: `${region}.console.aws.amazon.com`,
                queryTransform: {
                  addOrReplaceParams: [{ key: 'region', value: region }],
                },
              },
            },
          },
          condition: {
            regexFilter: REGEX_FILTER,
            resourceTypes: ['main_frame'],
          },
        },
        {
          id: RULE_ID_GOV,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              transform: {
                host: `${govRegion}.console.amazonaws-us-gov.com`,
                queryTransform: {
                  addOrReplaceParams: [{ key: 'region', value: govRegion }],
                },
              },
            },
          },
          condition: {
            regexFilter: REGEX_FILTER_GOV,
            resourceTypes: ['main_frame'],
          },
        },
        {
          id: RULE_ID_CN,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              transform: {
                host: `${chinaRegion}.console.amazonaws.cn`,
                queryTransform: {
                  addOrReplaceParams: [{ key: 'region', value: chinaRegion }],
                },
              },
            },
          },
          condition: {
            regexFilter: REGEX_FILTER_CN,
            resourceTypes: ['main_frame'],
          },
        },
      ],
    });
    if (debug) console.log('[AWS Region Magician] Rules applied successfully.');
  } catch (err) {
    if (debug) console.error('[AWS Region Magician] Failed to apply rules:', err);
  }
}

applyRules();
updateActionTitle();

// So the user sees something when they open the service worker console with debug on
isDebugLoggingEnabled().then((enabled) => {
  if (enabled) {
    console.log('[AWS Region Magician] Debug mode is on. Rule updates and redirect matches will be logged here.');
  }
});

// Debug: log when a redirect rule actually matches a request (unpacked extensions only; requires declarativeNetRequestFeedback).
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(async (info) => {
  if (!(await isDebugLoggingEnabled())) return;
  const ruleIdToLabel = { [RULE_ID]: 'commercial', [RULE_ID_GOV]: 'gov', [RULE_ID_CN]: 'china' };
  const label = ruleIdToLabel[info.rule.ruleId] ?? `rule ${info.rule.ruleId}`;
  console.log('[AWS Region Magician] Redirect matched:', label, '→', info.request.url);
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(() => {
  applyRules();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync') return;
  if (changes[DEBUG_LOGGING_KEY]) {
    const on = !!changes[DEBUG_LOGGING_KEY].newValue;
    console.log('[AWS Region Magician] Debug logging', on ? 'enabled. Rule updates and redirect matches will appear in this console.' : 'disabled.');
  }
  if (changes[STORAGE_KEY] || changes[STORAGE_KEY_GOV] || changes[STORAGE_KEY_CN] || changes[REDIRECTS_PAUSED_KEY]) {
    applyRules();
    if (changes[STORAGE_KEY] || changes[STORAGE_KEY_GOV]) updateActionTitle();
  }
});
