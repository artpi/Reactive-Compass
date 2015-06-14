var React = require('react'),
    navigationController = require('./navigationController.js');

module.exports = {
    /**
     * Sets up initial state of the react node.
     * focused state indicates if element has focus.
     * @return {object}
     */
    getInitialState: function () {
        'use strict';
        return {focused: false};
    },
    /**
     * Find focusable element for certain offset
     * @param  {number} dir  Horizontal offset
     * @param  {number} dirY Vertical offset
     * @return {ReactNode}   ReactNode to focus
     */
    navGetMove: function (dir, dirY) {
        'use strict';
        var parentData,
            currentPos,
            newPos,
            newEls,
            handleNewFocusElement;

        if (!this.navData.parent) {
            return null;
        }

        parentData = this.navData.parent.navData;

        handleNewFocusElement = function (element) {
            if (element) {
                return element.navFindFocus(dir, dirY);
            } else if (typeof this.navOut === 'function') {
                return this.navOut(dir, dirY);
            } else if (this.navData.parent) {
                return this.navData.parent.navGetMove(dir);
            }
        }.bind(this);

        function wrap (x, max) {
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
    /**
     * Find focusable child ReactNode of this Node.
     * @param  {number} dir  Where did focus come from horizontally?
     * @param  {number} dirY Where did focus come from vertically?
     * @return {ReactNode}   ReactNode to focus
     * @private
     */
    navFindFocus: function (dir, dirY) {
        'use strict';
        if (this.navData.children.length < 1) {
            return this;
        } else if (dir === -1) {
            return this.navData.children[this.navData.children.length - 1].navFindFocus(dir);
        } else {
            return this.navData.children[0].navFindFocus(dir);
        }
    },
    /**
     * Initialize navigation for this element. Sets up data for navigation. To be called in render
     * @param  {Array} children Optional! Calls navEach on these elements
     * @return {Array}          navEach result
     */
    navInit: function (children) {
        'use strict';
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
    /**
     * Returns self - needed to stitch children and parents in navigation tree.
     * @return {this}
     */
    navSelf: function () {
        'use strict';
        return this;
    },
    /**
     * Prepares each element for navigation. Sets navParent callback and sets up 'focused' prop.
     * @param  {Aray} children Children to prepare
     * @return {Array}          Prepared children
     */
    navEach: function (children) {
        'use strict';
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
