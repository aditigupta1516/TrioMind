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


//voice control
const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition();
const Recognition= new SpeechRecognition();
Recognition.continuous = true;
Recognition.interimResults=false;
Recognition.lang='en-US';
Recognition.onresult= (event) =>{
    const command = event.result[event.result.length-1][0].transcript.trim(),toLowerCase();
    voiceIndicator.textContent= `Heard: ${command};
    if(command.includes("next")||command.includes("right")){
    navigate 1;
    }else-if(command.includes("previous")||command.includes("back")||command.includes("left")){
    navigate(-1);
    }else-if(command.includes("vitals")){
    jumpToSection("vitals");
    }else-if(command.includes("medications")){
    jumpToSection("medications");
    }else-if(command.includes("history")){
    jumpToSection("history");
    }else-if(command.includes("lab")){
    jumpToSection("lab");
    }else-if(command.includes("appointments")){
    jumpToSection("appointments");
    }else-if(command.includes("emergency")){
    jumpToSection("emergency");
    }else-if(command.includes("enable voice")){
    startVoiceControl();
    }else-if(command.includes("disable voice")){
    stopVoiceControl();
    }
};
voiceBtn.addEventListner("click",toogleVoiceControl);





function isOpenCvReady(){
    console.log('OpenCV.js is ready!');
    isOpenCvReady = true;
    motionCanvas.width = 320;
    motionCanvas.height = 240;
}