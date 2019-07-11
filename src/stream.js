import {socket} from './router';

function init(){
    function changePlay(){
        let speaker_container = document.querySelector('[class*="speaker_container"]');
        if(speaker_container.classList.contains("playoff")){
            speaker_container.classList.remove("playoff");
            speaker_container.classList.add("playon");
            speaker_container.innerHTML = require("./views/speaker_on.html");
        }
        else{
            speaker_container.classList.remove("playon");
            speaker_container.classList.add("playoff");
            speaker_container.innerHTML = require("./views/speaker_off.html");
        }
    };

    changePlay();
    socket.on('audioMessage', function (audioChunks) {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        changePlay();
        audio.play();
        audio.onended = changePlay;
    });
}

export {init};