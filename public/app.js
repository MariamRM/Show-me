const dom = {
  camera: document.getElementById("camera"),
  cameraState: document.getElementById("cameraState"),
  startCamera: document.getElementById("startCamera"),
  stopCamera: document.getElementById("stopCamera"),
  guidanceToggle: document.getElementById("guidanceToggle"),
  analyzeNow: document.getElementById("analyzeNow"),
  imageUpload: document.getElementById("imageUpload"),
  captureCanvas: document.getElementById("captureCanvas"),
  snapshot: document.getElementById("snapshot"),
  autoSpeak: document.getElementById("autoSpeak"),
  hapticAlerts: document.getElementById("hapticAlerts"),
  spatialAudio: document.getElementById("spatialAudio"),
  shortcutMode: document.getElementById("shortcutMode"),
  speechRate: document.getElementById("speechRate"),
  cueVolume: document.getElementById("cueVolume"),
  summaryText: document.getElementById("summaryText"),
  directionText: document.getElementById("directionText"),
  hazardsList: document.getElementById("hazardsList"),
  guidanceList: document.getElementById("guidanceList"),
  mobilityList: document.getElementById("mobilityList"),
  itemsList: document.getElementById("itemsList"),
  statusLine: document.getElementById("statusLine"),
  analysisState: document.getElementById("analysisState"),
  modeBadge: document.getElementById("modeBadge"),
  shortcutHint: document.getElementById("shortcutHint"),
  speakAgain: document.getElementById("speakAgain"),
  stopSpeaking: document.getElementById("stopSpeaking")
};

const modeLabels = {
  navigation: "Path Guide",
  surroundings: "Surroundings",
  grocery: "Grocery Helper"
};

const state = {
  mode: "navigation",
  stream: null,
  guidanceTimer: null,
  guidanceActive: false,
  analyzing: false,
  lastImage: "",
  lastSpokenMessage: "",
  lastAnalysis: null,
  audioContext: null,
  voices: [],
  speechUnlocked: false
};

const modeCards = [...document.querySelectorAll(".mode-card")];

bindEvents();
loadVoices();
configureMediaSession();
checkHealth();
updateShortcutHint();

function bindEvents() {
  document.addEventListener("pointerdown", handleUserGesture, { passive: true });
  document.addEventListener("keydown", handleKeyboardShortcut);

  dom.startCamera.addEventListener("click", async () => {
    await handleUserGesture();
    await startCamera();
  });
  dom.stopCamera.addEventListener("click", stopCamera);
  dom.guidanceToggle.addEventListener("click", async () => {
    await handleUserGesture();
    await toggleGuidanceSession();
  });
  dom.analyzeNow.addEventListener("click", async () => {
    await handleUserGesture();
    await analyzeCurrentView();
  });
  dom.speakAgain.addEventListener("click", async () => {
    await handleUserGesture();
    if (state.lastSpokenMessage) {
      await speak(state.lastSpokenMessage);
    }
  });
  dom.stopSpeaking.addEventListener("click", stopSpeaking);
  dom.imageUpload.addEventListener("change", handleUpload);
  dom.shortcutMode.addEventListener("change", updateShortcutHint);

  for (const card of modeCards) {
    card.addEventListener("click", () => selectMode(card.dataset.mode));
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  }
}

async function handleUserGesture() {
  await primeAudioSystems();
}

function loadVoices() {
  if (!("speechSynthesis" in window)) {
    return;
  }

  state.voices = window.speechSynthesis.getVoices();
}

function configureMediaSession() {
  if (!("mediaSession" in navigator)) {
    return;
  }

  const handlers = {
    play: () => void toggleGuidanceSession(),
    pause: () => stopGuidanceSession(),
    stop: () => stopGuidanceSession()
  };

  for (const [action, handler] of Object.entries(handlers)) {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {
      continue;
    }
  }
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    if (!data.hasApiKey) {
      updateStatus("Set OPENAI_API_KEY before analysis can work.");
    }
  } catch {
    updateStatus("Server not reachable yet.");
  }
}

async function startCamera() {
  if (state.stream) {
    return true;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    state.stream = stream;
    dom.camera.srcObject = stream;
    dom.cameraState.textContent = "Camera on";
    updateStatus("Camera is live. You can start a guidance session now.");
    return true;
  } catch (error) {
    updateStatus("Camera access failed. Allow permission or use a photo upload.");
    console.error(error);
    return false;
  }
}

function stopCamera() {
  stopGuidanceSession();

  if (state.stream) {
    for (const track of state.stream.getTracks()) {
      track.stop();
    }
  }

  state.stream = null;
  dom.camera.srcObject = null;
  dom.cameraState.textContent = "Camera off";
  updateStatus("Camera stopped.");
}

function selectMode(mode) {
  state.mode = mode;
  dom.modeBadge.textContent = modeLabels[mode];

  for (const card of modeCards) {
    const active = card.dataset.mode === mode;
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-selected", String(active));
  }

  updateStatus(`${modeLabels[mode]} selected.`);
}

async function toggleGuidanceSession() {
  if (state.guidanceActive) {
    stopGuidanceSession();
    return;
  }

  const cameraReady = await startCamera();
  if (!cameraReady) {
    return;
  }

  state.guidanceActive = true;
  dom.guidanceToggle.textContent = "Stop Guidance";
  dom.guidanceToggle.classList.remove("button-accent");
  dom.guidanceToggle.classList.add("button-primary");
  dom.analysisState.textContent = "Guidance on";
  updateStatus("Guidance session started. Scanning every 4 seconds.");

  await analyzeCurrentView();
  state.guidanceTimer = window.setInterval(() => {
    if (!state.analyzing) {
      void analyzeCurrentView({ silentOnEmpty: true });
    }
  }, 4000);
}

function stopGuidanceSession() {
  if (state.guidanceTimer) {
    window.clearInterval(state.guidanceTimer);
    state.guidanceTimer = null;
  }

  if (state.guidanceActive) {
    updateStatus("Guidance session stopped.");
  }

  state.guidanceActive = false;
  dom.guidanceToggle.textContent = "Start Guidance";
  dom.guidanceToggle.classList.remove("button-primary");
  dom.guidanceToggle.classList.add("button-accent");
  if (!state.analyzing) {
    dom.analysisState.textContent = "Idle";
  }
}

function handleKeyboardShortcut(event) {
  if (dom.shortcutMode.value !== "keyboard") {
    return;
  }

  if (event.repeat) {
    return;
  }

  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    void handleUserGesture();
    void toggleGuidanceSession();
  }
}

function updateShortcutHint() {
  const mode = dom.shortcutMode.value;
  if (mode === "keyboard") {
    dom.shortcutHint.textContent =
      "Keyboard mode: press Space or Enter to start or stop the guidance session.";
    return;
  }

  if (mode === "headset") {
    dom.shortcutHint.textContent =
      "Headset mode: some browsers support the headset play-pause button. Phone volume buttons still require a native app.";
    return;
  }

  dom.shortcutHint.textContent =
    "Touch mode: use the large Start Guidance button. Phone volume buttons cannot be read by a normal web page.";
}

async function handleUpload(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  await handleUserGesture();

  const reader = new FileReader();
  reader.onload = async () => {
    const dataUrl = typeof reader.result === "string" ? reader.result : "";
    if (!dataUrl) {
      return;
    }

    state.lastImage = dataUrl;
    dom.snapshot.src = dataUrl;
    dom.snapshot.hidden = false;
    updateStatus("Photo loaded. Sending it for analysis.");
    await analyzeImage(dataUrl);
  };

  reader.readAsDataURL(file);
}

async function analyzeCurrentView(options = {}) {
  const image = captureFrame();
  if (!image) {
    if (!options.silentOnEmpty) {
      updateStatus("Start the camera or upload a photo first.");
    }
    return;
  }

  await analyzeImage(image);
}

function captureFrame() {
  if (state.lastImage && !state.stream) {
    return state.lastImage;
  }

  const video = dom.camera;
  if (!video.videoWidth || !video.videoHeight) {
    return "";
  }

  const maxWidth = 960;
  const width = Math.min(video.videoWidth, maxWidth);
  const height = Math.round((video.videoHeight / video.videoWidth) * width);
  const canvas = dom.captureCanvas;
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  state.lastImage = dataUrl;
  dom.snapshot.src = dataUrl;
  dom.snapshot.hidden = false;
  return dataUrl;
}

async function analyzeImage(image) {
  if (state.analyzing) {
    return;
  }

  state.analyzing = true;
  dom.analyzeNow.disabled = true;
  dom.guidanceToggle.disabled = true;
  dom.analysisState.textContent = "Analyzing";
  updateStatus(`Analyzing ${modeLabels[state.mode].toLowerCase()}...`);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mode: state.mode,
        image
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Analysis failed.");
    }

    state.lastAnalysis = data.analysis;
    renderAnalysis(data.analysis);
    await sendAssistiveFeedback(data.analysis);
    dom.analysisState.textContent = `Ready - ${data.analysis.confidence}`;
    updateStatus("Analysis complete.");
  } catch (error) {
    dom.analysisState.textContent = "Error";
    updateStatus(error.message || "Analysis failed.");
    console.error(error);
  } finally {
    state.analyzing = false;
    dom.analyzeNow.disabled = false;
    dom.guidanceToggle.disabled = false;
  }
}

function renderAnalysis(analysis) {
  dom.summaryText.textContent = analysis.summary;
  dom.directionText.textContent = formatDirection(analysis.recommended_direction);
  renderList(dom.hazardsList, analysis.hazards, "No immediate hazards reported.");
  renderList(dom.guidanceList, analysis.guidance, "No guidance available.");
  renderList(
    dom.mobilityList,
    (analysis.mobility_cues || []).map(formatMobilityCue),
    "No directional cues yet."
  );
  renderList(dom.itemsList, analysis.detected_items, "No items detected.");

  state.lastSpokenMessage = analysis.spoken_message || analysis.summary;
}

function renderList(element, items, fallback) {
  element.innerHTML = "";
  const values = Array.isArray(items) && items.length ? items : [fallback];
  for (const item of values) {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  }
}

function formatDirection(direction) {
  const labels = {
    left: "Move slightly left if clear.",
    center: "Continue forward through the center.",
    right: "Move slightly right if clear.",
    stop: "Stop and reassess before moving."
  };

  return labels[direction] || "Waiting for a route.";
}

function formatMobilityCue(cue) {
  return `${capitalize(cue.kind.replace(/_/g, " "))} ${cue.side}, ${cue.distance}, ${cue.urgency} urgency: ${cue.message}`;
}

async function sendAssistiveFeedback(analysis) {
  const cues = Array.isArray(analysis.mobility_cues) ? analysis.mobility_cues.slice(0, 3) : [];

  if (dom.hapticAlerts.checked) {
    vibrateForCues(cues);
  }

  if (dom.spatialAudio.checked) {
    await playSpatialCueSequence(cues);
  }

  if (dom.autoSpeak.checked && state.lastSpokenMessage) {
    await speak(state.lastSpokenMessage);
  }
}

function vibrateForCues(cues) {
  if (!("vibrate" in navigator) || !cues.length) {
    return;
  }

  const primaryCue = cues[0];
  navigator.vibrate(getVibrationPattern(primaryCue));
}

function getVibrationPattern(cue) {
  const patterns = {
    clear_path: [40],
    wall: [200, 70, 200],
    obstacle: [160, 40, 160, 40, 160],
    step_up: [90, 40, 90],
    step_down: [120, 50, 120, 50, 220],
    curb: [120, 60, 180],
    floor_change: [100, 30, 100, 30, 100],
    person: [70, 40, 70],
    door: [60, 20, 60],
    shelf: [70, 20, 120],
    counter: [90, 30, 140],
    unknown: [100]
  };

  return patterns[cue?.kind] || patterns.unknown;
}

async function playSpatialCueSequence(cues) {
  if (!cues.length) {
    return;
  }

  await primeAudioSystems();
  if (!state.audioContext) {
    return;
  }

  for (const cue of cues) {
    playCueTone(cue);
    await delay(getCueGap(cue));
  }
}

function playCueTone(cue) {
  if (!state.audioContext) {
    return;
  }

  const context = state.audioContext;
  const now = context.currentTime;
  const duration = getCueDuration(cue);
  const gainNode = context.createGain();
  gainNode.gain.setValueAtTime(0.001, now);
  gainNode.gain.linearRampToValueAtTime(Number(dom.cueVolume.value || 0.5), now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  const oscillator = context.createOscillator();
  oscillator.type = cue.kind === "clear_path" ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(getCueFrequency(cue.kind), now);

  let outputNode = gainNode;
  if (typeof context.createStereoPanner === "function") {
    const panner = context.createStereoPanner();
    panner.pan.setValueAtTime(getCuePan(cue.side), now);
    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(context.destination);
    outputNode = panner;
  } else {
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
  }

  oscillator.start(now);
  oscillator.stop(now + duration);
  oscillator.onended = () => {
    outputNode.disconnect?.();
    gainNode.disconnect?.();
  };
}

function getCueFrequency(kind) {
  const values = {
    clear_path: 760,
    wall: 210,
    obstacle: 280,
    step_up: 560,
    step_down: 430,
    curb: 390,
    floor_change: 480,
    person: 330,
    door: 620,
    shelf: 250,
    counter: 230,
    unknown: 300
  };

  return values[kind] || values.unknown;
}

function getCuePan(side) {
  const values = {
    left: -0.8,
    center: 0,
    right: 0.8
  };

  return values[side] ?? 0;
}

function getCueDuration(cue) {
  const distanceDurations = {
    near: 0.35,
    mid: 0.24,
    far: 0.16
  };
  const urgencyBoost = cue.urgency === "high" ? 0.08 : cue.urgency === "medium" ? 0.03 : 0;
  return (distanceDurations[cue.distance] || 0.2) + urgencyBoost;
}

function getCueGap(cue) {
  return cue.distance === "near" ? 320 : 240;
}

async function primeAudioSystems() {
  await ensureAudioContext();

  if ("speechSynthesis" in window && !state.speechUnlocked) {
    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
    window.speechSynthesis.cancel();
    state.speechUnlocked = true;
  }
}

async function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  if (!state.audioContext) {
    state.audioContext = new AudioContextClass();
  }

  if (state.audioContext.state === "suspended") {
    try {
      await state.audioContext.resume();
    } catch {
      return;
    }
  }
}

async function speak(message) {
  if (!("speechSynthesis" in window) || !message) {
    updateStatus("Speech output is not supported on this browser.");
    return;
  }

  await primeAudioSystems();
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = Number(dom.speechRate.value || 1);
  utterance.lang = "en-US";
  const voice = chooseVoice();
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onerror = () => {
    updateStatus("Speech failed in this browser session. Tap Start Guidance again to unlock audio.");
  };

  window.speechSynthesis.resume();
  window.speechSynthesis.speak(utterance);
}

function chooseVoice() {
  if (!state.voices.length) {
    return null;
  }

  return (
    state.voices.find((voice) => voice.lang === "en-US") ||
    state.voices.find((voice) => voice.lang.startsWith("en")) ||
    state.voices[0]
  );
}

function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function updateStatus(message) {
  dom.statusLine.textContent = message;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
