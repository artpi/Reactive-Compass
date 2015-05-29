var navigationController,
    navigationMixin,
    keyMap,
    React = require("react");

keyMap = {
    13: "ENTER",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN"
};

navigationController = {
    navRoots: [],
    currentFocus: null,
    focus: function(focus) {
        if(this.currentFocus) {
            this.currentFocus.setState({focused: false});
        }

        this.currentFocus = focus;
        this.currentFocus.setState({focused: true});
    },
    navMove: function (dir, dirY) {
        var newEl = this.currentFocus.navGetMove(dir, dirY);
        if(newEl) {
            this.focus(newEl);
            console.log(newEl.getDOMNode());
        }
    },
    init: function() {
        document.addEventListener("keydown", this.handleKey.bind(this));
    },
    handleKey: function(event) {
        var keyCode = keyMap[event.keyCode];
        switch(keyCode) {
            case "ENTER":
                console.log("enter");
                break;
            case "LEFT":
                this.navMove(0,-1);
                break;
            case "UP":
                this.navMove(-1,0);
                break;
            case "RIGHT":
                this.navMove(0,1);
                break;
            case "DOWN":
                this.navMove(1,0);
                break;
        }

    }
};

navigationMixin = {
    navGetMove: function(dir, dirY) {
        var parentData,
            currentPos,
            newPos,
            handleNewFocusElement;

        if(!this.navData.parent) {
            return null;
        }

        parentData = this.navData.parent.navData;

        handleNewFocusElement = function(element) {
            if(element) {
                return element.navFindFocus(dir, dirY);
            } else if (typeof this.navOut === "function") {
                return this.navOut(dir, dirY);
            } else if(this.navData.parent) {
                return this.navData.parent.navGetMove(dir);
            }
        }.bind(this);

        function wrap(x, max) {
            if(x >= max) {
                return x % max;
            } else if(x < 0) {
                return x + (max - 1);
            } else {
                return x;
            }
        }


        if(this.navData.parent.props.navType === "grid") {
            currentPos = this.props.navGridPos.split(",");
            currentPos[0] = parseInt(currentPos[0], 10) + dir;
            currentPos[1] = parseInt(currentPos[1], 10) + dirY;
            newPos = currentPos.join(",");

            var newEls = parentData.children.filter(function(el) {
                return !!(el.props.navGridPos === newPos);
            });
            return handleNewFocusElement(newEls[0]);

        } else if((this.navData.parent.props.navType === "horizontal" && dir !== 0) ||
            (this.navData.parent.props.navType === "vertical" && dirY !== 0)) {

            return handleNewFocusElement(false);
        } else {
            currentPos = parentData.children.indexOf(this);
            if (this.navData.parent.props.navType === "horizontal") {
                currentPos += dirY;
            } else {
                currentPos += dir;
            }

            if(this.navData.parent.props.navWrap === 'wrap') {

            }

            return handleNewFocusElement(parentData.children[currentPos]);
        }
    },
    navFindFocus: function(dir, dirY) {
        var index = 0;
        if(this.navData.children.length < 1) {
            return this;
        } else if(dir === -1) {
            return this.navData.children[this.navData.children.length - 1].navFindFocus(dir);
        } else {
            return this.navData.children[0].navFindFocus(dir);
        }
    },
    navInit: function(children) {
        this.navData = {
            parent: null,
            children: []
        };

        if(this.props.navParent) {
            this.navData.parent = this.props.navParent();
            if(this.navData.parent.navData && this.navData.parent.navData.children.indexOf(this) === -1) {
                this.navData.parent.navData.children.push(this);
            }
        } else if (navigationController.navRoots.indexOf(this) === -1) {
            navigationController.navRoots.push(this);
        }

        if(children && children.length > 0) {
            return this.navEach(children);
        }
    },
    navSelf: function() {
        return this;
    },
    getInitialState: function() {
        return {hasFocus: false};
    },
    navEach: function(children) {
        var self = this;

        return children.map(function(item, i) {
            var el,
                params = {focused: false, navParent: self.navSelf};
            el = React.cloneElement(item, params);
            return el;
        });
    }

};


module.exports = {
    navigation: navigationController,
    listAble: navigationMixin,
    keyMap:  keyMap
};
