'use strict';

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
                    var arr = document.getElementsByTagName('script');
                    for (var n = 0; n < arr.length; n++)
                        eval(arr[n].innerHTML)
                }
            };
            xhttp.open('GET', url, true);
            xhttp.send();
        })(this);
    }
};

export {Router};