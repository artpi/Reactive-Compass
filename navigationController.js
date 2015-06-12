var keyMap = require('./pcKeyMap.js');
module.exports = {
    /**
     * Map for keboard keys. We can override to accomodate different key sets (TV, etc)
     * @type {Object}
     */
    keyMap: keyMap,
    /**
     * Array of focusable trees of ReactNodes. Ideally should have 1 element, but we can create many focusable layers
     * @type {Array}
     */
    navRoots: [],
    /**
     * Currently focused react node
     * @type {ReactNode}
     * @private
     */
    currentFocus: null,
    /**
     * Focus on element
     * @param  {ReactNode} focus ReactNode to focus
     */
    focus: function (focus) {
        'use strict';
        if (this.currentFocus) {
            this.currentFocus.setState({focused: false});
        }

        this.currentFocus = focus;
        this.currentFocus.setState({focused: true});
    },
    /**
     * Move current focus
     * @param  {number} dir  Horizontal offset from current position
     * @param  {number} dirY Vertical offset from current position
     */
    navMove: function (dir, dirY) {
        'use strict';
        var newEl;
        if (this.currentFocus.navGetMove) {
            newEl = this.currentFocus.navGetMove(dir, dirY);
            if (newEl) {
                this.focus(newEl);
            }
        }
    },
    /**
     * Bind events and initialize
     * @param  {rootElement} element root element for capturing events. Should be document
     * @param  {number} rootToFocus id of root React element to find focus. should be 0.
     */
    init: function (element, rootToFocus) {
        'use strict';
        element.addEventListener('keydown', this.handleKey.bind(this));

        if (rootToFocus !== undefined) {
            //We will focus default root node.
            if (this.navRoots[rootToFocus]) {
                this.focus(this.navRoots[rootToFocus].navFindFocus(0, 0));
            }
        }
    },
    /**
     * Dispatcher for handling keyDown event. Should be bound to document.
     * @param  {browserEvent} event
     */
    handleKey: function (event) {
        'use strict';
        var keyCode = keyMap[event.keyCode];
        switch (keyCode) {
            case 'LEFT':
                this.navMove(0, -1);
                event.stopPropagation();
                break;
            case 'UP':
                this.navMove(-1, 0);
                event.stopPropagation();
                break;
            case 'RIGHT':
                this.navMove(0, 1);
                event.stopPropagation();
                break;
            case 'DOWN':
                this.navMove(1, 0);
                event.stopPropagation();
                break;
            default:
                if (this.currentFocus.navHandleKey) {
                    this.currentFocus.navHandleKey(keyCode, event);
                }
        }
    }
};
