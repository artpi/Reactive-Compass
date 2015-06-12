var React = require('react'),
    navigationController = require('./navigationController.js');

module.exports = {
    navGetMove: function(dir, dirY) {
        var parentData,
            currentPos,
            newPos,
            newEls,
            handleNewFocusElement;

        if (!this.navData.parent) {
            return null;
        }

        parentData = this.navData.parent.navData;

        handleNewFocusElement = function(element) {
            if (element) {
                return element.navFindFocus(dir, dirY);
            } else if (typeof this.navOut === 'function') {
                return this.navOut(dir, dirY);
            } else if (this.navData.parent) {
                return this.navData.parent.navGetMove(dir);
            }
        }.bind(this);

        function wrap(x, max) {
            if (x >= max) {
                return x % max;
            } else if (x < 0) {
                return x + (max - 1);
            } else {
                return x;
            }
        }


        if (this.navData.parent.props.navType === 'grid') {
            currentPos = this.props.navGridPos.split(',');
            currentPos[0] = parseInt(currentPos[0], 10) + dir;
            currentPos[1] = parseInt(currentPos[1], 10) + dirY;

            if ((this.navData.parent.props.navWrap === 'wrapX' || this.navData.parent.props.navWrap === 'wrap') && parentData.gridRows[currentPos[0]]) {
                currentPos[1] = (currentPos[1] + parentData.gridRows[currentPos[0]]) % parentData.gridRows[currentPos[0]];
            }
            if ((this.navData.parent.props.navWrap === 'wrapY' || this.navData.parent.props.navWrap === 'wrap') && parentData.gridRows[currentPos[1]]) {
                currentPos[0] = (currentPos[0] + parentData.gridRows[currentPos[1]]) % parentData.gridRows[currentPos[1]];
            }

            newPos = currentPos.join(',');

            newEls = parentData.children.filter(function(el) {
                return !!(el.props.navGridPos === newPos);
            });

            return handleNewFocusElement(newEls[0]);

        } else if ((this.navData.parent.props.navType === 'horizontal' && dir !== 0) ||
            (this.navData.parent.props.navType === 'vertical' && dirY !== 0)) {

            return handleNewFocusElement(false);
        } else {
            currentPos = parentData.children.indexOf(this);
            if (this.navData.parent.props.navType === 'horizontal') {
                currentPos += dirY;
            } else {
                currentPos += dir;
            }

            if (this.navData.parent.props.navWrap === 'wrap') {
                currentPos = (currentPos + parentData.children.length) % parentData.children.length;
            }

            return handleNewFocusElement(parentData.children[currentPos]);
        }
    },
    navFindFocus: function(dir, dirY) {
        if (this.navData.children.length < 1) {
            return this;
        } else if (dir === -1) {
            return this.navData.children[this.navData.children.length - 1].navFindFocus(dir);
        } else {
            return this.navData.children[0].navFindFocus(dir);
        }
    },
    navInit: function(children) {
        this.navData = {
            parent: null,
            children: [],
            gridRows: [],
            gridCols: []
        };

        if (this.props.navParent) {
            this.navData.parent = this.props.navParent();
            if (this.navData.parent.navData && this.navData.parent.navData.children.indexOf(this) === -1) {
                this.navData.parent.navData.children.push(this);
            }
        } else if (navigationController.navRoots.indexOf(this) === -1) {
            navigationController.navRoots.push(this);
        }

        if (children && children.length > 0) {
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
        var self = this,
            cols = parseInt(self.props.navGridCols, 10);

        return children.map(function (item, i) {
            var el,
                col,
                row,
                params = {focused: false, navParent: self.navSelf};

            if (self.props.navType === 'grid' && cols) {
                col = i % self.props.navGridCols;
                row = (i - col) / cols;
                params.navGridPos = row + ',' + col;
                self.navData.gridRows[row] = self.navData.gridRows[row] ? self.navData.gridRows[row] + 1 : 1;
                self.navData.gridCols[col] = self.navData.gridCols[col] ? self.navData.gridCols[col] + 1 : 1;
            }

            el = React.cloneElement(item, params);
            return el;
        });
    }

};
