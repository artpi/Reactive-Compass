# Reactive-Compass
Reactive compass is a navigation controller for keyboard navigation based systems.
Initially developed for Smart TV and embedded devices utilizing **IR Remote**.

## Navigation
You navigate the app using Arrow keys. The proper element gets 'focused', and then you can perform actions on that element using different keyboard keys.

## Navigation map
Whole navigation is built into a navigation tree. The leafs are focusable elements, the tree nodes are holding those focusable elements or other nodes.
Navigation nodes can act as:
* Grids - navigation in both directions
* Horizontal lists - navigation using arrow_down and arrow_up
* Vertical lists - navigarion using arrow_left and arrow_right


## Reactive Compass architecture.
Reactive compass is composed of two elements:
* Navigation controller - a singleton holding root of navigation tree and listening on key events in the application
* Navigation mixin - a mixin to include into all navigable nodes.

## Adding navigation to application
TBD

## Examples
All example are on branch "example" in "examples" directory. This is by design. When you clone the repository or use it as submodule probably you dont want to have examples in your working app.
To run any of these examples, checkout `example` branch, go to folder containing the example, install npm modules (`npm install`), build (`npm run build`) and you can open the example in your browser.
### Current examples include:
* [Sorting Grid example `examples/grid` ](https://github.com/artpi/Reactive-Compass/blob/example/examples/grid/app.jsx)
