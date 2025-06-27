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
const emergencyCancelBtn = document.querySelector(".emergency-cancel");
const emergencyBtn = document.getElementById("emergencyBtn");
const motionCanvas = document.getElementById("motionCanvas");
const ctx = motionCanvas.getContext('2d');

let prevFrame = null;
let prevCentroid = null;
let stream = null;
let isOpenCvReady = false;








function isOpenCvReady(){
    console.log('OpenCV.js is ready!');
    isOpenCvReady = true;
    motionCanvas.width = 320;
    motionCanvas.height = 240;
}