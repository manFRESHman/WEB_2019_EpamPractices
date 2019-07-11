import {socket} from './router';

function init(){
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);

        function changeRec(){
            const mic_container = document.querySelector('[class*="mic_container"]');
            if(mic_container.classList.contains("recoff")){
                mic_container.classList.remove("recoff");
                mic_container.classList.add("recon");
                mic_container.innerHTML = require("./views/mic_on.html");
                mediaRecorder.start();
            }
            else{
                mic_container.classList.remove("recon");
                mic_container.classList.add("recoff");
                mic_container.innerHTML = require("./views/mic_off.html");
                if (mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                }
            }
        };

        const mic = document.querySelector('[class*="mic_container"]');
        mic.addEventListener("click", changeRec);
        changeRec();
        let audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
            socket.emit('audioMessage', audioChunks);
        });
        mediaRecorder.addEventListener("stop", () => {
            audioChunks = [];
        });
    });
}

export {init};