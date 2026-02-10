/**
 * Options page: region dropdowns. Auto-saves to chrome.storage.sync on change;
 * the background updates Declarative Net Request rules via storage.onChanged.
 * Depends on shared.js for storage keys and defaults.
 */

// Standard AWS account regions per https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html
// Grouped by geography for the commercial regions dropdown.
const AWS_REGIONS_GROUPED = [
  {
    group: 'Americas (US)',
    regions: [
      { value: 'us-east-1', label: 'US East (N. Virginia) — us-east-1' },
      { value: 'us-east-2', label: 'US East (Ohio) — us-east-2' },
      { value: 'us-west-1', label: 'US West (N. California) — us-west-1' },
      { value: 'us-west-2', label: 'US West (Oregon) — us-west-2' },
    ],
  },
  {
    group: 'Americas (Canada, Mexico, South America)',
    regions: [
      { value: 'ca-central-1', label: 'Canada (Central) — ca-central-1' },
      { value: 'ca-west-1', label: 'Canada West (Calgary) — ca-west-1' },
      { value: 'mx-central-1', label: 'Mexico (Central) — mx-central-1' },
      { value: 'sa-east-1', label: 'South America (São Paulo) — sa-east-1' },
    ],
  },
  {
    group: 'Europe',
    regions: [
      { value: 'eu-central-1', label: 'Europe (Frankfurt) — eu-central-1' },
      { value: 'eu-central-2', label: 'Europe (Zurich) — eu-central-2' },
      { value: 'eu-west-1', label: 'Europe (Ireland) — eu-west-1' },
      { value: 'eu-west-2', label: 'Europe (London) — eu-west-2' },
      { value: 'eu-west-3', label: 'Europe (Paris) — eu-west-3' },
      { value: 'eu-north-1', label: 'Europe (Stockholm) — eu-north-1' },
      { value: 'eu-south-1', label: 'Europe (Milan) — eu-south-1' },
      { value: 'eu-south-2', label: 'Europe (Spain) — eu-south-2' },
    ],
  },
  {
    group: 'Asia Pacific',
    regions: [
      { value: 'ap-east-1', label: 'Asia Pacific (Hong Kong) — ap-east-1' },
      { value: 'ap-east-2', label: 'Asia Pacific (Taipei) — ap-east-2' },
      { value: 'ap-south-1', label: 'Asia Pacific (Mumbai) — ap-south-1' },
      { value: 'ap-south-2', label: 'Asia Pacific (Hyderabad) — ap-south-2' },
      { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore) — ap-southeast-1' },
      { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney) — ap-southeast-2' },
      { value: 'ap-southeast-3', label: 'Asia Pacific (Jakarta) — ap-southeast-3' },
      { value: 'ap-southeast-4', label: 'Asia Pacific (Melbourne) — ap-southeast-4' },
      { value: 'ap-southeast-5', label: 'Asia Pacific (Malaysia) — ap-southeast-5' },
      { value: 'ap-southeast-6', label: 'Asia Pacific (New Zealand) — ap-southeast-6' },
      { value: 'ap-southeast-7', label: 'Asia Pacific (Thailand) — ap-southeast-7' },
      { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo) — ap-northeast-1' },
      { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul) — ap-northeast-2' },
      { value: 'ap-northeast-3', label: 'Asia Pacific (Osaka) — ap-northeast-3' },
    ],
  },
  {
    group: 'Middle East & Africa',
    regions: [
      { value: 'af-south-1', label: 'Africa (Cape Town) — af-south-1' },
      { value: 'il-central-1', label: 'Israel (Tel Aviv) — il-central-1' },
      { value: 'me-south-1', label: 'Middle East (Bahrain) — me-south-1' },
      { value: 'me-central-1', label: 'Middle East (UAE) — me-central-1' },
    ],
  },
];

const AWS_GOV_REGIONS = [
  { value: 'us-gov-east-1', label: 'GovCloud (US-East) — us-gov-east-1' },
  { value: 'us-gov-west-1', label: 'GovCloud (US-West) — us-gov-west-1' },
];

// AWS China (Beijing / Ningxia); separate account type, console at console.amazonaws.cn
const AWS_CHINA_REGIONS = [
  { value: 'cn-north-1', label: 'China (Beijing) — cn-north-1' },
  { value: 'cn-northwest-1', label: 'China (Ningxia) — cn-northwest-1' },
];

function renderRegionSelect(selectEl, savedRegion, list) {
  selectEl.textContent = '';
  list.forEach(({ value, label }) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    if (value === savedRegion) opt.selected = true;
    selectEl.appendChild(opt);
  });
}

function renderRegionSelectGrouped(selectEl, savedRegion, groupedList) {
  selectEl.textContent = '';
  groupedList.forEach(({ group, regions }) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group;
    regions.forEach(({ value, label }) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = label;
      if (value === savedRegion) opt.selected = true;
      optgroup.appendChild(opt);
    });
    selectEl.appendChild(optgroup);
  });
}

function showStatus(message) {
  const el = document.getElementById('status');
  el.textContent = message;
}

document.addEventListener('DOMContentLoaded', async () => {
  const select = document.getElementById('region');
  const selectGov = document.getElementById('regionGov');
  const selectCn = document.getElementById('regionCn');

  const pauseCheckbox = document.getElementById('pauseRedirects');
  const debugCheckbox = document.getElementById('debugLogging');
  const { [REGION_KEY]: stored, [REGION_KEY_GOV]: storedGov, [REGION_KEY_CN]: storedCn, [DEBUG_LOGGING_KEY]: debugLogging, [REDIRECTS_PAUSED_KEY]: redirectsPaused } = await chrome.storage.sync.get([REGION_KEY, REGION_KEY_GOV, REGION_KEY_CN, DEBUG_LOGGING_KEY, REDIRECTS_PAUSED_KEY]);
  renderRegionSelectGrouped(select, stored || DEFAULT_REGION, AWS_REGIONS_GROUPED);
  renderRegionSelect(selectGov, storedGov || DEFAULT_REGION_GOV, AWS_GOV_REGIONS);
  renderRegionSelect(selectCn, storedCn || DEFAULT_REGION_CN, AWS_CHINA_REGIONS);
  pauseCheckbox.checked = !!redirectsPaused;
  debugCheckbox.checked = !!debugLogging;

  async function save() {
    try {
      await chrome.storage.sync.set({
        [REGION_KEY]: select.value,
        [REGION_KEY_GOV]: selectGov.value,
        [REGION_KEY_CN]: selectCn.value,
      });
      showStatus('Saved. Redirect rules updated.');
    } catch (err) {
      showStatus('Failed to save.');
    }
    setTimeout(() => { showStatus(''); }, 2000);
  }

  [select, selectGov, selectCn].forEach((el) => {
    el.addEventListener('change', save);
  });

  pauseCheckbox.addEventListener('change', async () => {
    try {
      await chrome.storage.sync.set({ [REDIRECTS_PAUSED_KEY]: pauseCheckbox.checked });
      showStatus(pauseCheckbox.checked ? 'Redirects paused.' : 'Redirects enabled.');
    } catch (err) {
      showStatus('Failed to save.');
    }
    setTimeout(() => { showStatus(''); }, 2000);
  });

  debugCheckbox.addEventListener('change', async () => {
    try {
      await chrome.storage.sync.set({ [DEBUG_LOGGING_KEY]: debugCheckbox.checked });
      showStatus(debugCheckbox.checked ? 'Debug logging on.' : 'Debug logging off.');
    } catch (err) {
      showStatus('Failed to save.');
    }
    setTimeout(() => { showStatus(''); }, 2000);
  });
});
