let panelCount = 0;
let layoutToggled = false;

function addPanel() {
    panelCount++;
    const [url, chaturl] = convertToEmbedLink(prompt('請輸入要顯示的網址：', 'https://www.youtube.com/watch?v=hswKp0pkuLs'));
    if (url) {
      const newPanel = document.createElement('div');
      newPanel.className = 'panel';
      newPanel.style.display = 'flex';
      newPanel.style.flexDirection = 'row-reverse';
      newPanel.style.alignItems = 'flex-end';
      newPanel.style.width = 'calc(640px + 0px)';
      newPanel.style.height = '360px';
      newPanel.style.position = 'absolute';
      newPanel.id = 'panel' + panelCount;

      const newSwitch = document.createElement('button');
      newSwitch.className = 'switch';
      newSwitch.style.position = 'absolute';
      newSwitch.style.width = '100px';
      newSwitch.style.height = '100px';
      newSwitch.style.backgroundColor = '#ffffff00';
      newSwitch.style.border = '0px'
      newSwitch.innerText = ''; 
      newPanel.appendChild(newSwitch);
      newSwitch.addEventListener('dblclick', () => {
        const originalWidth = newPanel.style.width;
        const originalHeight = newPanel.style.height;
        newPanel.style.width = originalHeight;
        newPanel.style.height = originalWidth;
      });
      
      const newdel = document.createElement('button');
      newdel.className = 'delelt';
      newdel.style.position = 'absolute';
      newdel.style.width = '30px';
      newdel.style.height = '30px';
      newdel.style.backgroundColor = '#ffffff00';
      newdel.style.border = '0px';
      newdel.style.top = '0px';
      newdel.style.fontSize = '25px';
      newdel.innerText = '×'; 
      newPanel.appendChild(newdel);
      newdel.addEventListener('click', () => {
        document.getElementById(newPanel.id).remove()
      });

      const newchatFrame = document.createElement('iframe');
      newchatFrame.src = chaturl;
      newchatFrame.className = 'msg'
      newchatFrame.style.width = 'calc(0% + 0px)';
      newchatFrame.style.height = '100%';
      newchatFrame.style.border = 'none';
      newchatFrame.style.display = 'none';
      newPanel.appendChild(newchatFrame);

      const newFrame = document.createElement('iframe');
      newFrame.src = url;
      newFrame.style.width = 'calc(100% - 0px)';
      newFrame.style.height = '100%';
      newFrame.style.border = 'none';
      newPanel.appendChild(newFrame);

      newSwitch.addEventListener('mousedown', (e) => {
        let isDragging = true;
        let startX = e.clientX;
        let startY = e.clientY;
        let startWidth = parseInt(window.getComputedStyle(newPanel).width)-0;
        let startHeight = parseInt(window.getComputedStyle(newPanel).height);
        function handleMouseMove(event) {
          if (isDragging) {
            const diffX = event.clientX - startX;
            const diffY = event.clientY - startY;
            const aspectRatio = startWidth / startHeight;
            let newWidth = startWidth + diffX;
            let newHeight = startHeight + diffY;
            const snapThreshold = 10;
            const snappedWidth = Math.round(newWidth / snapThreshold) * snapThreshold;
            const snappedHeight = Math.round(newHeight / snapThreshold) * snapThreshold;
        
            if (Math.abs(diffX) > Math.abs(diffY)) {
              newPanel.style.width = `calc(${snappedWidth}px + 0px)`;
              newPanel.style.height = Math.floor(snappedWidth / aspectRatio) + 'px';
            } else {
              newPanel.style.height = snappedHeight + 'px';
              newPanel.style.width = Math.floor(snappedHeight * aspectRatio) + 'px';
            }
          }
        }
        function handleMouseUp() {
          isDragging = false;
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        }
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      });

      document.getElementById('container').appendChild(newPanel);
    } else {
      alert('請輸入有效的網址！');
    }
    initializeDragAndDrop();
  }

function convertToEmbedLink(watchLink) {
  const videoId = getVideoIdFromLink(watchLink);
  if (videoId) {
    const embedLink = `https://www.youtube.com/embed/${videoId}?`;
    const chatLink = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}`;
    return [embedLink,chatLink];
  } else {
    return ['Invalid YouTube link','Invalid YouTube link'];
  }
}
function getVideoIdFromLink(watchLink) {
  const urlParams = new URLSearchParams(new URL(watchLink).search);
  const videoId = urlParams.get('v');
  return videoId;
}

function adjustPanelWidths() {
  const containerWidth = document.getElementById('container').clientWidth;
  const panels = document.querySelectorAll('.panel');
  const panelCount = panels.length;
  const panelWidth = containerWidth / panelCount;
  
  panels.forEach(panel => {
    panel.style.width = panelWidth + 'px';
  });
}

//document.addEventListener('DOMContentLoaded', () => {
//  const container = document.getElementById('container');
//  container.addEventListener('mousedown', (e) => {
//    if (e.target.classList.contains('panel')) {
//      const panel = e.target;
//      const panelRect = panel.getBoundingClientRect();
//      const startX = e.clientX;
//      const startY = e.clientY;
//      function handleMouseMove(event) {
//        const diffX = event.clientX - startX;
//        const diffY = event.clientY - startY;
//        panel.style.left = Math.max(panelRect.x + diffX,1) + 'px';
//        panel.style.top = Math.max(panelRect.y + diffY,100) + 'px';
//      }
//      function handleMouseUp() {
//        document.removeEventListener('mousemove', handleMouseMove);
//        document.removeEventListener('mouseup', handleMouseUp);
//      }
//
//      document.addEventListener('mousemove', handleMouseMove);
//      document.addEventListener('mouseup', handleMouseUp);
//    }
//  });
//});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  container.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('panel')) {
      const panel = e.target;
      const panelRect = panel.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const snapThreshold = 5; // 調整對齊閾值

      function handleMouseMove(event) {
        const diffX = event.clientX - startX;
        const diffY = event.clientY - startY;
        const newX = panelRect.left + diffX;
        const newY = panelRect.top + diffY;
        const snappedX = Math.round(newX / snapThreshold) * snapThreshold;
        const snappedY = Math.round(newY / snapThreshold) * snapThreshold;
        panel.style.left = Math.max(snappedX,0) + 'px';
        panel.style.top = Math.max(snappedY,100) + 'px';
      }

      function handleMouseUp() {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  });
});




function toggleLayout() {
  const frames = document.querySelectorAll('iframe');
  frames.forEach(frame => {
    if (!frame.classList.contains('msg')) {
      if (layoutToggled) {
        frame.style.display = 'block';
      } else {
        frame.style.display = 'none';
      }
    }
  });
  layoutToggled = !layoutToggled;
}

  document.getElementById('toggleButton').addEventListener('click', toggleLayout);


  //https://www.youtube.com/watch?v=Y_MsaGrVDhA
