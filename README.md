# Ractive.js spoilerBox decorator plugin

*Find more Ractive.js plugins at [docs.ractivejs.org/latest/plugins](http://docs.ractivejs.org/latest/plugins)*

[See the demo here.](http://idis-fhws.github.io/ractive-decorators-spoilerBox/)

## Usage

Include this file on your page below Ractive, e.g:

```html
<script src='lib/ractive.js'></script>
<script src='lib/ractive-decorators-spoilerBox.js'></script>
```

Or, if you're using a module loader, require this module:

```js
// requiring the plugin will 'activate' it - no need to use the return value
require( 'ractive-decorators-spoilerBox' );
```

The layout for the spoilerBox decorator generally looks like so:
```html
<div decorator="spoilerBox">
    <div class="header"><!-- Content to display in the header --></div>
    <div class="content">
        <!-- Content to display within the spoilerBox -->
    </div>
</div>
```
Per default, the spoilerBox will initialize expanded. To spawn the spoilerBox in a specific state, add the state's css-class. The default states' css-classes are: `expanded` & `collapsed`.
```html
<div decorator="spoilerBox" class="collapsed">
```
If not found, the spoilerBox decorator will add a `div.navBtn` to the header-div of the spoilerBox, which removes the need for manually adding it to every spoilerBox's header. In the reference design, the `navBtn` is simply used for showing an arrow to visualize the header's next function.


To activate the expand/collapse animation built into the spoilerBox, simply pass the duration (in ms) as first parameter to the decorator, and optionally the `easing` as the second parameter. SpoilerBox uses css-transitions to implement the animation internally, possible values for `easing` can therefore be looked up [here](http://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp).
```html
<!-- Animate with a duration of 1337ms and ease in & out -->
<div decorator="spoilerBox:1337,'ease-in-out'" class="collapsed">
```

All used CSS class-names are specified in variables of the decorator, which can be changed when necessary. For a list of variables, please have a look at the bottom of the [decorator](https://raw.githubusercontent.com/idis-fhws/ractive-decorators-spoilerBox/master/src/ractive-decorators-spoilerBox.js). Please be aware, that the reference Stylesheet will only work with the default class-names. An example:
```js
Ractive.decorators.spoilerBox.spoilerBoxClassName = 'coolBox';
Ractive.decorators.spoilerBox.collapsedClassName = 'closed';
Ractive.decorators.spoilerBox.expandedClassName = 'open';
```

## License

Copyright (c) 2015 [IDIS FHWS](http://idis.fhws.de). Licensed MIT

Created with the [Ractive.js plugin template](https://github.com/ractivejs/plugin-template) for Grunt.
