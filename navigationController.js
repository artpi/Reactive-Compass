var keyMap = require('./pcKeyMap.js');
module.exports = {
    keyMap: keyMap,
    navRoots: [],
    currentFocus: null,
    focus: function(focus) {
        if (this.currentFocus) {
            this.currentFocus.setState({focused: false});
        }

        this.currentFocus = focus;
        this.currentFocus.setState({focused: true});
    },
    navMove: function (dir, dirY) {
        var newEl;
        if (this.currentFocus.navGetMove) {
            newEl = this.currentFocus.navGetMove(dir, dirY);
            if (newEl) {
                this.focus(newEl);
            }
        }
    },
    init: function(element) {
        element.addEventListener('keydown', this.handleKey.bind(this));
    },
    handleKey: function(event) {
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
