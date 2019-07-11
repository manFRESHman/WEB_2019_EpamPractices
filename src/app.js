import './assets/scss/app.scss';
import {Route} from './route';
import {Router} from './router';

(function () {
    function init() {
        new Router([
            new Route('playlist', 'playlist.html'),
            new Route('mic', 'mic.html', true),
            new Route('stream', 'stream.html'),
        ]);
    }
    init();
}());