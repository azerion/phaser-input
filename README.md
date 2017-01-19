Phaser Input
============
Phaser Input is a plugin for Phaser that allows you to use html input fields as Phaser object inside your Phaser game. It fills the blanks of CanvasInput (that only works on a canvas renderer) and appends it with full Phaser support!
The best part is that it will also work on mobile devices!

Key features:

* Works on mobile and Desktop
* Included TypeScript support
* Also runs under WebGL renderer
* Pure Phaser implementation
* Easy configurable
* Production hardened

*Imporant*
From here on this library will be published and updated under [@orange-games/phaser-input](https://www.npmjs.com/package/@orange-games/phaser-input) at NPM, the old [phaser-input](https://www.npmjs.com/package/phaser-input) will no longer be maintained.
If you are comming from v1 you can read the migration guide at the bottom

Getting Started
---------------
First you want to get a fresh copy of the plugin. You can get it from this repo or from npm, ain't that handy.
```
npm install @orange-games/phaser-input --save-dev
```

Next up you'd want to add it to your list of js sources you load into your game
```html
<script src="node_modules/phaser-input/build/phaser-input.js"></script>
```

After adding the script to the page you can activate it by enabling the plugin:
```javascript
game.add.plugin(PhaserInput.Plugin);
```

Usage
-----
### Adding a InputField
The simplest way of adding a input field is:
```javascript
var input = game.add.inputField(10, 90);
```

Ofcourse there are options available that can be used to style the input. They can be passes as an object as the third parameter.

```javascript
var password = game.add.inputField(10, 90, {
    font: '18px Arial',
    fill: '#212121',
    fontWeight: 'bold',
    width: 150,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    placeHolder: 'Password',
    type: PhaserInput.InputType.password
});
```

### Using zoom
Zooming is easy to enable on an input field, it can be passed to the InputField as a setting. But there are some caveats:

First of all, it's only meant for mobile. Second; it modifies the scale and pivot of the world, and that might interfere with your resize.

Also, when the keyboard is shown, sometimes a resize event will be triggered.

Ideally you use a custom resize event, check for the static property `PhaserInput.KeyboardOpen` and don't resize when it's set to true.

### Using keyboard open/close signals
Current version includes two event dispatchers that notify when a device keyboard is opened or closed.

You can add listeners which trigger events based on this feedback.

```javascript
PhaserInput.onKeyboardClose.addOnce(function() {
    this.resizeBackgroundImage();
});
```

### Capture input events
By default, input event will not bubble up to other elements
This is controlled by an InputField property called `blockInput`.
When set to false, the input event will trigger on the input element and move up to other elements listening for the event.

e.g. An in-game sprite might be listening for keyboard events (W, A, S, D).
If set to false, typing in input field will not trigger keyboard events for the sprite.
So the sprite will not move when typing into input field.


### Toggle Enter key
InputField has a property (`focusOutOnEnter`) that controls whether the input field will lose focus on pressing Enter.
If set to true, pressing enter will end focus on the field (default is true).


### Current Limitations
 - Updates are slow when typing fast (type slower you!!)
 - Zoom modifies the pivot and scale of the world, so it might interfere with some stuff

## Properties
 - **x**: number (0 by default) The X-coordinate in the game
 - **y**: number (0 by default) The Y-coordinate in the game
 - **fill**: string (#fff by default) The color of the inputted text
 - **fillAlpha**: number (1 by default) Alpha of the textbox, 0 will hide the textbox and only show the text/placeholder/cursor
 - **width**: number (150 by default) The width of the text box (just like in the DOM, padding, borders add onto this width)
 - **height**: number (14 by default) The height of the text box (just like in the DOM, padding, borders add onto this height)
 - **padding**: number (0 by default) The padding in pixels around all 4 sides of the text input area.
 - **borderWidth**: number (1 by default) Size of the border
 - **borderColor**: string (#000 by default) Color of the border
 - **borderRadius**: number (0 by default) Create rounded corners by setting a border radius
 - **placeHolder**: string ('' by default) Text that will be shown before the user input's anything
 - **placeHolderColor**: string (#bfbebd by default) The color of the placeholder text
 - **type**: InputType (text by default) Either text, password or numeric
 - **backgroundColor**: string (#fff  by default) The background color of the input box
 - **cursorColor**: string (#000 by default) The color of the blinking cursor
 - **font**: string (14px Arial by default) The font that is used for the input box, covers the input text, placeholder and cursor
 - **min**: string (none by default) The minimum number for the input field, only for number input fields
 - **max**: string (none by default) The maximum number for the number input field, or the maxLength for other input fields
 - **selectionColor**: string (rgba(179, 212, 253, 0.8) by default) The default color for the text selection highlight.
 - **zoom**: boolean (false by default) if we need to  zoom onto the input field (mobile only).

### Browser Support
Tested on:
 - Desktop
  * Chrome 48+
  * FireFox 44+
  * Safari 9+
 - Mobile
  * Chrome 48+
  * iOS 9+

Migrating from v1
-----------------
the API of the objects is the same as before but the namespace changed. We decided to remove the Fabrique namespace, and house the plugin in it's own (PhaserInput).
so:
Fabrique.Plugins.Input
becomes:
PhaserInput.Plugin

and all other references of Fabrique.Plugins can be replaced with PhaserInput.
If you are still unsure how or what, both the example and this readme have been adjusted to work with the new namespace.

FAQ
---
### I Don't see the cursor blinking!
This is most likely due to you adding the input field to a custom Phaser object. According to the [Phaser docs](http://phaser.io/docs/2.6.2/Phaser.Sprite.html#update) the update function needs to be called manually in these cases.

So add the following to your object and the cursor should work :)

```javascript
update: function () {
    this._inputField.update();
},
```

### How do I focus on the element!
Normally the element is only focused trough user interaction (due to mobile limitations) you can get around this by manually calling the focus method yourself:
```javascript
var input = game.add.inputField(10, 90);
//start with focus on the element
input.startFocus();

//and then end the focus
input.endFocus();
```
Please note that this will not work on mobile wihtout a  user interaction

### Can I change the width later on in the code?
Well thanks for asking, yes you can!
```javascript
var input = game.add.inputField(10, 90);
input.width = 200;
```

Credits
-------
phaser-input is inspired by [CanvasInput](https://github.com/goldfire/CanvasInput)

Disclaimer
----------
We at OrangeGames just love playing and creating awesome games. We aren't affiliated with Phaser.io. We just needed some awesome input boxes in our awesome HTML5 games. Feel free to use it for enhancing your own awesome games!

Phaser Input is distributed under the MIT license. All 3rd party libraries and components are distributed under their
respective license terms.
