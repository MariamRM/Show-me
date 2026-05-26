const dom = {
  languageSelect: document.getElementById("languageSelect"),
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
  stopSpeaking: document.getElementById("stopSpeaking"),
  cameraTitle: document.getElementById("camera-title"),
  modeTitle: document.getElementById("mode-title"),
  resultsTitle: document.getElementById("results-title")
};

const translations = {
  en: {
    lang: "en",
    dir: "ltr",
    voiceLang: "en-US",
    modeLabels: {
      navigation: "Path Guide",
      surroundings: "Surroundings",
      grocery: "Grocery Helper"
    },
    sideLabels: { left: "left", center: "center", right: "right" },
    distanceLabels: { near: "near", mid: "mid", far: "far" },
    urgencyLabels: { high: "high", medium: "medium", low: "low" },
    ui: {
      heroEyebrow: "Show Me Guide",
      languageLabel: "Language",
      heroTitle: "Continuous camera guidance for blind and low-vision users.",
      heroCopy:
        "Start a guidance session to scan repeatedly, speak the route, vibrate on hazards, and play directional warning tones for walls, stairs, and floor changes.",
      heroNote:
        "Browser version: phone volume buttons cannot be captured by a normal web page. This build supports touch, keyboard, and some headset play-pause controls.",
      cameraTitle: "Live Camera",
      cameraOn: "Camera on",
      cameraOff: "Camera off",
      cameraOverlayText: "Point the camera ahead or at the product you want",
      startCamera: "Start Camera",
      stopCamera: "Stop Camera",
      startGuidance: "Start Guidance",
      stopGuidance: "Stop Guidance",
      analyzeNow: "Analyze Once",
      repeatVoice: "Repeat Voice",
      stopVoice: "Stop Voice",
      uploadLabel: "Or choose a photo",
      modeTitle: "Guidance Settings",
      modeNavigationName: "Path Guide",
      modeNavigationCopy: "Route, walls, steps, floor edges, and obstacles first.",
      modeSurroundingsName: "Surroundings",
      modeSurroundingsCopy: "Nearby objects, people, doors, seating, counters, and signs.",
      modeGroceryName: "Grocery Helper",
      modeGroceryCopy: "Product reading, shelf context, and item comparison.",
      autoSpeakLabel: "Speak results automatically",
      hapticAlertsLabel: "Vibrate for hazards",
      spatialAudioLabel: "Play left-right guidance tones",
      shortcutControlLabel: "Shortcut control",
      shortcutTouch: "Touch only",
      shortcutKeyboard: "Keyboard Space or Enter",
      shortcutHeadset: "Headset play-pause if supported",
      speechRateLabel: "Speech rate",
      cueVolumeLabel: "Cue volume",
      resultsTitle: "Live Guidance",
      summaryHeading: "Summary",
      directionHeading: "Recommended Direction",
      hazardsHeading: "Hazards",
      guidanceHeading: "Next Guidance",
      mobilityHeading: "Mobility Cues",
      itemsHeading: "Detected Items",
      idle: "Idle",
      analyzing: "Analyzing",
      guidanceOn: "Guidance on",
      statusInitial: "Start the camera, then start a guidance session.",
      statusHealthMissing: "Set OPENAI_API_KEY before analysis can work.",
      statusServerUnreachable: "Server not reachable yet.",
      statusCameraLive: "Camera is live. You can start a guidance session now.",
      statusCameraFailed: "Camera access failed. Allow permission or use a photo upload.",
      statusCameraStopped: "Camera stopped.",
      statusModeSelected: "{mode} selected.",
      statusGuidanceStarted: "Guidance session started. Scanning every 4 seconds.",
      statusGuidanceStopped: "Guidance session stopped.",
      statusPhotoLoaded: "Photo loaded. Sending it for analysis.",
      statusNeedInput: "Start the camera or upload a photo first.",
      statusAnalyzing: "Analyzing {mode}...",
      statusAnalysisComplete: "Analysis complete.",
      statusSpeechUnsupported: "Speech output is not supported on this browser.",
      statusSpeechFailed: "Speech failed in this browser session. Tap Start Guidance again to unlock audio.",
      shortcutHintTouch:
        "Touch mode: use the large Start Guidance button. Phone volume buttons cannot be read by a normal web page.",
      shortcutHintKeyboard:
        "Keyboard mode: press Space or Enter to start or stop the guidance session.",
      shortcutHintHeadset:
        "Headset mode: some browsers support the headset play-pause button. Phone volume buttons still require a native app.",
      placeholderSummary: "No analysis yet.",
      placeholderDirection: "Waiting for a route.",
      placeholderHazards: "No immediate hazards reported.",
      placeholderGuidance: "No guidance available.",
      placeholderMobility: "No directional cues yet.",
      placeholderItems: "No items detected.",
      directionLeft: "Move slightly left if clear.",
      directionCenter: "Continue forward through the center.",
      directionRight: "Move slightly right if clear.",
      directionStop: "Stop and reassess before moving."
    }
  },
  ar: {
    lang: "ar",
    dir: "rtl",
    voiceLang: "ar-SA",
    modeLabels: {
      navigation: "إرشاد الطريق",
      surroundings: "المحيط",
      grocery: "مساعد التسوق"
    },
    sideLabels: { left: "يسار", center: "الوسط", right: "يمين" },
    distanceLabels: { near: "قريب", mid: "متوسط", far: "بعيد" },
    urgencyLabels: { high: "عالي", medium: "متوسط", low: "منخفض" },
    ui: {
      heroEyebrow: "شوفني",
      languageLabel: "اللغة",
      heroTitle: "إرشاد مستمر بالكاميرا للمكفوفين وضعاف البصر.",
      heroCopy:
        "ابدأ جلسة إرشاد ليتم الفحص بشكل متكرر مع نطق الطريق والاهتزاز عند المخاطر وتشغيل نغمات اتجاهية للجدران والدرج وتغيرات الأرضية.",
      heroNote:
        "نسخة المتصفح: لا يمكن لصفحة ويب عادية التقاط أزرار الصوت في الهاتف. هذه النسخة تدعم اللمس ولوحة المفاتيح وبعض أزرار سماعات الرأس.",
      cameraTitle: "الكاميرا المباشرة",
      cameraOn: "الكاميرا تعمل",
      cameraOff: "الكاميرا متوقفة",
      cameraOverlayText: "وجّه الكاميرا إلى الأمام أو إلى المنتج الذي تريده",
      startCamera: "تشغيل الكاميرا",
      stopCamera: "إيقاف الكاميرا",
      startGuidance: "بدء الإرشاد",
      stopGuidance: "إيقاف الإرشاد",
      analyzeNow: "تحليل مرة واحدة",
      repeatVoice: "إعادة الصوت",
      stopVoice: "إيقاف الصوت",
      uploadLabel: "أو اختر صورة",
      modeTitle: "إعدادات الإرشاد",
      modeNavigationName: "إرشاد الطريق",
      modeNavigationCopy: "الطريق والجدران والدرج وحواف الأرضية والعوائق أولاً.",
      modeSurroundingsName: "المحيط",
      modeSurroundingsCopy: "الأشياء القريبة والأشخاص والأبواب والمقاعد والكاونترات واللافتات.",
      modeGroceryName: "مساعد التسوق",
      modeGroceryCopy: "قراءة المنتجات وسياق الرف ومقارنة العناصر.",
      autoSpeakLabel: "نطق النتائج تلقائياً",
      hapticAlertsLabel: "اهتزاز عند المخاطر",
      spatialAudioLabel: "تشغيل نغمات إرشاد يمين ويسار",
      shortcutControlLabel: "طريقة الاختصار",
      shortcutTouch: "اللمس فقط",
      shortcutKeyboard: "المسافة أو إدخال من لوحة المفاتيح",
      shortcutHeadset: "زر تشغيل السماعة إذا كان مدعوماً",
      speechRateLabel: "سرعة النطق",
      cueVolumeLabel: "مستوى نغمات التنبيه",
      resultsTitle: "الإرشاد المباشر",
      summaryHeading: "الملخص",
      directionHeading: "الاتجاه المقترح",
      hazardsHeading: "المخاطر",
      guidanceHeading: "الخطوة التالية",
      mobilityHeading: "إشارات الحركة",
      itemsHeading: "العناصر المكتشفة",
      idle: "خامل",
      analyzing: "جارٍ التحليل",
      guidanceOn: "الإرشاد يعمل",
      statusInitial: "شغّل الكاميرا ثم ابدأ جلسة الإرشاد.",
      statusHealthMissing: "أضف OPENAI_API_KEY قبل أن يعمل التحليل.",
      statusServerUnreachable: "الخادم غير متاح حالياً.",
      statusCameraLive: "الكاميرا تعمل الآن. يمكنك بدء جلسة الإرشاد.",
      statusCameraFailed: "فشل الوصول إلى الكاميرا. اسمح بالإذن أو استخدم رفع صورة.",
      statusCameraStopped: "تم إيقاف الكاميرا.",
      statusModeSelected: "تم اختيار {mode}.",
      statusGuidanceStarted: "بدأت جلسة الإرشاد. سيتم الفحص كل 4 ثوان.",
      statusGuidanceStopped: "تم إيقاف جلسة الإرشاد.",
      statusPhotoLoaded: "تم تحميل الصورة. جارٍ إرسالها للتحليل.",
      statusNeedInput: "شغّل الكاميرا أو ارفع صورة أولاً.",
      statusAnalyzing: "جارٍ تحليل {mode}...",
      statusAnalysisComplete: "اكتمل التحليل.",
      statusSpeechUnsupported: "إخراج الصوت غير مدعوم في هذا المتصفح.",
      statusSpeechFailed: "فشل الصوت في هذه الجلسة. اضغط بدء الإرشاد مرة أخرى لفتح الصوت.",
      shortcutHintTouch:
        "وضع اللمس: استخدم زر بدء الإرشاد الكبير. لا يمكن لصفحة ويب عادية قراءة أزرار الصوت في الهاتف.",
      shortcutHintKeyboard:
        "وضع لوحة المفاتيح: اضغط المسافة أو إدخال لبدء جلسة الإرشاد أو إيقافها.",
      shortcutHintHeadset:
        "وضع السماعة: بعض المتصفحات تدعم زر تشغيل السماعة. أزرار الصوت في الهاتف ما زالت تحتاج تطبيقاً أصلياً.",
      placeholderSummary: "لا يوجد تحليل بعد.",
      placeholderDirection: "بانتظار تحديد الطريق.",
      placeholderHazards: "لا توجد مخاطر فورية حتى الآن.",
      placeholderGuidance: "لا توجد تعليمات حالياً.",
      placeholderMobility: "لا توجد إشارات اتجاهية حتى الآن.",
      placeholderItems: "لا توجد عناصر مكتشفة.",
      directionLeft: "تحرك قليلاً إلى اليسار إذا كان الطريق آمناً.",
      directionCenter: "تابع التقدم عبر المنتصف.",
      directionRight: "تحرك قليلاً إلى اليمين إذا كان الطريق آمناً.",
      directionStop: "توقف وأعد التقييم قبل الحركة."
    }
  }
};

const state = {
  language: "en",
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
applyLanguage();
renderEmptyState();

function bindEvents() {
  document.addEventListener("pointerdown", handleUserGesture, { passive: true });
  document.addEventListener("keydown", handleKeyboardShortcut);
  dom.languageSelect.addEventListener("change", handleLanguageChange);

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
      updateStatus(t("statusHealthMissing"));
    }
  } catch {
    updateStatus(t("statusServerUnreachable"));
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
    dom.cameraState.textContent = t("cameraOn");
    updateStatus(t("statusCameraLive"));
    return true;
  } catch (error) {
    updateStatus(t("statusCameraFailed"));
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
  dom.cameraState.textContent = t("cameraOff");
  updateStatus(t("statusCameraStopped"));
}

function selectMode(mode) {
  state.mode = mode;
  dom.modeBadge.textContent = modeLabel(mode);

  for (const card of modeCards) {
    const active = card.dataset.mode === mode;
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-selected", String(active));
  }

  updateStatus(formatText(t("statusModeSelected"), { mode: modeLabel(mode) }));
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
  dom.guidanceToggle.textContent = t("stopGuidance");
  dom.guidanceToggle.classList.remove("button-accent");
  dom.guidanceToggle.classList.add("button-primary");
  dom.analysisState.textContent = t("guidanceOn");
  updateStatus(t("statusGuidanceStarted"));

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
    updateStatus(t("statusGuidanceStopped"));
  }

  state.guidanceActive = false;
  dom.guidanceToggle.textContent = t("startGuidance");
  dom.guidanceToggle.classList.remove("button-primary");
  dom.guidanceToggle.classList.add("button-accent");
  if (!state.analyzing) {
    dom.analysisState.textContent = t("idle");
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
      t("shortcutHintKeyboard");
    return;
  }

  if (mode === "headset") {
    dom.shortcutHint.textContent =
      t("shortcutHintHeadset");
    return;
  }

  dom.shortcutHint.textContent =
    t("shortcutHintTouch");
}

function handleLanguageChange() {
  state.language = dom.languageSelect.value === "ar" ? "ar" : "en";
  applyLanguage();
  if (!state.lastAnalysis) {
    renderEmptyState();
  } else {
    renderAnalysis(state.lastAnalysis);
  }
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
    updateStatus(t("statusPhotoLoaded"));
    await analyzeImage(dataUrl);
  };

  reader.readAsDataURL(file);
}

async function analyzeCurrentView(options = {}) {
  const image = captureFrame();
  if (!image) {
    if (!options.silentOnEmpty) {
      updateStatus(t("statusNeedInput"));
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
  dom.analysisState.textContent = t("analyzing");
  updateStatus(formatText(t("statusAnalyzing"), { mode: modeLabel(state.mode) }));

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mode: state.mode,
        language: state.language,
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
    updateStatus(t("statusAnalysisComplete"));
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
  renderList(dom.hazardsList, analysis.hazards, t("placeholderHazards"));
  renderList(dom.guidanceList, analysis.guidance, t("placeholderGuidance"));
  renderList(
    dom.mobilityList,
    (analysis.mobility_cues || []).map(formatMobilityCue),
    t("placeholderMobility")
  );
  renderList(dom.itemsList, analysis.detected_items, t("placeholderItems"));

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
    left: t("directionLeft"),
    center: t("directionCenter"),
    right: t("directionRight"),
    stop: t("directionStop")
  };

  return labels[direction] || t("placeholderDirection");
}

function formatMobilityCue(cue) {
  const kind = humanizeKind(cue.kind);
  const side = currentTranslation().sideLabels[cue.side] || cue.side;
  const distance = currentTranslation().distanceLabels[cue.distance] || cue.distance;
  const urgency = currentTranslation().urgencyLabels[cue.urgency] || cue.urgency;
  return state.language === "ar"
    ? `${kind} جهة ${side}، مسافة ${distance}، أولوية ${urgency}: ${cue.message}`
    : `${kind} ${side}, ${distance}, ${urgency} urgency: ${cue.message}`;
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
    updateStatus(t("statusSpeechUnsupported"));
    return;
  }

  await primeAudioSystems();
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = Number(dom.speechRate.value || 1);
  utterance.lang = currentTranslation().voiceLang;
  const voice = chooseVoice();
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onerror = () => {
    updateStatus(t("statusSpeechFailed"));
  };

  window.speechSynthesis.resume();
  window.speechSynthesis.speak(utterance);
}

function chooseVoice() {
  if (!state.voices.length) {
    return null;
  }

  return (
    state.voices.find((voice) => voice.lang === currentTranslation().voiceLang) ||
    state.voices.find((voice) => voice.lang.startsWith(currentTranslation().lang)) ||
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

function humanizeKind(value) {
  const humanized = value.replace(/_/g, " ");
  if (state.language === "ar") {
    const labels = {
      clear_path: "طريق واضح",
      wall: "جدار",
      obstacle: "عائق",
      step_up: "درجة صعود",
      step_down: "درجة نزول",
      curb: "رصيف",
      floor_change: "تغير في الأرضية",
      person: "شخص",
      door: "باب",
      shelf: "رف",
      counter: "كاونتر",
      unknown: "غير معروف"
    };
    return labels[value] || humanized;
  }
  return humanized.charAt(0).toUpperCase() + humanized.slice(1);
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function currentTranslation() {
  return translations[state.language];
}

function t(key) {
  return currentTranslation().ui[key];
}

function modeLabel(mode) {
  return currentTranslation().modeLabels[mode];
}

function formatText(text, values) {
  return text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function applyLanguage() {
  const translation = currentTranslation();
  document.documentElement.lang = translation.lang;
  document.documentElement.dir = translation.dir;
  document.body.classList.toggle("is-rtl", translation.dir === "rtl");
  dom.languageSelect.value = state.language;

  const directMap = {
    heroEyebrow: "heroEyebrow",
    languageLabel: "languageLabel",
    heroTitle: "heroTitle",
    heroCopy: "heroCopy",
    heroNote: "heroNote",
    cameraTitle: "cameraTitle",
    cameraOverlayText: "cameraOverlayText",
    startCamera: "startCamera",
    stopCamera: "stopCamera",
    guidanceToggle: state.guidanceActive ? "stopGuidance" : "startGuidance",
    analyzeNow: "analyzeNow",
    speakAgain: "repeatVoice",
    stopSpeaking: "stopVoice",
    uploadLabel: "uploadLabel",
    modeTitle: "modeTitle",
    modeNavigationName: "modeNavigationName",
    modeNavigationCopy: "modeNavigationCopy",
    modeSurroundingsName: "modeSurroundingsName",
    modeSurroundingsCopy: "modeSurroundingsCopy",
    modeGroceryName: "modeGroceryName",
    modeGroceryCopy: "modeGroceryCopy",
    autoSpeakLabel: "autoSpeakLabel",
    hapticAlertsLabel: "hapticAlertsLabel",
    spatialAudioLabel: "spatialAudioLabel",
    shortcutControlLabel: "shortcutControlLabel",
    speechRateLabel: "speechRateLabel",
    cueVolumeLabel: "cueVolumeLabel",
    resultsTitle: "resultsTitle",
    summaryHeading: "summaryHeading",
    directionHeading: "directionHeading",
    hazardsHeading: "hazardsHeading",
    guidanceHeading: "guidanceHeading",
    mobilityHeading: "mobilityHeading",
    itemsHeading: "itemsHeading"
  };

  for (const [id, key] of Object.entries(directMap)) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = t(key);
    }
  }

  dom.shortcutMode.options[0].textContent = t("shortcutTouch");
  dom.shortcutMode.options[1].textContent = t("shortcutKeyboard");
  dom.shortcutMode.options[2].textContent = t("shortcutHeadset");
  dom.modeBadge.textContent = modeLabel(state.mode);
  dom.cameraState.textContent = state.stream ? t("cameraOn") : t("cameraOff");
  if (!state.analyzing) {
    dom.analysisState.textContent = state.guidanceActive ? t("guidanceOn") : t("idle");
  }
  updateShortcutHint();
}

function renderEmptyState() {
  dom.summaryText.textContent = t("placeholderSummary");
  dom.directionText.textContent = t("placeholderDirection");
  renderList(dom.hazardsList, [], t("placeholderHazards"));
  renderList(dom.guidanceList, [], t("placeholderGuidance"));
  renderList(dom.mobilityList, [], t("placeholderMobility"));
  renderList(dom.itemsList, [], t("placeholderItems"));
  updateStatus(t("statusInitial"));
}
