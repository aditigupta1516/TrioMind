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
const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition= new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults=false;
recognition.lang='en-US';
//VOICE COMMAND PROCESSOR
recognition.onresult= (event) =>{
    const command = event.results[event.results.length-1][0].transcript.trim().toLowerCase();
    voiceIndicator.textContent= `Heard: ${command}`;
    //COMMAND ROUTING
    if(command.includes("next")||command.includes("right")){
    navigate(1);
    }else if(command.includes("previous")||command.includes("back")||command.includes("left")){
    navigate(-1);
    }else if(command.includes("vitals")){
    jumpToSection("vitals");
    }else if(command.includes("medications")){
    jumpToSection("medications");
    }else if(command.includes("history")){
    jumpToSection("history");
    }else if(command.includes("lab")){
    jumpToSection("lab");
    }else if(command.includes("appointments")){ 
    jumpToSection("appointments");
    }else if(command.includes("emergency")){
    jumpToSection("emergency");
    }else if(command.includes("enable voice")){
    startVoiceControl();
    }else if(command.includes("disable voice")){
    stopVoiceControl();
    }
};
//VOICE CONTROL TOGGLE
voiceBtn.addEventListner("click",toogleVoiceControl);





function isOpenCvReady(){
    console.log('OpenCV.js is ready!');
    isOpenCvReady = true;
    motionCanvas.width = 320;
    motionCanvas.height = 240;
}
function processVideo(){
    if(!isGestureActive || !isOpenCvReady) return;
    try{
        ctx.drawImage(video, 0, 0, motionCanvas.width, motionCanvas.height);
        const currentFrame = cv.imread(motionCanvas);
        const gray = new cv.Mat();
        cv.cvtColor(currentFrame, gray, cv.COLOR_RGBA2GRAY);
        if(prevFrame){
            const diff = new cv.Mat();
            cv.absdiff(gray, prevFrame, diff);
            const thresh = new cv.Mat();
            cv.threshold(diff, thresh, 25, 255, cv.THRESH_BINARY);
            const contours = new cv.MatVector();
            const hierarchy = new cv.Mat();
            cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            let maxArea = 0;
            let maxContour = null;
            for (let i = 0; i < contours.size(); i++){
                const contour = contours.get(i);
                const area = cv.contoursArea(contour);
                if (area > maxArea){
                    maxArea = area;
                    maxContour = contour;
                }
            }
            //Significant Motion is detected
            if (maxArea>500){
                const now = Date.now();
                if(now - lastGestureTime > gestureCooldown){
                    const moments = cv.moments(maxContour);
                    const cx = moments.m10 / moments.m00;
                    const cy = moments.m01 / moments.m00;

                    if(prevCentroid){
                        const dx = cx - prevCentroid.x;
                        const dy = cy - prevCentroid.y;
                        if(Math.abs(dx)>Math.abs(dy)){
                            if(dx>10){
                                showGestureFeedback("👉 Swipe Right (Next)");
                                navigate(1);
                            }
                            else if(dx <-10){
                                showGestureFeedback("👈 Swipe Left (Previous)");
                                navigate(-1);
                            } else {
                                if(dy < -10){
                                    showGestureFeedback("Emergency Activated!");
                                    jumpToSection("emergency");
                                    triggerEmergency();
                                }
                            }
                        }
                        prevCentroid = {x : cx, y : cy};
                    }
                }
                diff.delete();
                thresh.delete();
                contours.delete();
                hierarchy.delete();
            }
            prevFrame = gray.clone();
            currentFrame.delete();
            gray.delete();
        } catch(err){
            console.error('Error processing frame: ', err);
        }
        requestAnimationFrame(processVideo);
    }
    function slowGestureFeedback(text){
        gestureIndicator.textContent = text;
        lastGestureTime = Date.now();
    }
}