// Bubbles: create and animate
const bubblesContainer = document.querySelector('.bubbles');
const bubbleCount = 12;
const bubbles = [];

for (let i = 0; i < bubbleCount; i++) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  const size = 40 + Math.random() * 80;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 100}vw`;
  bubble.style.top = `${Math.random() * 100}vh`;
  bubble.style.transitionDuration = `${1 + Math.random() * 2}s`;
  bubblesContainer.appendChild(bubble);
  bubbles.push(bubble);
}

// Animate bubbles on mouse move
// (bubbles float toward the mouse position)
document.addEventListener('mousemove', e => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  bubbles.forEach((bubble, i) => {
    const dx = (x - 0.5) * (30 + i * 2);
    const dy = (y - 0.5) * (30 + i * 2);
    bubble.style.transform = `translate(${dx}px, ${dy}px)`;
  });
});

// Stagger card entrance
// (each card animates in with a delay)
document.querySelectorAll('.glass-card').forEach((card, i) => {
  card.style.setProperty('--delay', `${0.3 + i * 0.2}s`);
});

// Timeline interactivity
const aboutText = document.getElementById('about-text');
const ticks = document.querySelectorAll('.timeline-tick');
const timelineDot = document.getElementById('timeline-dot');
const yearLabel = document.getElementById('timeline-year-label');
const indicator = document.querySelector('.timeline-indicator');
let indicatorHidden = false;

async function setupTimelineFromJSON() {
  const timeline = document.querySelector('.timeline');
  const aboutText = document.getElementById('about-text');
  const timelineDot = document.getElementById('timeline-dot');
  if (!timeline || !aboutText || !timelineDot) return;

  // Fetch JSON data
  let data = [];
  try {
    const res = await fetch('about-timeline.json');
    data = await res.json();
  } catch (e) {
    aboutText.textContent = 'Could not load timeline data.';
    return;
  }

  // Remove any existing ticks
  timeline.querySelectorAll('.timeline-tick').forEach(t => t.remove());

  // Generate ticks
  const ticks = [];
  const n = data.length;
  data.forEach((item, i) => {
    const percent = (n === 1) ? 50 : (i * 100 / (n - 1));
    const tick = document.createElement('div');
    tick.className = 'timeline-tick';
    tick.setAttribute('data-year', item.year);
    tick.setAttribute('data-text', item.text);
    tick.setAttribute('data-pos', percent);
    tick.style.left = percent + '%';
    timeline.appendChild(tick);
    ticks.push(tick);
  });

  // Interactivity
  function setActiveTick(tick) {
    ticks.forEach(t => t.classList.remove('active'));
    tick.classList.add('active');
    aboutText.textContent = tick.getAttribute('data-text');
    // Move the dot
    const pos = tick.getAttribute('data-pos');
    if (timelineDot && pos !== null) {
      timelineDot.style.left = pos + '%';
    }
    // Show the year under the timeline
    if (yearLabel) {
      yearLabel.textContent = tick.getAttribute('data-year');
    }
  }

  function hideIndicator() {
    if (indicator && !indicatorHidden) {
      indicator.style.display = 'none';
      indicatorHidden = true;
    }
  }

  ticks.forEach(tick => {
    tick.addEventListener('click', () => {
      setActiveTick(tick);
      hideIndicator();
    });
  });

  // Dragging logic (reuse previous code)
  let isDragging = false;
  let timelineRect = null;
  function getClosestTick(percent) {
    let minDist = 101;
    let closest = null;
    ticks.forEach(tick => {
      const pos = parseFloat(tick.getAttribute('data-pos'));
      const dist = Math.abs(pos - percent);
      if (dist < minDist) {
        minDist = dist;
        closest = tick;
      }
    });
    return closest;
  }
  if (timelineDot) {
    timelineDot.addEventListener('mousedown', e => { hideIndicator(); startDrag(e); });
    timelineDot.addEventListener('touchstart', e => { hideIndicator(); startDrag(e); }, {passive: false});
  }
  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    timelineRect = timelineDot.parentElement.getBoundingClientRect();
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, {passive: false});
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  }
  function onDrag(e) {
    if (!isDragging) return;
    let clientX;
    if (e.touches) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    let percent = ((clientX - timelineRect.left) / timelineRect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    timelineDot.style.left = percent + '%';
    // Show text for the closest tick while dragging
    const closest = getClosestTick(percent);
    if (closest) {
      aboutText.textContent = closest.getAttribute('data-text');
      ticks.forEach(t => t.classList.remove('active'));
      closest.classList.add('active');
    }
  }
  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
    // Snap to the nearest tick
    let clientX;
    if (e.changedTouches) {
      clientX = e.changedTouches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    let percent = ((clientX - timelineRect.left) / timelineRect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    const closest = getClosestTick(percent);
    if (closest) setActiveTick(closest);
  }

  // Set initial active tick (first)
  if (ticks[0]) setActiveTick(ticks[0]);
}

setupTimelineFromJSON();

// Initialize projects if on projects page
if (document.querySelector('.projects-list')) {
  renderProjects().catch(error => {
    console.error('Error rendering projects:', error);
  });
} 