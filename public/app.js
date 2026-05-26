const dom = {
  camera: document.getElementById("camera"),
  cameraState: document.getElementById("cameraState"),
  startCamera: document.getElementById("startCamera"),
  stopCamera: document.getElementById("stopCamera"),
  analyzeNow: document.getElementById("analyzeNow"),
  imageUpload: document.getElementById("imageUpload"),
  captureCanvas: document.getElementById("captureCanvas"),
  snapshot: document.getElementById("snapshot"),
  autoScan: document.getElementById("autoScan"),
  autoSpeak: document.getElementById("autoSpeak"),
  speechRate: document.getElementById("speechRate"),
  summaryText: document.getElementById("summaryText"),
  hazardsList: document.getElementById("hazardsList"),
  guidanceList: document.getElementById("guidanceList"),
  itemsList: document.getElementById("itemsList"),
  statusLine: document.getElementById("statusLine"),
  analysisState: document.getElementById("analysisState"),
  modeBadge: document.getElementById("modeBadge"),
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
  autoTimer: null,
  analyzing: false,
  lastImage: "",
  lastSpokenMessage: ""
};

const modeCards = [...document.querySelectorAll(".mode-card")];

bindEvents();
checkHealth();

function bindEvents() {
  dom.startCamera.addEventListener("click", startCamera);
  dom.stopCamera.addEventListener("click", stopCamera);
  dom.analyzeNow.addEventListener("click", () => analyzeCurrentView());
  dom.speakAgain.addEventListener("click", () => {
    if (state.lastSpokenMessage) {
      speak(state.lastSpokenMessage);
    }
  });
  dom.stopSpeaking.addEventListener("click", stopSpeaking);
  dom.autoScan.addEventListener("change", syncAutoScan);
  dom.imageUpload.addEventListener("change", handleUpload);

  for (const card of modeCards) {
    card.addEventListener("click", () => selectMode(card.dataset.mode));
  }
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    if (!data.hasApiKey) {
      updateStatus("Add OPENAI_API_KEY in .env before image analysis will work.");
    }
  } catch {
    updateStatus("Server not reachable yet.");
  }
}

async function startCamera() {
  if (state.stream) {
    return;
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
    updateStatus("Camera is live. Point it ahead, then analyze.");
    syncAutoScan();
  } catch (error) {
    updateStatus("Camera access failed. Allow permission or use a photo upload.");
    console.error(error);
  }
}

function stopCamera() {
  if (state.stream) {
    for (const track of state.stream.getTracks()) {
      track.stop();
    }
  }

  state.stream = null;
  dom.camera.srcObject = null;
  dom.cameraState.textContent = "Camera off";
  clearAutoScan();
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

function syncAutoScan() {
  clearAutoScan();

  if (!dom.autoScan.checked) {
    return;
  }

  state.autoTimer = window.setInterval(() => {
    if (state.analyzing) {
      return;
    }
    analyzeCurrentView({ silentOnEmpty: true });
  }, 8000);
}

function clearAutoScan() {
  if (state.autoTimer) {
    window.clearInterval(state.autoTimer);
    state.autoTimer = null;
  }
}

async function handleUpload(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

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

    renderAnalysis(data.analysis);
    dom.analysisState.textContent = `Ready - ${data.analysis.confidence}`;
    updateStatus("Analysis complete.");
  } catch (error) {
    dom.analysisState.textContent = "Error";
    updateStatus(error.message || "Analysis failed.");
    console.error(error);
  } finally {
    state.analyzing = false;
    dom.analyzeNow.disabled = false;
  }
}

function renderAnalysis(analysis) {
  dom.summaryText.textContent = analysis.summary;
  renderList(dom.hazardsList, analysis.hazards, "No immediate hazards reported.");
  renderList(dom.guidanceList, analysis.guidance, "No guidance available.");
  renderList(dom.itemsList, analysis.detected_items, "No items detected.");

  state.lastSpokenMessage = analysis.spoken_message || analysis.summary;
  if (dom.autoSpeak.checked && state.lastSpokenMessage) {
    speak(state.lastSpokenMessage);
  }
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

function speak(message) {
  if (!("speechSynthesis" in window) || !message) {
    return;
  }

  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = Number(dom.speechRate.value || 1);
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function updateStatus(message) {
  dom.statusLine.textContent = message;
}
