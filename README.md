# Reactive-Compass
Reactive compass is a navigation controller for keyboard navigation based systems.
Initially developed for Smart TV and embedded devices utilizing **IR Remote**.

![Grid example](https://raw.githubusercontent.com/artpi/Reactive-Compass/example/examples/grid/demo.gif)

## Navigation
You navigate the app using Arrow keys. The proper element gets 'focused', and then you can perform actions on that element using different keyboard keys.

## Navigation map
Whole navigation is built into a navigation tree. The leafs are focusable elements, the tree nodes are holding those focusable elements or other nodes.
Navigation nodes can act as:
* Grids - navigation in both directions
* Horizontal lists - navigation using arrow_down and arrow_up
* Vertical lists - navigation using arrow_left and arrow_right
* Leaves - focusable elements


## Reactive Compass architecture.
Reactive compass is composed of two elements:
* navigation.controller - a singleton holding root of navigation tree and listening on key events in the application
* navigation.mixin - a mixin to include into all navigable nodes.

## Adding navigation to application
1. Every element in your navigation tree needs to have navigation.mixin mixed in,
2. Every element in your navigation tree needs to call `this.navInit()` in `render()` method. This properly registers element in navigation tree,
3. Every parent node in your navigation tree needs to call `navEach` on children elements. This adds two properties: `navParent` property, which is `parent.navSelf` returning self.
4. Focusable items (leaves in the tree) will receive `focused` state. You can translate it into class, attribute or whatever works for you. I just add the `focused` className.
5. Every element can specify `navHandleKey` method, which can capture ENTER or any other key


### Lists
Node can be a Horizontal list or a vertical lists.
* Horizontal lists are traversed using `LEFT` and `RIGHT` arrows. To make a node a horizontal list, just add `navType='horizontal'` attribute to it.
* Vertical lists are traversed using `UP` and `DOWN` arrows. To make a node a vertical list, just add `navType='vertical'` attribute to it.
If you want to wrap a list, add `navWrap="wrap"` to a list.

### Grids
Node in navigation tree can be a grid. You can traverse grids using both up, down, left and right keys.
To make node a grid:
* Add `navType="grid"` attribute to it,
* Add `navGridCols` attribute specifying number of columns you want in your grid,
* For grid children it is important to call `navEach` for each of its children, because grid logic is a little bit more complicated
* If you want to wrap a grid, you can set `navWrap="wrapX"`, `navWrap="wrapY"` or `navWrap="wrap"` to wrap it in both dimensions.


### Focusable elements
As mentioned, ocusable items (leaves in the tree) will receive `focused` state. You can translate it into class, attribute or whatever works for you. I just add the `focused` className.

## Examples
All example are on branch "example" in "examples" directory. This is by design. When you clone the repository or use it as submodule probably you dont want to have examples in your working app.
To run any of these examples, checkout `example` branch, go to folder containing the example, install npm modules (`npm install`), build (`npm run build`) and you can open the example in your browser.
### Current examples include:
* [Sorting Grid example `examples/grid` ](https://github.com/artpi/Reactive-Compass/blob/example/examples/grid/app.jsx)