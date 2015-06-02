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
There will be examples, hold tight :)
