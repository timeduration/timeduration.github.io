// CONFIG
const CONFIG = {
  formspreeEndpoint: 'https://formspree.io/f/yourFormID'
};

// HELPER FUNCTIONS
const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, '0');
const nowIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// THEME MANAGEMENT
const themeToggle = $('themeToggle');

function currentTheme() {
  return localStorage.getItem('timeculator-theme') || 'dark';
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light');
    document.body.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
    document.body.classList.remove('light');
  }
  localStorage.setItem('timeculator-theme', theme);
  
  // More stylish icons with better visibility
  const icon = theme === 'light' 
    ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
         <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
       </svg>`
    : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
         <circle cx="12" cy="12" r="5"></circle>
         <line x1="12" y1="1" x2="12" y2="3"></line>
         <line x1="12" y1="21" x2="12" y2="23"></line>
         <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
         <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
         <line x1="1" y1="12" x2="3" y2="12"></line>
         <line x1="21" y1="12" x2="23" y2="12"></line>
         <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
         <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
       </svg>`;
  
  themeToggle.innerHTML = icon;
}

// Initialize theme
applyTheme(currentTheme());

themeToggle.addEventListener('click', () => {
  const newTheme = currentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
});

// MODE SWITCHING
const durationMode = $('durationMode');
const calculatorMode = $('calculatorMode');
const tabDuration = $('tabDuration');
const tabCalculator = $('tabCalculator');

function switchMode(mode) {
  if (mode === 'duration') {
    durationMode.classList.add('active');
    calculatorMode.classList.remove('active');
    tabDuration.classList.add('active');
    tabCalculator.classList.remove('active');
  } else {
    calculatorMode.classList.add('active');
    durationMode.classList.remove('active');
    tabCalculator.classList.add('active');
    tabDuration.classList.remove('active');
  }
}

tabDuration.addEventListener('click', () => switchMode('duration'));
tabCalculator.addEventListener('click', () => switchMode('calculator'));

// SET CURRENT YEAR
if ($('curYear')) {
  $('curYear').textContent = new Date().getFullYear();
}

// INITIALIZE DATE FIELDS
if ($('startDate')) {
  $('startDate').value = nowIso();
}
if ($('endDate')) {
  $('endDate').value = nowIso();
}

// DURATION CALCULATOR
$('calcDuration').addEventListener('click', () => {
  const sd = $('startDate').value || nowIso();
  const st = $('startTime').value || '00:00';
  const ed = $('endDate').value || nowIso();
  const et = $('endTime').value || '00:00';
  const showSeconds = $('showSeconds').checked;

  const start = new Date(`${sd}T${st}:00`);
  const end = new Date(`${ed}T${et}:00`);
  
  let diffMs = end - start;
  
  if (diffMs < 0 && sd === ed) {
    diffMs += 24 * 3600 * 1000;
  }
  
  const sign = diffMs < 0 ? '-' : '';
  const abs = Math.abs(diffMs);
  let secs = Math.floor(abs / 1000);
  
  const days = Math.floor(secs / 86400);
  secs %= 86400;
  const hours = Math.floor(secs / 3600);
  secs %= 3600;
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;

  $('durationResult').style.display = 'grid';
  $('durationMain').textContent = `${sign}${days}d ${hours}h ${minutes}m${showSeconds ? ` ${seconds}s` : ''}`;
  $('durationSub').textContent = `From ${start.toLocaleDateString()} ${start.toLocaleTimeString()} to ${end.toLocaleDateString()} ${end.toLocaleTimeString()}`;
  $('durationMeta').textContent = `Total Duration Breakdown:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDays: ${days}\nHours: ${hours}\nMinutes: ${minutes}\nSeconds: ${seconds}\n\nTotal Seconds: ${Math.floor(Math.abs(diffMs) / 1000).toLocaleString()}\n\nStart: ${start.toLocaleString()}\nEnd: ${end.toLocaleString()}`;

  const pills = $('durationPills');
  pills.innerHTML = '';
  
  if (days) {
    const p = document.createElement('span');
    p.className = 'pill';
    p.textContent = `${days}d`;
    pills.appendChild(p);
  }
  
  const hPill = document.createElement('span');
  hPill.className = 'pill';
  hPill.textContent = `${hours}h`;
  pills.appendChild(hPill);
  
  const mPill = document.createElement('span');
  mPill.className = 'pill';
  mPill.textContent = `${minutes}m`;
  pills.appendChild(mPill);
  
  if (showSeconds) {
    const sPill = document.createElement('span');
    sPill.className = 'pill';
    sPill.textContent = `${seconds}s`;
    pills.appendChild(sPill);
  }
});

$('clearDuration').addEventListener('click', () => {
  $('startTime').value = '';
  $('endTime').value = '';
  $('durationResult').style.display = 'none';
});

// TIME CALCULATOR (BLOCKS)
$('calcTime2').addEventListener('click', () => {
  const n = (id) => Number($(id).value || 0);
  
  const aTotal = ((n('aDays') * 24 + n('aHours')) * 60 + n('aMinutes')) * 60 + n('aSeconds');
  const bTotal = ((n('bDays') * 24 + n('bHours')) * 60 + n('bMinutes')) * 60 + n('bSeconds');
  const op = $('opType2').value;
  
  let res = op === 'add' ? aTotal + bTotal : aTotal - bTotal;
  const sign = res < 0 ? '-' : '';
  res = Math.abs(res);
  
  let secs = res;
  const days = Math.floor(secs / 86400);
  secs %= 86400;
  const hours = Math.floor(secs / 3600);
  secs %= 3600;
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;

  $('timeResult').style.display = 'grid';
  $('timeMain').textContent = `${sign}${days}d ${hours}h ${minutes}m ${seconds}s`;
  $('timeSub').textContent = `Operation: Block A ${op === 'add' ? '+' : '−'} Block B = Result`;
  $('timeMeta').textContent = `Calculation Result:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDays: ${days}\nHours: ${hours}\nMinutes: ${minutes}\nSeconds: ${seconds}\n\nTotal Seconds: ${res.toLocaleString()}\n\nBlock A: ${n('aDays')}d ${n('aHours')}h ${n('aMinutes')}m ${n('aSeconds')}s\nBlock B: ${n('bDays')}d ${n('bHours')}h ${n('bMinutes')}m ${n('bSeconds')}s`;

  const pills = $('timePills');
  pills.innerHTML = '';
  
  if (days) {
    const p = document.createElement('span');
    p.className = 'pill';
    p.textContent = `${days}d`;
    pills.appendChild(p);
  }
  
  const hPill = document.createElement('span');
  hPill.className = 'pill';
  hPill.textContent = `${hours}h`;
  pills.appendChild(hPill);
  
  const mPill = document.createElement('span');
  mPill.className = 'pill';
  mPill.textContent = `${minutes}m`;
  pills.appendChild(mPill);
  
  if (seconds) {
    const sPill = document.createElement('span');
    sPill.className = 'pill';
    sPill.textContent = `${seconds}s`;
    pills.appendChild(sPill);
  }
});

$('clearTime2').addEventListener('click', () => {
  ['aDays', 'aHours', 'aMinutes', 'aSeconds', 'bDays', 'bHours', 'bMinutes', 'bSeconds'].forEach(id => {
    $(id).value = '';
  });
  $('timeResult').style.display = 'none';
});

// COPY & SHARE FUNCTIONS
$('copyDuration').addEventListener('click', () => {
  navigator.clipboard.writeText($('durationMeta').textContent)
    .then(() => alert('Duration copied to clipboard!'));
});

$('shareDuration').addEventListener('click', async () => {
  const txt = $('durationMeta').textContent;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Duration result', text: txt });
    } catch (e) {
      navigator.clipboard.writeText(txt).then(() => alert('Copied to clipboard!'));
    }
  } else {
    navigator.clipboard.writeText(txt).then(() => alert('Copied to clipboard!'));
  }
});

$('copyTime').addEventListener('click', () => {
  navigator.clipboard.writeText($('timeMeta').textContent)
    .then(() => alert('Time result copied to clipboard!'));
});

$('shareTime').addEventListener('click', async () => {
  const txt = $('timeMeta').textContent;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Time result', text: txt });
    } catch (e) {
      navigator.clipboard.writeText(txt).then(() => alert('Copied to clipboard!'));
    }
  } else {
    navigator.clipboard.writeText(txt).then(() => alert('Copied to clipboard!'));
  }
});

// QUICK SECONDS
$('quickAdd').addEventListener('click', () => {
  const s = Number($('quickSeconds').value || 0);
  const m = Math.floor(s / 60);
  
  $('aDays').value = 0;
  $('aHours').value = 0;
  $('aMinutes').value = m;
  $('aSeconds').value = s % 60;
  $('opType2').value = 'add';
  
  switchMode('calculator');
  $('calcTime2').click();
});

// EXPORT FUNCTIONS
$('copyAll').addEventListener('click', () => {
  const parts = [];
  
  if ($('durationMain').textContent !== '0d 0h 0m') {
    parts.push('Duration: ' + $('durationMain').textContent);
  }
  
  if ($('timeMain').textContent !== '0d 0h 0m') {
    parts.push('Time: ' + $('timeMain').textContent);
  }
  
  const txt = parts.length > 0 ? parts.join('\n') : 'No results calculated yet';
  navigator.clipboard.writeText(txt).then(() => alert('All results copied!'));
});

$('printPage').addEventListener('click', () => {
  window.print();
});

// STEPPER BUTTONS
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('step-up')) {
    const id = e.target.dataset.target;
    const input = $(id);
    if (input) {
      input.stepUp();
      input.dispatchEvent(new Event('input'));
    }
  }

  if (e.target.classList.contains('step-down')) {
    const id = e.target.dataset.target;
    const input = $(id);
    if (input) {
      input.stepDown();
      input.dispatchEvent(new Event('input'));
    }
  }
});

// MODAL FUNCTIONS
const modal = $('modalBackdrop');

$('contactOpen').addEventListener('click', () => {
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  if ($('formspreeStatus')) {
    $('formspreeStatus').textContent = '';
  }
});

$('closeModal').addEventListener('click', () => {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
});

$('cancelModal').addEventListener('click', () => {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
});

// FORMSPREE CONTACT FORM
const contactForm = $('contactForm');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const statusEl = $('formspreeStatus');
  statusEl.textContent = 'Sending...';
  
  const formData = new FormData(contactForm);
  const endpoint = contactForm.getAttribute('action') || CONFIG.formspreeEndpoint;
  
  if (endpoint.includes('yourFormID')) {
    statusEl.textContent = 'Please replace the Formspree form ID in the code.';
    return;
  }
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (res.ok) {
      statusEl.textContent = 'Message sent successfully! ✓';
      contactForm.reset();
      setTimeout(() => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }, 1500);
    } else {
      const data = await res.json().catch(() => null);
      statusEl.textContent = data && data.error ? `Error: ${data.error}` : 'Submission failed';
    }
  } catch (err) {
    statusEl.textContent = 'Network error — please try again';
  }
});