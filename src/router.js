'use strict';

import io from 'socket.io-client';

const socket = io("https://voicy-speaker.herokuapp.com");

import * as playlist from './playlist';
import * as mic from './mic';
import * as stream from './stream';

window.playlist = playlist;
window.mic = mic;
window.stream = stream;

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
            for (let i = 0, length = r.length; i < length; i++) {
                let route = r[i];
                let hsh = window.location.hash.substr(1);
                if(route.isActiveRoute(hsh)) {
                    scope.goToRoute(route.htmlName);
                    let icons = document.querySelectorAll('[class*=icon]');
                    for(let j = 0; j < icons.length; j++){
                        icons[j].classList.remove("current");
                        if(icons[j].classList.contains(hsh)){
                            icons[j].classList.add("current");
                        }
                    }
                }
            }
        } else {
            for (let i = 0, length = r.length; i < length; i++) {
                const route = r[i];
                if(route.default) {
                    scope.goToRoute(route.htmlName);
                }
            }
        }
    },
    goToRoute: function (htmlName) {
        (function(scope) { 
            fetch('views/' + htmlName)
            .then(resp => resp.text())
            .then(text => {
                    scope.rootElem.innerHTML = text;
                    window[htmlName.slice(0, htmlName.indexOf('.'))].init();
                }
            )       
        })(this);
    }
};

export {Router, socket};