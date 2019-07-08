import './assets/scss/app.scss';
import {Route} from './route';
import {Router} from './router';

(function () {
    function init() {
        var router = new Router([
            new Route('playlist', 'playlist.html'),
            new Route('mic', 'mic.html', true),
            new Route('stream', 'stream.html'),
        ]);
    }
    init();
}());

// var changeRec = function(){
//     var mic_container = document.getElementByClassName('mic_container');
//     if(mic_container.classList.contains("recoff")){
//         console.log("changeRec to recon");
//         mic_container.classList.remove("recoff");
//         mic_container.classList.add("recon");
//         mic_container.innerHTML = require("./views/mic_on.html");
//     }
//     else{
//         console.log("changeRec to recoff");
//         mic_container.classList.remove("recon");
//         mic_container.classList.add("recoff");
//         mic_container.innerHTML = require("./views/mic_off.html");
//     }
// };

// var changePlay = function(){
//     var speaker_container = document.getElementByClassName('speaker_container');
//     if(speaker_container.classList.contains("playoff")){
//         console.log("changePlay to recon");
//         speaker_container.classList.remove("playoff");
//         speaker_container.classList.add("playon");
//         speaker_container.innerHTML = require("./views/speaker_on.html");
//     }
//     else{
//         console.log("changePlay to recoff");
//         speaker_container.classList.remove("playon");
//         speaker_container.classList.add("playoff");
//         speaker_container.innerHTML = require("./views/speaker_off.html");
//     }
// };

// window.onload = function(){
//     window.addEventListener('hashchange', function(e){
//         var hsh = window.location.hash.slice(1);
//         this.console.log("new listener added...");
//         if(hsh === 'mic'){
//             this.console.log("... on mic");
//             var mic = document.getElementsByClassName('mic_container');
//             this.console.log(mic);
//             this.console.log(mic.length);
//             this.console.log(mic[0]);
//             this.console.log(mic);
//             mic[0].addEventListener("click", changeRec);
//             changeRec();
//         }
//         if(hsh === 'stream'){
//             this.console.log("... on stream");
//             var speaker = document.getElementsByClassName('speaker_container');
//             this.console.log(speaker);
//             this.console.log(speaker.length);
//             this.console.log(speaker[0]);
//             this.console.log(speaker);
//             speaker[0].addEventListener("click", changePlay);
//             changePlay();
//         }
//     });
// };