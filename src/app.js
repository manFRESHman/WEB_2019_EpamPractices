import './assets/scss/app.scss';
import {Route} from './route';
import {Router, socket} from './router';
import $ from 'jquery';

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

socket.on('user', function (usercount) {
    $('.usercount').text(usercount)
});

socket.on('playStarSound', () => {
    var sound = document.getElementById("audio");
    sound.play();
})