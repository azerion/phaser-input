Phaser Input
============

Some description here about how awesome this Phaser Input library is, because it works on Canvas AND WebGL. Oh did I mention mobile to? no? Well it supports mobile..


Getting Started
---------------
First you want to get a fresh copy of the plugin. You can get it from this repo or from npm, ain't that handy.
```
npm install phaser-input --save-dev
```

Next up you'd want to add it to your list of js sources you load into your game
```html
<script src="node_modules/phaser-input/build/phaser-input.js"></script>
```

After adding the script to the page you can activate it by enabling the plugin:
```javascript
game.add.plugin(Fabrique.Plugins.Input);
```

Adding a InputField
-------------------
The simpelest way of adding a input field is:
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
    type: Fabrique.InputType.password
});
```

Current Limitations
-------------------
 - Cursor position doesn't get correctly updated after using the arrow key's
 - ctrl+a works, but isn't visible
 - Clicking in the box doesn't update the cursor position
 - Updates are slow when typing fast (type slower you!!)

Properties
----------
 - **x**: number (0 by default) The X-coordinate in the game
 - **y**: number (0 by default) The Y-coordinate in the game
 - **fill**: string (#fff by default) The color of the textbox
 - **fillAlpha**: number (1 by default) Alpha of the textbox, 0 will hide the textbox and only show the text/placeholder/cursor
 - **width**: number (150 by default) The width of the text box (just like in the DOM, padding, borders add onto this width)
 - **height**: number (14 by default) The height of the text box (just like in the DOM, padding, borders add onto this height)
 - **padding**: number (0 by default) The padding in pixels around all 4 sides of the text input area.
 - **borderWidth**: number (1 by default) Size of the border
 - **borderColor**: string (#000 by default) Color of the border
 - **borderRadius**: number (0 by default) Create rounded corners by setting a border radius
 - **placeHolder**: string ('' by default) Text that will be shown before the user input's anything
 - **placeHolderColor**: string (#000 by default) The color of the placeholder text
 - **type**: InputType (text by default) Either text or password

Browser Support
---------------
Tested on:
 - Desktop
  * Chrome 48+
 - Mobile
  * Chrome 48+
  * iOS 9+

Changelog
---------
### 0.1.0
* Full Android/iOS support

Disclaimer
----------
We at OrangeGames just love playing and creating awesome games. We aren't affiliated with Phaser.io. We just needed some awesome input boxes in our awesome HTML5 games. Feel free to use it for enhancing your own awesome games!

Released under the MIT license