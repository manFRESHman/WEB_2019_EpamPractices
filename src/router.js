'use strict';

import io from 'socket.io-client';
var socket = io("https://voicy-speaker.herokuapp.com");

function Router(routes) {
    try {
        if (!routes) {
            throw 'error: routes param is mandatory';
        }
        this.constructor(routes);
        this.init();
    } catch (e) {
        console.error(e);   
    }
}

Router.prototype = {
    routes: undefined,
    rootElem: undefined,
    constructor: function (routes) {
        this.routes = routes;
        this.rootElem = document.getElementById('app');
    },
    init: function () {
        var r = this.routes;
        (function(scope, r) { 
            window.addEventListener('hashchange', function (e) {
                scope.hasChanged(scope, r);
            });
        })(this, r);
        this.hasChanged(this, r);
    },
    hasChanged: function(scope, r){
        if (window.location.hash.length > 0) {
            for (var i = 0, length = r.length; i < length; i++) {
                var route = r[i];
                let hsh = window.location.hash.substr(1);
                if(route.isActiveRoute(hsh)) {
                    scope.goToRoute(route.htmlName);
                    let icons = document.querySelectorAll('[class*=icon]');
                    for(var j = 0; j < icons.length; j++){
                        icons[j].classList.remove("current");
                        if(icons[j].classList.contains(hsh)){
                            icons[j].classList.add("current");
                        }
                    }
                }
            }
        } else {
            for (var i = 0, length = r.length; i < length; i++) {
                var route = r[i];
                if(route.default) {
                    scope.goToRoute(route.htmlName);
                }
            }
        }
    },
    goToRoute: function (htmlName) {
        (function(scope) { 
            var url = 'views/' + htmlName,
                xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    scope.rootElem.innerHTML = this.responseText;
                    addListeners(htmlName);
                }
            };
            xhttp.open('GET', url, true);
            xhttp.send();
        })(this);
    }
};

function addListeners(htmlName){
    var changePlay = function(){
        var speaker_container = document.querySelector('[class*="speaker_container"]');
        if(speaker_container.classList.contains("playoff")){
            console.log("changePlay to recon");
            speaker_container.classList.remove("playoff");
            speaker_container.classList.add("playon");
            speaker_container.innerHTML = require("./views/speaker_on.html");
        }
        else{
            console.log("changePlay to recoff");
            speaker_container.classList.remove("playon");
            speaker_container.classList.add("playoff");
            speaker_container.innerHTML = require("./views/speaker_off.html");
        }
    };

    if(htmlName === 'mic.html'){

        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);

            var changeRec = function(){
                var mic_container = document.querySelector('[class*="mic_container"]');
                if(mic_container.classList.contains("recoff")){
                    console.log("changeRec to recon");
                    mic_container.classList.remove("recoff");
                    mic_container.classList.add("recon");
                    mic_container.innerHTML = require("./views/mic_on.html");
                    mediaRecorder.start();
                }
                else{
                    console.log("changeRec to recoff");
                    mic_container.classList.remove("recon");
                    mic_container.classList.add("recoff");
                    mic_container.innerHTML = require("./views/mic_off.html");
                    if (mediaRecorder.state !== 'inactive') {
                        mediaRecorder.stop();
                    }
                }
            };

            console.log("... on mic");
            var mic = document.querySelector('[class*="mic_container"]');
            console.log(mic);
            mic.addEventListener("click", changeRec);
            changeRec();
            var audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);

            });
            mediaRecorder.addEventListener("stop", () => {
                //socket.broadcast.emit('audioMessage', audioChunks);
                socket.emit('audioMessage', audioChunks);
                audioChunks = [];
            });
        });

    }
    if(htmlName === 'stream.html'){
        console.log("... on stream");
        var speaker = document.querySelector('[class*="speaker_container"]');
        console.log(speaker);
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
}

export {Router, socket};