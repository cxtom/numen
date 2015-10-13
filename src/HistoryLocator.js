/**
 * @file HistoryLocator
 * @author leon(ludafa@outlook.com)
 */

import Locator from './Locator';
import Location from './Location';

import {
    addEventListener,
    removeEventListener,
    guid
} from './util';

import {
    PUSH,
    REPLACE,
    TRAVEL
} from './action';

class HistoryLocator extends Locator {

    start() {
        super.start();
        addEventListener(window, 'popstate', this.onLocationChange);
        return this;
    }

    stop() {
        removeEventListener(window, 'popstate', this.onLocationChange);
        return this;
    }

    getLocation() {

        let loc = window.location;

        let {pathname, search, hash} = loc;
        let path = pathname + search + hash;

        return new Location(
            path,
            TRAVEL,
            guid(),
            ''
        );

    }

    /**
     * 更新URL
     *
     * 子类方法会更新浏览器地址栏中的地址
     *
     * @param {module:Location} nextLocation 下一个地址
     */
    finishTransit(nextLocation) {

        let {action, title} = nextLocation;

        switch (action) {
            case PUSH:
                window.history.pushState(null, title, nextLocation.toString());
                break;
            case REPLACE:
                window.history.replaceState(null, title, nextLocation.toString());
                break;
        }

        super.finishTransit(nextLocation);

    }

    createHref(nextLocation) {
        return nextLocation ? nextLocation.toString() : 'javascript: void 0';
    }

    dispose() {
        this.stop();
        this.listeners.length = 0;
    }

}

export default HistoryLocator;
