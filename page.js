/*** Function references needed for JS prototypes ***/
var prototypeGetElementsByClassName = function (cls) {
	var descendants = this.getElementsByTagName('*'), i = -1, e, result = [];
	while (e = descendants[++i]) {
		((' ' + (e['class'] || e.className) + ' ').indexOf(' ' + cls + ' ') > -1) && result.push(e);
	}
	return result;
};

/*** Extending JS prototypes ***/

/* String prototype */
// startsWith
if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (str) {
		return this.slice(0, str.length) == str;
	};
}
// endsWith
if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function (str) {
		return this.slice(-str.length) == str;
	};
}
// contains
if (typeof String.prototype.contains != 'function') {
	String.prototype.contains = function (str) {
		return this.indexOf(str) != -1;
	};
}
// trim
if (typeof String.prototype.trim != 'function') {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

/* Document prototype */
if (typeof Document != 'undefined') { // Some browsers don't have this prototype (e.g. old IE)
	// getElementsByClassName
	if (typeof Document.prototype.getElementsByClassName != 'function') {
		Document.prototype.getElementsByClassName = prototypeGetElementsByClassName;
	}
}

/* HTMLDocument prototype */
if (typeof HTMLDocument != 'undefined') { // Some browsers don't have this prototype (e.g. old IE)
	// getElementsByClassName
	if (typeof HTMLDocument.prototype.getElementsByClassName != 'function') {
		HTMLDocument.prototype.getElementsByClassName = prototypeGetElementsByClassName;
	}
}

/* Element prototype */
// getElementsByClassName
if (typeof Element.prototype.getElementsByClassName != 'function') {
	Element.prototype.getElementsByClassName = prototypeGetElementsByClassName;
}
// addClass
if (typeof Element.prototype.addClass != 'function') {
	Element.prototype.addClass = function (cls) {
		if (this.classList && this.classList.add) {
			this.classList.add(cls);
		}
		else {
			cLog('Fallback to addClass functionality used!', true); // Debug message
			if (this.className !== undefined && !this.hasClass(cls)) {
				this.className += (this.className.length ? ' ' : '') + cls;
			}
		}
		return this;
	};
}
// removeClass
if (typeof Element.prototype.removeClass != 'function') {
	Element.prototype.removeClass = function (cls) {
		if (this.classList && this.classList.remove) {
			this.classList.remove(cls);
		}
		else {
			cLog('Fallback to removeClass functionality used!', true); // Debug message
			if (this.className !== undefined && this.hasClass(cls)) {
				this.className = this.className.replace(new RegExp('(^|\\s)' + cls + '(?!\\S)', 'g'), '').trim();
			}
		}
		return this;
	};
}
// hasClass
if (typeof Element.prototype.hasClass != 'function') {
	Element.prototype.hasClass = function (cls) {
		if (this.classList && this.classList.contains) {
			return this.classList.contains(cls);
		}
		else {
			cLog('Fallback to hasClass functionality used!', true); // Debug message
			return this.className !== undefined && new RegExp("(^|\\s)" + cls + "(\\s|$)").test(this.className);
		}
	};
}
// toggleClass
if (typeof Element.prototype.toggleClass != 'function') {
	Element.prototype.toggleClass = function (cls) {
		if (this.classList && this.classList.toggle) {
			return this.classList.toggle(cls);
		}
		else {
			cLog('Fallback to toggleClass functionality used!', true); // Debug message
			return this.hasClass(cls) ? this.removeClass(cls) : this.addClass(cls);
		}
	};
}

/*** Common helper function ***/

/* Error proof console.log for older IE's, used for debug messages also by giving 'true' as debug parameter */
function cLog(msg, debug) {
	try {
		if (window.console && window.console.log) {
			if (!debug || debug && debug == true && setup.debug === true) { // Log message OR log debug message, if page is in debug state
				console.log(msg);
			}
		}
	} catch (e) {}
}

/* Get event target, IE8/IE7 and safari included */
function getTarget(event) {
	var targ;
	if (event === undefined) { event = window.event; } // Get window event instead

	if (event !== undefined) {
		if (event.target !== undefined) {
			targ = event.target;			// Other (modern) browsers' event target
		}
		else if (event.srcElement !== undefined) {
			targ = event.srcElement;	// IE8/IE7 event target
		}
		else {
			targ = document;					// If srcElement is not defined either
		}
	}

	if (targ.nodeType == 3) {targ = targ.parentNode;} // Defeat Safari bug
	return targ;
}

/* Get variables from URL querystring */
function loadPageVar(sVar) {
	return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

/* Add class to DOM object */
function addClass(domObject, cls) {
	return domObject.addClass(cls);
}

/* Remove class from DOM object */
function removeClass(domObject, cls) {
	return domObject.removeClass(cls);
}

/*** Page functions ***/

/* Show hidden programs based on querystring variable (?showhidden=1) */
function showHiddenProgramsByUrl() {
	var showHidden = loadPageVar("showhidden");
	if (showHidden) {
		setup.showHidden = showHidden;
		if (showHidden === true) {
			var hiddenPrograms = document.getElementsByClassName("ohjelma hidden");
			for (var i = 0; i < hiddenPrograms.length; i++) {
				hiddenPrograms[i].className = hiddenPrograms[i].className + " show";
			}
		}
	}
}

/* Animate hidden programs based on querystring variable (?animations=0), css transition must be supported */
function animateHiddenProgramsByUrl() {
	var animations = loadPageVar("animations");
	if (animations) {
		setup.animations = setup.transitionSupported && animations;
	}
}

/* Adding necessary classes for hidden animations */
function addAnimationClasses() {
	var hiddenPrograms = document.getElementsByClassName("ohjelma hidden");
	if (hiddenPrograms.length > 0) {
		for (var i = 0; i < hiddenPrograms.length; i++) {
			if (!hiddenPrograms[i].className.contains('show')) {
				hiddenPrograms[i].addClass('animation-hidden');
			}
		}
	}
}

/* Toggle hidden programs show state, with animations */
function toggleHiddenPrograms(e) {
	var hiddenPrograms = document.getElementsByClassName("ohjelma hidden");
	var shownPrograms = document.getElementsByClassName("ohjelma hidden show");
	var i;
	//var link = getTarget(e);
	//link.childNodes[0].nodeValue = "Älä näytä piilotettuja";

	if (e && e.preventDefault) { e.preventDefault(); }
	//e.returnValue = false; // Deprecated?

	if (shownPrograms.length > 0) {
		// Hiding hidden programs
		for (i = 0; i < hiddenPrograms.length; i++) {
			if (setup && setup.animations && setup.animations === true) {
				hiddenPrograms[i].removeClass('animation-show');
				hiddenPrograms[i].addClass('animation-hidden');
				setTimeout(removeClass, 300, hiddenPrograms[i], 'show'); // Hide after timeout
			}
			else {
				hiddenPrograms[i].removeClass('show');
			}
		}
	}
	else {
		// Showing hidden programs
		for (i = 0; i < hiddenPrograms.length; i++) {
			if (setup && setup.animations && setup.animations === true) {
				hiddenPrograms[i].addClass('show');
				hiddenPrograms[i].removeClass('animation-hidden');
				hiddenPrograms[i].addClass('animation-show');
			}
			else {
				hiddenPrograms[i].addClass('show');
			}
		}
	}
}

/* Show / hide ordinal numbers before program links */
function toggleProgramOrdinals(e) {
	if (e && e.preventDefault) { e.preventDefault(); }
	document.getElementById('linkit').toggleClass('program-ordinals');
}

/* Update program key value to textarea */
function updateProgramKeyValue() {
	document.getElementById('program-key').innerHTML = JSON.stringify(programsStored.value);
}

/* Show program key textarea */
function showProgramKeyValue() {
	document.getElementById('program-key-div').removeClass('label-hidden');
	document.getElementById('program-key').removeClass('hidden').select();
}

/* Page variable & setting initializations */
function init() {
	// Check & create global variables
	if (window.setup === undefined) { window.setup = {}; }
	if (setup.transitionSupported === undefined) { setup.transitionSupported = document.documentElement.style.transition !== undefined; }
	if (setup.animations === undefined) { setup.animations = setup.transitionSupported && (loadPageVar('animations') ? loadPageVar('animations') == true : true); }
	if (setup.showHidden === undefined) { setup.showHidden = loadPageVar('showhidden') ? loadPageVar('showhidden') == true : true; }
	if (setup.debug === undefined) { setup.debug = loadPageVar('debug') ? loadPageVar('debug') == true : false; }

	// Read querystring variables, actions based on querystring variables
	showHiddenProgramsByUrl();
	animateHiddenProgramsByUrl();
	setup.debug = loadPageVar('debug') ? loadPageVar('debug') == true : false;

	if (setup && setup.animations === true) {
		addAnimationClasses();
	}

	// Load program key value
	updateProgramKeyValue();
}

/*** Global variables ***/

/* Page setup variables */
var setup = {
	transitionSupported: document.documentElement.style.transition !== undefined,
	animations: document.documentElement.style.transition !== undefined,
	showHidden: false,
	debug: false
};

/*** Attaching events ***/

/* Attach initialization event on window load */
if(window.attachEvent) {
	window.attachEvent('onload', init);
} else {
	if(window.onload) {
		var curronload = window.onload;
		var newonload = function() {
			curronload();
			init();
		};
		window.onload = newonload;
	} else {
		window.onload = init;
	}
}