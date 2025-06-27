const sections = ["vitals", "medications", "history", "lab", "appointments", "emergency"];
let currentSection = 0;
let isVoiceActive = false;
let isGestureActive = false;
let lastGestureTime = 0;
const gestureCooldown = 0;

const statusEl = document.getElementById("status");
const voiceBtn = document.getElementById("voiceToggle");
const gestureBtn = document.getElementById("gestureToggle");
const gestureIndicator = document.getElementById("gestureIndicator");
const voiceIndicator = document.getElementById("voiceIndicator");
const navItems = document.querySelectorAll(".nav-item");
const video = document.getElementById("gestureCam");