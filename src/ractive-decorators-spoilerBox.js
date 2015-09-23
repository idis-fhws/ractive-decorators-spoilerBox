/*

	ractive-decorators-spoilerBox
	=============================

	Version 0.1.0

	SpoilerBox is a customizeable box consisting of a header and a content-div implementing the functionality to collapse and expand its content when clicking on its header.

	==========================

	Troubleshooting: If you're using a module system in your app (AMD or
	something more nodey) then you may need to change the paths below,
	where it says `require( 'ractive' )` or `define([ 'ractive' ]...)`.

	==========================

	Usage: Include this file on your page below Ractive, e.g:

	    <script src='lib/ractive.js'></script>
	    <script src='lib/ractive-decorators-spoilerBox.js'></script>

	Or, if you're using a module loader, require this module:

	    // requiring the plugin will 'activate' it - no need to use
	    // the return value
	    require( 'ractive-decorators-spoilerBox' );

	<< more specific instructions for this plugin go here... >>

*/

(function ( global, factory ) {

	'use strict';

	// AMD environment
	if ( typeof define === 'function' && define.amd ) {
		define([ 'ractive' ], factory );
	}

	// Common JS (i.e. node/browserify)
	else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		factory( require( 'ractive' ) );
	}

	// browser global
	else if ( global.Ractive ) {
		factory( global.Ractive );
	}

	else {
		throw new Error( 'Could not find Ractive! It must be loaded before the ractive-decorators-spoilerBox plugin' );
	}

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {

	'use strict';

	var spoilerBoxDecorator = function ( node, aDuration, aEasing ) {
		/* HELPERS */
		var hasClass = function(node, className){
			return (node.classList.contains(className));
		}
		var addClass = function(node, className){
			if(!hasClass(node, className)){
				node.classList.add(className);
			}
		};
		var removeClass = function(node, className){
			if(hasClass(node, className)){
				node.classList.remove(className);
			}
		};
		var NodeAnimationHelper = function(node, nodeWrapper, duration, easing){
			var cAnim = null;
			
			this.setAnimation = function(startCb, finishCb){
				if(cAnim !== null){//stop currently running animation first
					cAnim.abort();
					cAnim = null;
				}				
				nodeWrapper.style.maxHeight = node.clientHeight + "px";
				nodeWrapper.style.transition = "max-height " + parseInt(duration).toString() + "ms" + ((easing != null) ? " " + easing : "");
				var callbackWrapper;
				callbackWrapper = function(){
					nodeWrapper.removeEventListener("transitionend", callbackWrapper);
					finishCb();
					cAnim = null;
				};
				//delay the animation-start (css-class add), transition might not work otherwise
				setTimeout(function(){
					nodeWrapper.addEventListener('transitionend', callbackWrapper);
					startCb();
				}, 50);
				cAnim = {
					abort: function(){
						nodeWrapper.removeEventListener("transitionend", callbackWrapper);
						cAnim = null;						
					}
				};
			};
		};
		
		addClass(node, spoilerBoxDecorator.spoilerBoxClassName);
		var header = node.querySelector('div.' + spoilerBoxDecorator.headerClassName);
		var headerBtn = node.querySelector('div.' + spoilerBoxDecorator.headerClassName + ' > div.' + spoilerBoxDecorator.navButtonClassName);
		var contentWrapper = document.createElement('div');
		var content = node.querySelector('div.' + spoilerBoxDecorator.contentClassName);
		
		if(headerBtn == null){
			headerBtn = document.createElement('div');
			addClass(headerBtn, spoilerBoxDecorator.navButtonClassName);
			header.appendChild(headerBtn);
		}
		addClass(contentWrapper, spoilerBoxDecorator.contentWrapperClassName);
		node.removeChild(content);
		contentWrapper.appendChild(content);
		node.appendChild(contentWrapper);
		
		//init css-stateclass
		if(hasClass(node, spoilerBoxDecorator.collapsingClassName) || hasClass(node, spoilerBoxDecorator.expandingClassName)){
			//not supported as initial css-classes => remove
			removeClass(node, spoilerBoxDecorator.collapsingClassName);
			removeClass(node, spoilerBoxDecorator.expandingClassName);
		}
		
		if(!hasClass(node, spoilerBoxDecorator.collapsedClassName) && !hasClass(node, spoilerBoxDecorator.expandedClassName)) {
			//no initial css-class, add expanded by default
			addClass(node, spoilerBoxDecorator.expandedClassName);
		}
		
		
		/* ANIMATION */
		var setStateClass = function(stateClass){
			removeClass(node, spoilerBoxDecorator.collapsingClassName);
			removeClass(node, spoilerBoxDecorator.collapsedClassName);
			removeClass(node, spoilerBoxDecorator.expandingClassName);
			removeClass(node, spoilerBoxDecorator.expandedClassName);
			addClass(node, stateClass);
		};
		var animationHandler = (aDuration != null) ? new NodeAnimationHelper(content, contentWrapper, aDuration, aEasing) : null;
		
		
		
		/* EVENT HANDLERS */
		var onHeaderClick = function(){
			if(hasClass(node, spoilerBoxDecorator.collapsedClassName) || hasClass(node, spoilerBoxDecorator.collapsingClassName)){
				if(animationHandler != null){
					animationHandler.setAnimation(
						function(){ setStateClass(spoilerBoxDecorator.expandingClassName); contentWrapper.style.maxHeight = content.clientHeight + "px"; },
						function(){ setStateClass(spoilerBoxDecorator.expandedClassName); contentWrapper.style.transition = ""; contentWrapper.style.maxHeight = ""; }
					);
				} else {
					setStateClass(spoilerBoxDecorator.expandedClassName);
				}
			}else {
				if(animationHandler != null){
					animationHandler.setAnimation(
						function(){ setStateClass(spoilerBoxDecorator.collapsingClassName); contentWrapper.style.maxHeight = "0px"; },
						function(){ setStateClass(spoilerBoxDecorator.collapsedClassName); contentWrapper.style.transition = ""; }
					);
				} else {
					setStateClass(spoilerBoxDecorator.collapsedClassName);
				}	
			}
		};
		
		header.addEventListener('click', onHeaderClick);
		
		return {
			teardown: function(){
				header.removeEventListener('click', onHeaderClick);
			}
		};
	};
	
	//default options
	spoilerBoxDecorator.spoilerBoxClassName = 'spoilerBox';
	
	spoilerBoxDecorator.headerClassName = 'header';
	spoilerBoxDecorator.navButtonClassName = 'navBtn';
	spoilerBoxDecorator.contentClassName = 'content';
	spoilerBoxDecorator.contentWrapperClassName = 'animationWrapper';
	
	spoilerBoxDecorator.collapsingClassName = 'collapsing';
	spoilerBoxDecorator.collapsedClassName = 'collapsed';
	
	spoilerBoxDecorator.expandingClassName = 'expanding';
	spoilerBoxDecorator.expandedClassName = 'expanded';
	
	Ractive.decorators.spoilerBox = spoilerBoxDecorator;

}));
