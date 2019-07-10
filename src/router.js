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
    if(htmlName === 'mic.html'){
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            const mediaRecorder2 = new MediaRecorder(stream);
            
            var recurStart = function(){
                var mic_container = document.querySelector('[class*="mic_container"]');
                if(mic_container.classList.contains("recon")){
                    mediaRecorder.stop();
                    mediaRecorder.start();
                    setTimeout(function(){
                        mediaRecorder2.stop();
                        mediaRecorder2.start();
                    }, 1500)
                    setTimeout(recurStart, 3000);
                }
            }

            var changeRec = function(){
                var mic_container = document.querySelector('[class*="mic_container"]');
                if(mic_container.classList.contains("recoff")){
                    console.log("changeRec to recon");
                    mic_container.classList.remove("recoff");
                    mic_container.classList.add("recon");
                    mic_container.innerHTML = require("./views/mic_on.html");
                    mediaRecorder.start();
                    mediaRecorder2.start();
                    recurStart();
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

            var mic = document.querySelector('[class*="mic_container"]');
            mic.addEventListener("click", changeRec);
            changeRec();
            var audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
                socket.emit('audioMessage', audioChunks);
            });
            mediaRecorder.addEventListener("stop", () => {
                audioChunks = [];
            });
        });
    }
    if(htmlName === 'stream.html'){
        var changePlay = function(){
            var speaker_container = document.querySelector('[class*="speaker_container"]');
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
    if(htmlName === 'playlist.html'){
        var url = 'http://voicy-speaker.herokuapp.com/voices',
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);
                var playlist_container = document.querySelector('[class*="playlist_container"]');
                playlist_container.innerHTML = "";
                for(var i = 0; i < response.length; i++){
                    var track = document.createElement('div');
                    track.className = "track";
                    if(response[i].audioBlob[0] !== undefined && response[i].audioBlob[0].data.length != 0){
                        var audio = document.createElement('audio');
                        var blob = new Blob([new Uint8Array(response[i].audioBlob[0].data).buffer]);
                        var url = URL.createObjectURL(blob);
                        audio.src = url;
                        audio.controls = "controls";
                        var audioDiv = document.createElement('div');
                        audioDiv.className = "audioDiv";
                        audioDiv.appendChild(audio);

                        var date = new Date(response[i].timeStamp);
                        var dateDiv = document.createElement('div');
                        dateDiv.className = "time";
                        dateDiv.innerText = "" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                    
                        var div = document.createElement('div');
                        track.appendChild(div);
                        div.appendChild(audioDiv);
                        div.appendChild(dateDiv);
                        playlist_container.appendChild(track);
                    }
                }
                var playlist_footer = document.createElement("div");
                playlist_footer.id = 'playlist_footer';
                playlist_container.appendChild(playlist_footer);
            }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    }
}

export {Router, socket};