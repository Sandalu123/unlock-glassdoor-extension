chrome.runtime.onInstalled.addListener(() => {
  console.log('Unlock The GlassDoor extension installed');
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    updateIcon(tab.url);
  } catch (error) {
    console.log('Error getting tab info:', error);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateIcon(tab.url);
  }
});

function updateIcon(url) {
  const isGlassdoor = url && url.includes('glassdoor.com');
  const iconPath = isGlassdoor ? 'icons/logo.png' : 'icons/logo_inactive.png';
  
  chrome.action.setIcon({
    path: {
      "16": iconPath,
      "32": iconPath,
      "48": iconPath,
      "128": iconPath
    }
  });
}