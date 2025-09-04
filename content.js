function unlockGlassdoor() {
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', unlockGlassdoor);
} else {
  unlockGlassdoor();
}

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length) {
      const contentOverlay = document.getElementById('ContentHardsellOverlay');
      const loginModal = document.getElementById('LoginModal');
      if (contentOverlay || loginModal) {
        unlockGlassdoor();
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});