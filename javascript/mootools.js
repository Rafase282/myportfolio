//	mootools.js: moo javascript tools
//	by Valerio Proietti (http://mad4milk.net) MIT-style license.
	
//  CREDITS:

//	Class is slightly based on Base.js : http://dean.edwards.name/weblog/2006/03/base/
//		(c) 2006 Dean Edwards, License: http://creativecommons.org/licenses/LGPL/2.1/

//	Some functions are based on those found in prototype.js : http://prototype.conio.net/
//		(c) 2005 Sam Stephenson <sam@conio.net>, MIT-style license


//moo.js : My Object Oriented javascript - has no dependancies

var Class = function(properties){
	var klass = function(){
		for (var p in this) this[p]._proto_ = this;
		if (arguments[0] != 'noinit' && this.initialize) return this.initialize.apply(this, arguments);
	};
	klass.extend = this.extend;
	klass.implement = this.implement;
	klass.prototype = properties;
	return klass;
};

Class.empty = function(){};

Class.create = function(properties){
	return new Class(properties);
};

Class.prototype = {
	extend: function(properties){
		var pr0t0typ3 = new this('noinit');
		for (var property in properties){
			var previous = pr0t0typ3[property];
			var current = properties[property];
			if (previous && previous != current) current = previous.parentize(current) || current;
			pr0t0typ3[property] = current;
		}
		return new Class(pr0t0typ3);
	},
	
	implement: function(properties){
		for (var property in properties) this.prototype[property] = properties[property];
	}
};

Object.extend = function(){
	var args = arguments;
	if (args[1]) args = [args[0], args[1]];
	else args = [this, args[0]];
	for (var property in args[1]) args[0][property] = args[1][property];
	return args[0];
};

Object.Native = function(){
	for (var i = 0; i < arguments.length; i++) arguments[i].extend = Class.prototype.implement;
};

new Object.Native(Function, Array, String, Number);

Function.extend({
	parentize: function(current){
		var previous = this;
		return function(){
			this.parent = previous;
			return current.apply(this, arguments);
		};
	}
});
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//Function.js : Function extension - Depends on Moo.js

Function.extend({
	
	pass: function(args, bind){
		var fn = this;
		if ($type(args) != 'array') args = [args];
		return function(){
			return fn.apply(bind || fn._proto_ || fn, args);
		};
	},

	bind: function(bind){
		var fn = this;
		return function(){
			return fn.apply(bind, arguments);
		};
	},

	bindAsEventListener: function(bind){
		var fn = this;
		return function(event){
			fn.call(bind, event || window.event);
			return false;
		};
	},

	delay: function(ms, bind){
		return setTimeout(this.bind(bind || this._proto_ || this), ms);
	},

	periodical: function(ms, bind){
		return setInterval(this.bind(bind || this._proto_ || this), ms);
	}

});

function $clear(timer){
	clearTimeout(timer);
	clearInterval(timer);
	return null;
};

function $type(obj, types){
	if (!obj) return false;
	var type = false;
	if (obj instanceof Function) type = 'function';
	else if (obj.nodeName){
		if (obj.nodeType == 3 && !/\S/.test(obj.nodeValue)) type = 'textnode';
		else if (obj.nodeType == 1) type = 'element';
	}
	else if (obj instanceof Array) type = 'array';
	else if (typeof obj == 'object') type = 'object';
	else if (typeof obj == 'string') type = 'string';
	else if (typeof obj == 'number' && isFinite(obj)) type = 'number';
	return type;
};

var Chain = new Class({

	chain: function(fn){
		this.chains = this.chains || [];
		this.chains.push(fn);
		return this;
	},

	callChain: function(){
		if (this.chains && this.chains.length) this.chains.splice(0, 1)[0].delay(10, this);
	},
	
	clearChain: function(){
		this.chains = [];
	}

});
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//Array.js : Array extension - depends on Moo.js

if (!Array.prototype.forEach){
	Array.prototype.forEach = function(fn, bind){
		for (var i = 0; i < this.length ; i++) fn.call(bind, this[i], i);
	};
}

Array.extend({
	
	each: Array.prototype.forEach,
	
	copy: function(){
		var nArray = [];
		for (var i = 0; i < this.length; i++) nArray.push(this[i]);
		return nArray;
	},
	
	remove: function(item){
		for (var i = 0; i < this.length; i++){
			if (this[i] == item) this.splice(i, 1);
		}
		return this;
	},
	
	test: function(item){
		for (var i = 0; i < this.length; i++){
			if (this[i] == item) return true;
		};
		return false;
	},
	
	extend: function(nArray){
		for (var i = 0; i < nArray.length; i++) this.push(nArray[i]);
		return this;
	}
	
});

function $A(array){
	return Array.prototype.copy.call(array);
};
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//String.js : String extension - depends on Moo.js

String.extend({

	test: function(value, params){
		return this.match(new RegExp(value, params));
	},
	
	toInt: function(){
		return parseInt(this);
	},
	
	camelCase: function(){
		return this.replace(/-\D/gi, function(match){
			return match.charAt(match.length - 1).toUpperCase();
		});
	},

	capitalize: function(){
		return this.toLowerCase().replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	trim: function(){
		return this.replace(/^\s*|\s*$/g, '');
	},

	clean: function(){
		return this.replace(/\s\s/g, ' ').trim();
	},

	rgbToHex: function(array){
		var rgb = this.test('([\\d]{1,3})', 'g');
		if (rgb[3] == 0) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (rgb[i]-0).toString(16);
			hex.push(bit.length == 1 ? '0'+bit : bit);
		}
		var hexText = '#'+hex.join('');
		if (array) return hex;
		else return hexText;
	},

	hexToRgb: function(array){
		var hex = this.test('^[#]{0,1}([\\w]{1,2})([\\w]{1,2})([\\w]{1,2})$');
		var rgb = [];
		for (var i = 1; i < hex.length; i++){
			if (hex[i].length == 1) hex[i] += hex[i];
			rgb.push(parseInt(hex[i], 16));
		}
		var rgbText = 'rgb('+rgb.join(',')+')';
		if (array) return rgb;
		else return rgbText;
	}

});

Number.extend({

	toInt: function(){
		return this;
	}

});
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//Element.js : Element methods - depends on Moo.js + Native Scripts

var Element = new Class({

	//creation

	initialize: function(el){
		if ($type(el) == 'string') el = document.createElement(el);
		return $(el);
	},

	//injecters

	inject: function(el, where){
		el = $(el) || new Element(el);
		switch(where){
			case "before": $(el.parentNode).insertBefore(this, el); break;
			case "after": {
					if (!el.getNext()) $(el.parentNode).appendChild(this);
					else $(el.parentNode).insertBefore(this, el.getNext());
			} break;
			case "inside": el.appendChild(this); break;
		}
		return this;
	},

	injectBefore: function(el){
		return this.inject(el, 'before');
	},

	injectAfter: function(el){
		return this.inject(el, 'after');
	},

	injectInside: function(el){
		return this.inject(el, 'inside');
	},

	adopt: function(el){
		this.appendChild($(el) || new Element(el));
		return this;
	},

	//actions
	
	remove: function(){
		this.parentNode.removeChild(this);
	},

	clone: function(contents){
		return $(this.cloneNode(contents || true));
	},

	replaceWith: function(el){
		var el = $(el) || new Element(el);
		this.parentNode.replaceChild(el, this);
		return el;
	},
	
	appendText: function(text){
		if (this.getTag() == 'style' && window.ActiveXObject) this.styleSheet.cssText = text;
		else this.appendChild(document.createTextNode(text));
		return this;
	},

	//classnames

	hasClass: function(className){
		return !!this.className.test("\\b"+className+"\\b");
	},

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className+' '+className.trim()).clean();
		return this;
	},

	removeClass: function(className){
		if (this.hasClass(className)) this.className = this.className.replace(className.trim(), '').clean();
		return this;
	},

	toggleClass: function(className){
		if (this.hasClass(className)) return this.removeClass(className);
		else return this.addClass(className);
	},

	//styles

	setStyle: function(property, value){
		if (property == 'opacity') this.setOpacity(parseFloat(value));
		else this.style[property.camelCase()] = value;
		return this;
	},

	setStyles: function(source){
		if ($type(source) == 'object') {
			for (var property in source) this.setStyle(property, source[property]);
		} else if ($type(source) == 'string') {
			if (window.ActiveXObject) this.cssText = source;
			else this.setAttribute('style', source);
		}
		return this;
	},

	setOpacity: function(opacity){
		if (opacity == 0 && this.style.visibility != "hidden") this.style.visibility = "hidden";
		else if (this.style.visibility != "visible") this.style.visibility = "visible";
		if (window.ActiveXObject) this.style.filter = "alpha(opacity=" + opacity*100 + ")";
		this.style.opacity = opacity;
		return this;
	},

	getStyle: function(property, num){
		var proPerty = property.camelCase();
		var style = this.style[proPerty] || false;
		if (!style) {
			if (document.defaultView) style = document.defaultView.getComputedStyle(this,null).getPropertyValue(property);
			else if (this.currentStyle) style = this.currentStyle[proPerty];
		}
		if (style && ['color', 'backgroundColor', 'borderColor'].test(proPerty) && style.test('rgb')) style = style.rgbToHex();
		if (num) return style.toInt();
		else return style;
	},

	removeStyles: function(){
		$A(arguments).each(function(property){
			this.style[property.camelCase()] = '';
		}, this);
		return this;
	},

	//events

	addEvent: function(action, fn){
		this[action+fn] = fn.bind(this);
		if (this.addEventListener) this.addEventListener(action, fn, false);
		else this.attachEvent('on'+action, this[action+fn]);
		var el = this;
		if (this != window) Unload.functions.push(function(){
			el.removeEvent(action, fn);
			el[action+fn] = null;
		});
		return this;
	},

	removeEvent: function(action, fn){
		if (this.removeEventListener) this.removeEventListener(action, fn, false);
		else this.detachEvent('on'+action, this[action+fn]);
		return this;
	},

	//get non-text elements

	getBrother: function(what){
		var el = this[what+'Sibling'];
		while ($type(el) == 'textnode') el = el[what+'Sibling'];
		return $(el);
	},

	getPrevious: function(){
		return this.getBrother('previous');
	},

	getNext: function(){
		return this.getBrother('next');
	},

	getFirst: function(){
		var el = this.firstChild;
		while ($type(el) == 'textnode') el = el.nextSibling;
		return $(el);
	},
	
	getLast: function(){
		var el = this.lastChild;
		while ($type(el) == 'textnode')
		el = el.previousSibling;
		return $(el);
	},

	//properties

	setProperty: function(property, value){
		var el = false;
		switch(property){
			case 'class': this.className = value; break;
			case 'style': this.setStyles(value); break;
			case 'name': if (window.ActiveXObject && this.getTag() == 'input'){
				el = $(document.createElement('<input name="'+value+'" />'));
				$A(this.attributes).each(function(attribute){
					if (attribute.name != 'name') el.setProperty(attribute.name, attribute.value);
					
				});
				if (this.parentNode) this.replaceWith(el);
			};
			default: this.setAttribute(property, value);
		}
		return el || this;
	},

	setProperties: function(source){
		for (var property in source) this.setProperty(property, source[property]);
		return this;
	},

	setHTML: function(html){
		this.innerHTML = html;
		return this;
	},

	getProperty: function(property){
		return this.getAttribute(property);
	},

	getTag: function(){
		return this.tagName.toLowerCase();
	},

	//position

	getOffset: function(what){
		what = what.capitalize();
		var el = this;
		var offset = 0;
		do {
			offset += el['offset'+what] || 0;
			el = el.offsetParent;
		} while (el);
		return offset;
	},

	getTop: function(){
		return this.getOffset('top');
	},

	getLeft: function(){
		return this.getOffset('left');
	}

});

new Object.Native(Element);

Element.extend({
	hasClassName: Element.prototype.hasClass,
	addClassName: Element.prototype.addClass,
	removeClassName: Element.prototype.removeClass,
	toggleClassName: Element.prototype.toggleClass
});

function $Element(el, method, args){
	if ($type(args) != 'array') args = [args];
	return Element.prototype[method].apply(el, args);
};

function $(el){
	if ($type(el) == 'string') el = document.getElementById(el);
	if ($type(el) == 'element'){
		if (!el.extend){
			Unload.elements.push(el);
			el.extend = Object.extend;
			el.extend(Element.prototype);
		}
		return el;
	} else return false;
};

window.addEvent = document.addEvent = Element.prototype.addEvent;
window.removeEvent = document.removeEvent = Element.prototype.removeEvent;

//garbage collector

var Unload = {

	elements: [], functions: [], vars: [],
	
	unload: function(){
		Unload.functions.each(function(fn){
			fn();
		});
		
		window.removeEvent('unload', window.removeFunction);
		
		Unload.elements.each(function(el){
			for (var p in Element.prototype){
				window[p] = null;
				document[p] = null;
				el[p] = null;
			}
			el.extend = null;
		});
	}
	
};
window.removeFunction = Unload.unload;
window.addEvent('unload', window.removeFunction);
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//Fx.js - The Effects - depends on Moo.js + Native Scripts

var Fx = fx = {};

Fx.Base = new Class({

	setOptions: function(options){
		this.options = Object.extend({
			onStart: Class.empty,
			onComplete: Class.empty,
			transition: Fx.Transitions.sineInOut,
			duration: 500,
			unit: 'px',
			wait: true,
			fps: 50
		}, options || {});
	},

	step: function(){
		var time = new Date().getTime();
		if (time < this.time + this.options.duration){
			this.cTime = time - this.time;
			this.setNow();
		} else {
			this.options.onComplete.pass(this.element, this).delay(10);
			this.clearTimer();
			this.callChain();
			this.now = this.to;
		}
		this.increase();
	},

	set: function(to){
		this.now = to;
		this.increase();
		return this;
	},

	setNow: function(){
		this.now = this.compute(this.from, this.to);
	},

	compute: function(from, to){
		return this.options.transition(this.cTime, from, (to - from), this.options.duration);
	},

	custom: function(from, to){
		if (!this.options.wait) this.clearTimer();
		if (this.timer) return;
		this.options.onStart.pass(this.element, this).delay(10);
		this.from = from;
		this.to = to;
		this.time = new Date().getTime();
		this.timer = this.step.periodical(Math.round(1000/this.options.fps), this);
		return this;
	},

	clearTimer: function(){
		this.timer = $clear(this.timer);
		return this;
	},

	setStyle: function(element, property, value){
		element.setStyle(property, value + this.options.unit);
	}

});

Fx.Base.implement(new Chain);

Fx.Style = Fx.Base.extend({

	initialize: function(el, property, options){
		this.element = $(el);
		this.setOptions(options);
		this.property = property.camelCase();
	},

	hide: function(){
		return this.set(0);
	},

	goTo: function(val){
		return this.custom(this.now || 0, val);
	},

	increase: function(){
		this.setStyle(this.element, this.property, this.now);
	}

});

Fx.Styles = Fx.Base.extend({

	initialize: function(el, options){
		this.element = $(el);
		this.setOptions(options);
		this.now = {};
	},

	setNow: function(){
		for (var p in this.from) this.now[p] = this.compute(this.from[p], this.to[p]);
	},

	custom: function(objFromTo){
		if (this.timer && this.options.wait) return;
		var from = {};
		var to = {};
		for (var p in objFromTo){
			from[p] = objFromTo[p][0];
			to[p] = objFromTo[p][1];
		}
		return this.parent(from, to);
	},

	increase: function(){
		for (var p in this.now) this.setStyle(this.element, p, this.now[p]);
	}

});

Element.extend({

	effect: function(property, options){
		return new Fx.Style(this, property, options);
	},

	effects: function(options){
		return new Fx.Styles(this, options);
	}

});

//Easing Equations, (c) 2003 Robert Penner (http://www.robertpenner.com/easing/), Open Source BSD License.

Fx.Transitions = {

	linear: function(t, b, c, d){
		return c*t/d + b;
	},

	sineInOut: function(t, b, c, d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}

};
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//SuperDom.js - depends on Moo.js + Native Scripts

function $S(){
	var els = [];
	$A(arguments).each(function(sel){
		if ($type(sel) == 'string') els.extend(document.getElementsBySelector(sel));
		else if ($type(sel) == 'element') els.push($(sel));
	});
	return $Elements(els);
};

var $$ = $S;

function $E(selector, filter){
	return ($(filter) || document).getElement(selector);
};

function $ES(selector, filter){
	return ($(filter) || document).getElementsBySelector(selector);
};

function $Elements(elements){
	return Object.extend(elements, new Elements);
};

Element.extend({

	getElements: function(selector){
		var filters = [];
		selector.clean().split(' ').each(function(sel, i){
			var bits = [];
			var param = [];
			var attr = [];
			if (bits = sel.test('^([\\w]*)')) param['tag'] = bits[1] || '*';
			if (bits = sel.test('([.#]{1})([\\w-]*)$')){
				if (bits[1] == '.') param['class'] = bits[2];
				else param['id'] = bits[2];
			}
			if (bits = sel.test('\\[["\'\\s]{0,1}([\\w-]*)["\'\\s]{0,1}([\\W]{0,1}=){0,2}["\'\\s]{0,1}([\\w-]*)["\'\\s]{0,1}\\]$')){
				attr['name'] = bits[1];
				attr['operator'] = bits[2];
				attr['value'] = bits[3];
			}
			if (i == 0){
				if (param['id']){
					var el = this.getElementById(param['id']);
					if (el && (param['tag'] == '*' || $(el).getTag() == param['tag'])) filters = [el];
					else return false;
				} else {
					filters = $A(this.getElementsByTagName(param['tag']));
				}
			} else {
				filters = $Elements(filters).filterByTagName(param['tag']);
				if (param['id']) filters = $Elements(filters).filterById(param['id']);
			}
			if (param['class']) filters = $Elements(filters).filterByClassName(param['class']);
			if (attr['name']) filters = $Elements(filters).filterByAttribute(attr['name'], attr['value'], attr['operator']);
		
		}, this);
		filters.each(function(el){
			$(el);
		});
		return $Elements(filters);
	},
	
	getElement: function(selector){
		return this.getElementsBySelector(selector)[0];
	},

	getElementsBySelector: function(selector){
		var els = [];
		selector.split(',').each(function(sel){
			els.extend(this.getElements(sel));
		}, this);
		return $Elements(els);
	}

});

document.extend = Object.extend;

document.extend({

	getElementsByClassName: function(className){
		return document.getElements('.'+className);
	},
	getElement: Element.prototype.getElement,
	getElements: Element.prototype.getElements,
	getElementsBySelector: Element.prototype.getElementsBySelector
	
});

var Elements = new Class({
	
	action: function(actions){
		this.each(function(el){
			el = $(el);
			if (actions.initialize) actions.initialize.apply(el);
			for (var action in actions){
				var evt = false;
				if (action.test('^on[\\w]{1,}')) el[action] = actions[action];
				else if (evt = action.test('([\\w-]{1,})event$')) el.addEvent(evt[1], actions[action]);
			}
		});
	},

	filterById: function(id){
		var found = [];
		this.each(function(el){
			if (el.id == id) found.push(el);
		});
		return found;
	},

	filterByClassName: function(className){
		var found = [];
		this.each(function(el){
			if ($Element(el, 'hasClass', className)) found.push(el);
		});
		return found;
	},

	filterByTagName: function(tagName){
		var found = [];
		this.each(function(el){
			found.extend($A(el.getElementsByTagName(tagName)));
		});
		return found;
	},
	
	filterByAttribute: function(name, value, operator){
		var found = [];
		this.each(function(el){
			var att = el.getAttribute(name);
			if(!att) return;
			if (!operator) return found.push(el);
			
			switch(operator){
				case '*=': if (att.test(value)) found.push(el); break;
				case '=': if (att == value) found.push(el); break;
				case '^=': if (att.test('^'+value)) found.push(el); break;
				case '$=': if (att.test(value+'$')) found.push(el);
			}

		});
		return found;
	}

});

new Object.Native(Elements);
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//Ajax.js - depends on Moo.js + Native Scripts

var Ajax = ajax = new Class({

	setOptions: function(options){
		this.options = {
			method: 'post',
			postBody: null,
			async: true,
			onComplete: Class.empty,
			onStateChange: Class.empty,
			update: null,
			evalScripts: false
		};
		Object.extend(this.options, options || {});
	},

	initialize: function(url, options){
		this.setOptions(options);
		this.url = url;
		this.transport = this.getTransport();
	},

	request: function(){
		this.transport.open(this.options.method, this.url, this.options.async);
		this.transport.onreadystatechange = this.onStateChange.bind(this);
		if (this.options.method == 'post'){
			this.transport.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			if (this.transport.overrideMimeType) this.transport.setRequestHeader('Connection', 'close');
		}
		switch($type(this.options.postBody)){
			case 'element': this.options.postBody = $(this.options.postBody).toQueryString(); break;
			case 'object': this.options.postBody = Object.toQueryString(this.options.postBody);
		}
		this.transport.send(this.options.postBody);
		return this;
	},

	onStateChange: function(){
		this.options.onStateChange.bind(this).delay(10);
		if (this.transport.readyState == 4 && this.transport.status == 200){
			if (this.options.update) $(this.options.update).setHTML(this.transport.responseText);
			this.options.onComplete.pass([this.transport.responseText, this.transport.responseXML], this).delay(20);
			if (this.options.evalScripts) this.evalScripts.delay(30, this);
			this.transport.onreadystatechange = Class.empty;
			this.callChain();
		}
	},

	evalScripts: function(){
		if(scripts = this.transport.responseText.match(/<script[^>]*?>[\S\s]*?<\/script>/g)){
			scripts.each(function(script){
				eval(script.replace(/^<script[^>]*?>/, '').replace(/<\/script>$/, ''));
			});
		}
	},

	getTransport: function(){
		if (window.XMLHttpRequest) return new XMLHttpRequest();
		else if (window.ActiveXObject) return new ActiveXObject('Microsoft.XMLHTTP');
	}

});

Ajax.implement(new Chain);

Object.toQueryString = function(source){
	var queryString = [];
	for (var property in source) queryString.push(encodeURIComponent(property)+'='+encodeURIComponent(source[property]));
	return queryString.join('&');
};

Element.extend({

	send: function(options){
		options = Object.extend(options, {postBody: this.toQueryString(), method: 'post'});
		return new Ajax(this.getProperty('action'), options).request();
	},

	toQueryString: function(){
		var queryString = [];
		$A(this.getElementsByTagName('*')).each(function(el){
			$(el);
			var name = el.name || false;
			if (!name) return;
			var value = false;
			switch(el.getTag()){
				case 'select': value = el.getElementsByTagName('option')[el.selectedIndex].value; break;
				case 'input': if ( (el.checked && ['checkbox', 'radio'].test(el.type)) || (['hidden', 'text', 'password'].test(el.type)) ) 
					value = el.value; break;
				case 'textarea': value = el.value;
			}
			if (value) queryString.push(encodeURIComponent(name)+'='+encodeURIComponent(value));
		});
		return queryString.join('&');
	}

});
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//Drag.js - depends on Moo.js + Native Scripts

var Drag = {};

Drag.Base = new Class({
	
	setOptions: function(options){
		this.options = Object.extend({
			handle: false,
			unit: 'px', 
			onStart: Class.empty, 
			onComplete: Class.empty, 
			onDrag: Class.empty,
			xMax: false,
			xMin: false,
			yMax: false,
			yMin: false
		}, options || {});
	},

	initialize: function(el, xModifier, yModifier, options){
		this.setOptions(options);
		this.element = $(el);
		this.handle = $(this.options.handle) || this.element;
		if (xModifier) this.xp = xModifier.camelCase();
		if (yModifier) this.yp = yModifier.camelCase();
		this.handle.onmousedown = this.start.bind(this);
	},

	start: function(evt){
		evt = evt || window.event;
		this.startX = evt.clientX;
		this.startY = evt.clientY;
		
		this.handleX = this.startX - this.handle.getLeft();
		this.handleY = this.startY - this.handle.getTop();
		
		this.set(evt);
		this.options.onStart.pass(this.element, this).delay(10);
		document.onmousemove = this.drag.bind(this);
		document.onmouseup = this.end.bind(this);
		return false;
	},
	
	addStyles: function(x, y){
		if (this.xp){
			var stylex = this.element.getStyle(this.xp).toInt();
		
			var movex = function(val){
				this.element.setStyle(this.xp, val+this.options.unit);
			}.bind(this);
		
			if (this.options.xMax && stylex >= this.options.xMax){
				if (this.clientX <= this.handleX+this.handle.getLeft()) movex(stylex+x);
				if (stylex > this.options.xMax) movex(this.options.xMax);
			} else if(this.options.xMin && stylex <= this.options.xMin){
				if (this.clientX >= this.handleX+this.handle.getLeft()) movex(stylex+x);
				if (stylex < this.options.xMin) movex(this.options.xMin);
			} else movex(stylex+x);
		}
		if (this.yp){
			var styley = this.element.getStyle(this.yp).toInt();

			var movey = function(val){
				this.element.setStyle(this.yp, val+this.options.unit);
			}.bind(this);

			if (this.options.yMax && styley >= this.options.yMax){
				if (this.clientY <= this.handleY+this.handle.getTop()) movey(styley+y);
				if (styley > this.options.yMax) movey(this.options.yMax);
			} else if(this.options.yMin && styley <= this.options.yMin){
				if (this.clientY >= this.handleY+this.handle.getTop()) movey(styley+y);
				if (styley < this.options.yMin) movey(this.options.yMin);
			} else movey(styley+y);
		}
	},

	drag: function(evt){
		evt = evt || window.event;
		this.clientX = evt.clientX;
		this.clientY = evt.clientY;
		this.options.onDrag.pass(this.element, this).delay(5);
		this.addStyles((this.clientX-this.lastMouseX), (this.clientY-this.lastMouseY));
		this.set(evt);
		return false;
	},
	
	set: function(evt){
		this.lastMouseX = evt.clientX;
		this.lastMouseY = evt.clientY;
		return false;
	},
	
	end: function(){
		document.onmousemove = null;
		document.onmouseup = null;
		this.options.onComplete.pass(this.element, this).delay(10);
	}

});

Drag.Move = Drag.Base.extend({

	extendOptions: function(options){
		this.options = Object.extend(this.options || {}, Object.extend({
			onSnap: Class.empty,
			droppables: [],
			snapDistance: 8,
			snap: true,
			xModifier: 'left',
			yModifier: 'top',
			container: false
		}, options || {}));
	},

	initialize: function(el, options){
		this.extendOptions(options);
		this.container = $(this.options.container);
		this.parent(el, this.options.xModifier, this.options.yModifier, this.options);
	},

	start: function(evt){
		if (this.options.container) {
			var cont = $(this.options.container).getPosition();
			Object.extend(this.options, {
				xMax: cont.right-this.element.offsetWidth,
				xMin: cont.left,
				yMax: cont.bottom-this.element.offsetHeight,
				yMin: cont.top
			});
		}
		this.parent(evt);
		if (this.options.snap) document.onmousemove = this.checkAndDrag.bind(this);
		return false;
	},

	drag: function(evt){
		this.parent(evt);
		this.options.droppables.each(function(drop){
			if (this.checkAgainst(drop)){
				if (drop.onOver && !drop.dropping) drop.onOver.pass([this.element, this], drop).delay(10);
				drop.dropping = true;
			} else {
				if (drop.onLeave && drop.dropping) drop.onLeave.pass([this.element, this], drop).delay(10);
				drop.dropping = false;
			}
		}, this);
		return false;
	},

	checkAndDrag: function(evt){
		evt = evt || window.event;
		var distance = Math.round(Math.sqrt(Math.pow(evt.clientX - this.startX, 2)+Math.pow(evt.clientY - this.startY, 2)));
		if (distance > this.options.snapDistance){
			this.set(evt);
			this.options.onSnap.pass(this.element, this).delay(10);
			document.onmousemove = this.drag.bind(this);
			this.addStyles(-(this.startX-evt.clientX), -(this.startY-evt.clientY));
		}
		return false;
	},

	checkAgainst: function(el){
		x = this.clientX+Window.getScrollLeft();
		y = this.clientY+Window.getScrollTop();
		var el = $(el).getPosition();
		return (x > el.left && x < el.right && y < el.bottom && y > el.top);
	},

	end: function(){
		this.parent();
		this.options.droppables.each(function(drop){
			if (drop.onDrop && this.checkAgainst(drop)) drop.onDrop.pass([this.element, this], drop).delay(10);
		}, this);
	}

});

Element.extend({
	
	makeDraggable: function(options){
		return new Drag.Move(this, options);
	},

	makeResizable: function(options){
		return new Drag.Base(this, 'width', 'height', options);
	},
	
	getPosition: function(){
		var obj = {};
		obj.width = this.offsetWidth;
		obj.height = this.offsetHeight;
		obj.left = this.getLeft();
		obj.top = this.getTop();
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	}

});
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//Window.js : additional Window methods - depends on Moo.js + Function.js

var Window = {
	
	extend: Object.extend,
	
	getWidth: function(){
		return window.innerWidth || document.documentElement.clientWidth || 0;
	},
	
	getHeight: function(){
		return window.innerHeight || document.documentElement.clientHeight || 0;
	},
	
	getScrollHeight: function(){
		return document.documentElement.scrollHeight;
	},
	
	getScrollWidth: function(){
		return document.documentElement.scrollWidth;
	},
	
	getScrollTop: function(){
		return document.documentElement.scrollTop || window.pageYOffset || 0;
	},
	
	getScrollLeft: function(){
		return document.documentElement.scrollLeft || window.pageXOffset || 0;
	},
	
	//(c) Dean Edwards/Matthias Miller/John Resig
	//remastered for mootools
	onDomReady: function(init){
		var listen = document.addEventListener;
		var state = document.readyState;
		if (listen) document.addEventListener("DOMContentLoaded", init, false); //moz || opr9
		if (state) { //saf || ie
			document.write('<script id="_ie_load_" defer="true"></script>');
			var scr = $('_ie_load_');
			if (scr.readyState){ //ie
				scr.onreadystatechange = function() {
					if (this.readyState.test(/complete|loaded/)) init();
				};
			} else { //saf
				if (state.test(/complete|loaded/)) init();
				else return Window.onDomReady.pass(init).delay(10);
			}
		} else if (!listen || window.opera && navigator.appVersion.toInt() < 9) { //others
			window.addEvent('init', init);
		}
	}
	
};
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//FxPack.js - depends on Moo.js + Native Scripts + Fx.js

Fx.Scroll = Fx.Base.extend({

	initialize: function(el, options) {
		this.element = $(el);
		this.setOptions(options);
	},
	
	down: function(){
		return this.custom(this.element.scrollTop, this.element.scrollHeight-this.element.offsetHeight);
	},
	
	up: function(){
		return this.custom(this.element.scrollTop, 0);
	},

	increase: function(){
		this.element.scrollTop = this.now;
	}

});

Fx.Slide = Fx.Base.extend({

	initialize: function(el, options){
		this.element = $(el);
		this.wrapper = new Element('div').injectAfter(this.element).setStyle('overflow', 'hidden').adopt(this.element);
		this.setOptions(options);
		this.now = [];
	},
	
	setNow: function(){
		[0,1].each(function(i){
			this.now[i] = this.compute(this.from[i], this.to[i]);
		}, this);
	},
	
	vertical: function(){
		this.margin = 'top';
		this.layout = 'height';
		this.startPosition = [this.element.scrollHeight, '0'];
		this.endPosition = ['0', -this.element.scrollHeight];
		this.mode = 'vertical';
		return this;
	},
	
	horizontal: function(){
		this.margin = 'left';
		this.layout = 'width';
		this.startPosition = [this.element.scrollWidth, '0'];
		this.endPosition = ['0', -this.element.scrollWidth];
		this.mode = 'horizontal';
		return this;
	},
	
	hide: function(mode){
		if (mode) this[mode]();
		else if (this.mode) this[this.mode]();
		else this.vertical();
		this.wrapper.setStyle(this.layout, '0');
		this.element.setStyle('margin-'+this.margin, -this.element['scroll'+this.layout.capitalize()]+this.options.unit);
		return this;
	},
	
	show: function(mode){
		if (mode) this[mode]();
		else if (this.mode) this[this.mode]();
		else this.vertical();
		this.wrapper.setStyle(this.layout, this.element['scroll'+this.layout.capitalize()]+this.options.unit);
		this.element.setStyle('margin-'+this.margin, '0');
		return this;
	},
	
	toggle: function(mode){
		if (this.timer && this.options.wait) return;
		if (mode) this[mode]();
		else if (this.mode) this[this.mode]();
		else this.vertical();
		if (this.wrapper['offset'+this.layout.capitalize()] > 0) return this.custom(this.startPosition, this.endPosition);
		else return this.custom(this.endPosition, this.startPosition);
	},
	
	increase: function(){		
		this.wrapper.setStyle(this.layout, this.now[0]+this.options.unit);
		this.element.setStyle('margin-'+this.margin, this.now[1]+this.options.unit);
	}
	
});

//fx.Color, originally by Tom Jensen (http://neuemusic.com) MIT-style LICENSE.

Fx.Color = Fx.Base.extend({
	
	initialize: function(el, property, options){
		this.element = $(el);
		this.setOptions(options);
		this.property = property;
		this.now = [];
	},

	custom: function(from, to){
		return this.parent(from.hexToRgb(true), to.hexToRgb(true));
	},

	setNow: function(){
		[0,1,2].each(function(i){
			this.now[i] = Math.round(this.compute(this.from[i], this.to[i]));
		}, this);
	},

	increase: function(){
		this.element.setStyle(this.property, "rgb("+this.now[0]+","+this.now[1]+","+this.now[2]+")");
	},

	fromColor: function(color){
		return this.custom(color, this.element.getStyle(this.property));
	},

	toColor: function(color){
		return this.custom(this.element.getStyle(this.property), color);
	}

});
//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//Fx.Utils.js - depends on Moo.js + Native Scripts + Fx.js

Fx.Height = Fx.Style.extend({
	
	initialize: function(el, options){
		this.parent(el, 'height', options);
		this.element.setStyle('overflow', 'hidden');
	},
	
	toggle: function(){
		if (this.element.offsetHeight > 0) return this.custom(this.element.offsetHeight, 0);
		else return this.custom(0, this.element.scrollHeight);
	},
	
	show: function(){
		return this.set(this.element.scrollHeight);
	}
	
});

Fx.Width = Fx.Style.extend({
	
	initialize: function(el, options){
		this.parent(el, 'width', options);
		this.element.setStyle('overflow', 'hidden');
		this.iniWidth = this.element.offsetWidth;
	},
	
	toggle: function(){
		if (this.element.offsetWidth > 0) return this.custom(this.element.offsetWidth, 0);
		else return this.custom(0, this.iniWidth);
	},
	
	show: function(){
		return this.set(this.iniWidth);
	}
	
});

Fx.Opacity = Fx.Style.extend({

	initialize: function(el, options){
		this.parent(el, 'opacity', options);
		this.now = 1;
	},

	toggle: function(){
		if (this.now > 0) return this.custom(1, 0);
		else return this.custom(0, 1);
	},

	show: function(){
		return this.set(1);
	}

});