document.addEventListener('DOMContentLoaded', async function() {
  const statusDiv = document.getElementById('status');
  const statusText = document.getElementById('status-text');
  const unlockBtn = document.getElementById('unlock-btn');
  const popupLogo = document.getElementById('popup-logo');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const isGlassdoor = tab.url && tab.url.includes('glassdoor.com');
    
    if (isGlassdoor) {
      statusDiv.className = 'status active';
      statusText.textContent = '✓ Active on Glassdoor';
      unlockBtn.disabled = false;
      popupLogo.src = 'icons/logo.png';
    } else {
      statusDiv.className = 'status inactive';
      statusText.textContent = '⚠ Not on Glassdoor';
      unlockBtn.disabled = true;
      unlockBtn.textContent = '🔒 Only works on Glassdoor';
      popupLogo.src = 'icons/logo_inactive.png';
    }
    
    unlockBtn.addEventListener('click', async function() {
      if (!isGlassdoor) return;
      
      try {
        unlockBtn.textContent = '🔄 Unlocking...';
        unlockBtn.disabled = true;
        
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: function() {
            const contentOverlay = document.getElementById('ContentHardsellOverlay');
            if (contentOverlay) {
              contentOverlay.remove();
            }
            
            const body = document.getElementsByTagName("body")[0];
            if (body) {
              body.style.overflow = "scroll";
              body.style.position = "unset";
            }
            
            let style = document.createElement('style');
            style.innerHTML = `
              #LoginModal {
                display: none!important;
              }
              #ContentHardsellOverlay {
                display: none!important;
              }
            `;
            document.head.appendChild(style);
            
            window.addEventListener("scroll", function(event) {
              event.stopPropagation();
            }, true);
          }
        });
        
        unlockBtn.textContent = '✓ Unlocked!';
        setTimeout(() => {
          unlockBtn.textContent = '🔓 Unlock Now';
          unlockBtn.disabled = false;
        }, 2000);
        
      } catch (error) {
        console.error('Error executing script:', error);
        unlockBtn.textContent = '❌ Error';
        setTimeout(() => {
          unlockBtn.textContent = '🔓 Unlock Now';
          unlockBtn.disabled = false;
        }, 2000);
      }
    });
    
  } catch (error) {
    console.error('Error in popup:', error);
    statusDiv.className = 'status inactive';
    statusText.textContent = '❌ Error loading';
  }
});