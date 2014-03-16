/*jslint devel: true, white: true, browser: true*/
/*global XDomainRequest: true, ActiveXObject: true, FileReader: true, 
Blob: true*/
(function (w, d, string, object, func, text, css, script, style, javascript,
img, application, stylesheet, link, cache, t, DOMContentLoaded,
readystatechange, loaded, load, complete, get, contenttype, async, js, ifie,
ifgt, iflt, on, msxml2, xmlhttp, error, canvas, twod, src, png, jpg, gif,
svg, image, base64, ttrue, boolt, boolf, nil) {
	"use strict";

	/**
	 * Function that returns object, which can be used to determine the 
	 * filetype or ie version.
	 */
	function Dictionary() {
		var dict = {}, ie = (function () {
			var 
			v = 3, 
			div = d.createElement("div"), 
			all = div.getElementsByTagName("i");

			do {
				v += 1;
				div.innerHTML = "<!--[" + ifgt + " " + v + 
								"]><i></i><![endif]-->";
			} while (all[0]);

    		return v > 4 ? v : 0;
		}());

		/**
		 * Accepted javascript synonyms
		 */
		dict[application + "/" + javascript] = dict[text + "/" + javascript] =
		dict[application + "/x-" + javascript] = dict["." + js] = dict[js] = 
		dict[javascript] = dict[script] = js;
		
		/**
		 * Accepted css synonyms
		 */
		dict[text + "/" + css] = dict[css] = dict["." + css] = 
		dict[stylesheet] = dict[style] = css;

		/**
		 * Accepted pictures
		 */
		dict[png] = dict["." + png] = dict[image + "/" + png] = dict[jpg] = 
		dict["." + jpg] = dict[image + "/" + jpg] = dict[image + "/" + gif] = 
		dict[gif] = dict["." + gif] = dict[image + "/" +svg] = 
		dict["." + svg] = dict[svg] = img;

		/**
		 * IE versioning check
		 */
		dict[ifie] = (ie > 4);
		dict[iflt + " 9"] = (ie && ie < 9);
		dict[iflt + " 8"] = (ie && ie < 8);
		dict[iflt + " 7"] = (ie && ie < 7);
		dict[iflt + " 6"] = (ie && ie < 6);
		dict[ifgt + " 6"] = (ie > 6);
		dict[ifgt + " 7"] = (ie > 7);
		dict[ifgt + " 8"] = (ie > 8);
		dict[ifgt + " 9"] = (ie > 9);
		dict[ifie + " 9"] = (ie === 9);
		dict[ifie + " 8"] = (ie === 8);
		dict[ifie + " 7"] = (ie === 7);
		dict[ifie + " 6"] = (ie === 6);
		dict[ifie + " 5"] = (ie === 5);
		
		return dict;
	}

	/**
	 * Queue.js
	 *
	 * A function to represent a queue
	 * 
	 * Created by Stephen Morley - http://code.stephenmorley.org/ - and 
	 * released under the terms of the CC0 1.0 Universal legal code:
	 * 
	 * http://creativecommons.org/publicdomain/zero/1.0/legalcode
	 * 
	 */
	function Queue(){
		var 
		a=[], 
		b=0;
		
		this.getLength = function () {
			return(a.length-b);
		};
		
		this.isEmpty = function () {
			return(a.length===0);
		};

		this.enqueue = function (c) {
			a.push(c);
		};

		this.dequeue = function () {
			var c;
			if (a.length === 0) {
				return undefined;
			}
			c = a[b];
			b += 1;
			if ((b*2) >= a.length){
				a = a.slice(b);
				b = 0;
			}
			return c;
		};

		this.peek = function () {
			return(a.length>0?a[b]:undefined);
		};
	}

	var 
	head = d.getElementsByTagName("head")[0].lastChild, 
	scriptArray = d.getElementsByTagName(script), 
	scripts = scriptArray[scriptArray.length-1], 
	queue = new Queue(),
	dict = new Dictionary(), 
	determine = function (obj) {
		return dict[obj.type] || dict[obj.url.match(/\.[^.]+$/)[0]];
	},

	/** 
	 * Cross browser object, which has a lot of cross browser functionalities.
	 */
	cross = {
		/**
		 * Function to determine if DOM is ready to be manipulated.
		 */
		domReady : function (cb) {
			var timer, change, ready, clear, done = boolf;

			if (typeof cb === func || typeof cb === object) {
				/* Clear timer */
				clear = function () {
					clearInterval(timer);
					timer = nil;
				};

				/* Called when DOM is ready. Will remove all listeners and 
				   callback initial function */
				ready = function () {
					done = boolt;
					clear.call(this);
					cross.removeListener(d, DOMContentLoaded, change);
					cross.removeListener(d, readystatechange, change);
					cross.removeListener(w, load, change);
					cb.call(this);
				};

				/* Checks if DOM is ready */
				change = function (evt) {
					if (!done) {
						if (evt && evt.type === DOMContentLoaded) {
							ready.call(this);
						} else if (evt && evt.type === load) {
							ready.call(this);
						} else if (d.readyState) {
							if (d.readyState === loaded || 
								d.readyState === complete) {
								ready.call(this);
							} else if (!!d.documentElement.doScroll) {
								try {
									d.documentElement.doScroll("left");
								} catch (exc) {
									return;
								}
								ready.call(this);
							}
						}
					} else {
						clear.call(this);
					}
				};

				/* Initialize event listeners and timers that will determine 
				   if DOM is ready */
				cross.setListener(d, DOMContentLoaded, change);
				cross.setListener(d, readystatechange, change);
				cross.setListener(w, load, change);
				timer = setInterval(change, 1);
			}
		}, cors : function (time) {
			var xdr = nil, 

			/**
			 * Function that returns a XHR object and if XDomainRequest is 
			 * available, store such an object in the xdr variable.
			 */
			XHR = function () {
				var obj = nil;
				try {
					obj = new XMLHttpRequest();
					if (obj.withCredentials) {
						return obj;
					}
				} catch (ignore){}
				try {
					xdr = new XDomainRequest();
				} catch (ignore){}
				try {
					if (obj) {
						return obj;
					}
				} catch (ignore){}
				try {
					return new ActiveXObject(msxml2 + "." + xmlhttp + ".6.0");
				} catch (ignore){}
				try {
					return new ActiveXObject(msxml2 + "." + xmlhttp + ".3.0");
				} catch (ignore){}
				try {
					return new ActiveXObject("Microsoft." + xmlhttp);
				} catch (ignore){}

				return nil;
			}, 

			/**
			 * Function that does the actual request
			 */
			ajax = function (obj, success, err) {
				var url, timer, xhr = XHR.call(this), source = obj,

				/* Aborts the xhr request, clear timer and do error callback */
				clear = function () {
					xhr.abort();
					clearTimeout(timer);
					err.call(this, source);
				},
			
				/* Function that is called when the XHR request was 
				   successfull */
				succ = function (response, type) {
					clearTimeout(timer);
					success.call(
						this,
						source,
						response, 
						type
					);
				};

				/* If we were not able to create xhr object, we do error 
				   callback */
				if (!xhr) {
					err.call(this, source);
					return;
				}				

				/* If URL has "//" as its protocol, we substitute with the 
				   protocol of the current site, to prevent IE 7 form failing */
				if (source.url.match(/^(\/\/)/)) {
					if (w.location.protocol) {
						url = w.location.protocol + source.url;
					} else if (d.protocol) {
						url = d.protocol + source.url;
					}
				} else {
					url = source.url;
				}

				/* We try to use XDomainRequest request and fallback to XHR 
				   request, if XDomainRequest was not available */
				try {
					/* Tests whether XDomainRequest is available and that the
					   URL is external, in which case it is best to use 
					   XDomainRequest. Else we throw an error which basically
					   enables us to use XHR instead */
					if (xdr && source.url.match(/^(http|https|\/\/)/)) {
						xdr.open(get, url);
						xhr = xdr;
					} else {
						throw new URIError(
							"Local URI, use XMLHttpRequest or ActiveXObject"
						);
					}
				} catch (e0) {
					/* Trying to use XHR. If that fails we do error callback */
					try {
						xhr.open(get, url, boolt);
					} catch (e1) {
						err.call(this, source);
						return;
					}
				}
				
				/* If we try to load an image we use arraybuffer as 
				   responsetype to get the binary data */
				if ( determine(source) === img && 
					 (!source.format || source.format !== base64) ) {
					try {
						xhr.responseType = "arraybuffer";
					} catch (exc) {
						err.call(this, source);
						return;
					}
				}

				/* Sets timeout of XHR to the choosen timeout of jsCache */
				try {
					xhr.timeout = time;
				} catch (ignore){}

				/* If XHR times out, we do error callback */
				try {
					xhr.ontimeout = clear;
				} catch (ignore) {}

				/* Tests whether do make listeners for XDR or XHR */
				if (xdr && source.url.match(/^(http|https|\/\/)/)) { 
					xhr.onload = function () {
						succ.call(
							this, 
							xhr.responseText,
							xhr.contentType
						);
					};
					xhr.onerror = clear;
					xhr.onprogress = function () {};
				} else {
					xhr.onreadystatechange = function () {
						var blob, filereader;
						if (xhr.readyState === 4) {
							/* Test whether the HTTP status code is successfull
							   or cache */
							if ((xhr.status >= 200 && xhr.status < 300) || 
								xhr.status === 304) {
								/* If we have successfully loaded and image, we
								   need to run it through a FileReader. Else
								   we can just callback our succ function */
								if ( determine(source) === img && 
									 (!source.format || 
									 source.format !== base64) ) {
									try {
										filereader = new FileReader();
										blob = new Blob(
											[xhr.response], 
											{type: image + "/" + png}
										);
										/* Chrome doesn't support 
										   addEventListener so no reason to 
										   use setAttribute from cross 
										   object */
										filereader.onload = function (e) {
											succ.call(
												this,
												e.target.result,
												xhr.getResponseHeader(
													contenttype
												)
											);
										};
										filereader.readAsDataURL(blob);
									} catch (ecx) {
										clear.call(this);	
									}
								} else {
									succ.call(
										this,
										xhr.responseText, 
										xhr.getResponseHeader(contenttype)
									);
								}
							} else {
								clear.call(this);
							}
						}
					};
				}
				/* Set secondary timeout function because of poor supported 
				   timeout event handlers in xhr */ 
				timer = setTimeout(clear, time);

				/* Send request */
				xhr.send(nil);
			};

			return {
				request : function (obj, success, err) {
					ajax.call(this, obj, success, err);
				}
			};
		}, removeListener : function (elm, act, cb) {
			if (elm.removeEventListener) {
				elm.removeEventListener(act, cb, boolf);
			} else if (elm.detachEvent) {
				elm.detachEvent(on+act, cb);
			} else {
				act = on+act;
				elm[act] = nil;
			}
		}, setListener : function (elm, act, cb) {
			if (elm.addEventListener) {
				elm.addEventListener(act, cb, boolf);
			} else if (elm.attachEvent) {
				elm.attachEvent(on+act, cb);
			} else {
				act = on+act;
				if (typeof (elm[act]) === func) {
					cb = (function (f1, f2) {
						f1.apply(this, arguments);
						f2.apply(this, arguments);
					}(cb, elm[act]));
				}
				elm[act] = cb;
			}
		}, setAttribute : function (elm, att, name) {
			if (elm.setAttribute) {
				elm.setAttribute(att, name);
			} else if (elm.attributes) {
				elm.attributes[att] = name;
			} else if (elm.createAttribute) {
				elm.createAttribute(att, name);
			} else {
				elm[att] = name;
			}
		}, isCanvasSupported : function () {
			var elm = d.createElement(canvas);
			return !!(elm.getContext && elm.getContext(twod));
		}
	}, 
	
	/**
	 * jsCache function that creates the jsCache object
	 */
	jsCache = function () {
		var tmp, prefix = cache + "_", 

		/**
		 * Array holding the filenames that we are currently loading.
		 */
		loading = [], 
	
		/**
		 * Function to handle onload events of loaded files. What it basically
		 * does is removing the filename matching the paramater key from the 
		 * array.
		 */
		onload = function (key) {
			var i;
			for (i = loading.length-1; i > -1; i -= 1) {
				if ( 
					 (typeof loading[i] === string && loading[i] === key) ||
					 (typeof loading[i] === object && loading[i].url === key) 
				   ) {
					loading.splice(i, 1);
					break;
				}
			}
		}, 

		/**
		 * Creates all attributes given by the attr object an appending them 
		 * to elm. If elm is not there, a string with attributes are returned
		 */
		makeAttributes = function (attr, elm) {
			var att, attributes = "", name;
			if (attr && typeof attr === object) {
				for (att in attr) {
					if (attr.hasOwnProperty(att)) { 
						name = att;
						if (att === "className" || att === "clss" || 
							att === "cls") {	
							name = "class";
						}
						if (elm) {
							cross.setAttribute(elm, name, attr[att]);
						}
						attributes += name + "='" + attr[att]  + "' ";
					}
				}
			}
			return attributes;
		},
	
		/** 
		 * Function to test whether cached data has expired
		 */
		expired = function (obj) {
			return (obj.expire < new Date().getTime() || 
					w.jsCache.modified > obj.timestamp);
		}, 
		
		/**
		 * Function to check if the files has finished loading.
		 */
		ready = function(obj, url, cb) {
			/* If element has the readyState attribute we use the 
			   onreadystatechange event handler, but not in the case where
			   it is Opera, as Opera handles onreadystatechange bad. Else we
			   use the onload event handler. */
			if (obj.readyState && !w.opera) {
				obj.onreadystatechange = function () {
					if (this.readyState === loaded || 
						this.readyState === complete) {
						this.onreadystatechange = nil;
						cb.call(this, url);
					}
				};
			} else {
				cross.setListener(obj, load, function () {
					cb.call(this, url);
				});
			}	
		}, 
		
		/**
		 * Function that loads scripts asynchronously from an URL or loads
		 * script from the cache given by the obj.data attribute.
		 */
		loadScript = function (obj, cb) {
			var sc = nil, source = obj, attributes = "";
			try {
				/* If attributes has been defined for the wished object, we
				   append them to the script */
				attributes = makeAttributes(source.attr);
				
				/* If script wasn't in the cache, we load it asynchronously */
				if (!source.data) {
					attributes += async + "='" + ttrue + "' ";
				}

				sc = d.createElement(
					"<" + script + " " + t + "='" + text + "/" + javascript + 
					"' " + attributes + src + "='" + 
					source.url + "'>"
				);
			} catch (e) {
				sc = d.createElement(script);
				cross.setAttribute(sc, t, text + "/" + javascript);

				/* If script wasn't in the cache, we load it asynchronously */
				if (!source.data) {
					cross.setAttribute(sc, async, ttrue);
					cross.setAttribute(sc, src, source.url);
				}

				/* If attributes has been defined for the wished object, we
				   append them to the script */
				makeAttributes(source.attr, sc);
			} finally {
				if (sc) {

					/* If script wasn't in cache, we need event handlers to 
					   determine, when the script is loaded. Else we just apply
					   the cached data to the script, which make it load 
					   immediately. */
					if (!source.data) {
						ready(sc, source.url, cb);
					} else {
						try {
							sc.insertBefore(d.createTextNode(source.data), sc.firstChild);
						} catch (e) {
							sc.text = source.data;
						}
					}

					/* Appending the script to the DOM */
					if (source.append && typeof source.append === object) {
						source.append.parentNode.insertBefore(sc, source.append);
					} else {
						scripts.parentNode.insertBefore(sc, scripts.nextSibling);
					}

					/* If script was cached we need to callback to remove the
					   script from our loading array */
					if (source.data) {
						cb.call(this, source.url);
					}
				}
			}
		}, 
	
		/**
		 * Function that loads stylesheet from URL or cache.
		 */
		loadStyle = function (obj, cb) {
			var st = nil, source = obj;

			/* If stylesheet was not in cache, we load it from URL. Else we 
			   load the stylesheet from cache, and create a style tag to hold
			   the stylesheet */
			if (!source.data) {
				try {
					/* IE way of loading stylesheet from url. As this is the 
					   only way to load and render stylesheets in IE, we have
					   to accept that we cannot apply any additional attributes
					   to the object, as the createStyleSheet function 
					   automatically appends the stylesheet to the DOM */
					st = d.createStyleSheet(source.url);
					cb.call(this, source.url);
					return;
				} catch (e) {
					/* Creating link tag */
					st = d.createElement(link);

					/* Append attributes to link */
					cross.setAttribute(st, t, text + "/" + css);
					cross.setAttribute(st, "rel", stylesheet);
					cross.setAttribute(st, "href", source.url);
					cross.setAttribute(st, "media", "all");

					/* If attributes has been defined for the wished object, we
					   append them to the style */
					makeAttributes(source.attr, st);
				} 

				if (st) {
					/* If style wasn't in cache, we need event handlers to 
					   determine, when the style is loaded. */
					ready(st, source.url, cb);			

					/* Append the styles to the DOM */
					if (source.append && typeof source.append === object) {
						source.append.parentNode.insertBefore(st, source.append);
					} else {
						head.parentNode.insertBefore(st, head);
					}
				}
			} else {
				/* Creating style tag */
				st = d.createElement(style);

				/* Append type attribute to style */
				cross.setAttribute(st, t, text + "/" + css);

				/* If attributes has been defined for the wished object, we
				   append them to the style */ 
				makeAttributes(source.attr, st);

				/* Append the styles to the DOM */
				if (source.append && typeof source.append === object) {
					source.append.parentNode.insertBefore(st, source.append);
				} else {
					head.parentNode.insertBefore(st, head);
				}
				
				/* If IE we use cssText of the styleSheet object to render the
				   css. Else we just insert the text as a textnode */
				if (st.styleSheet) {
					st.styleSheet.cssText = source.data;
				} else {
					st.insertBefore(d.createTextNode(source.data), st.firstChild);
				}

				/* If script was cached we need to callback to remove the
				   script from our loading array */
				cb.call(this, source.url);
			}
		}, 
		
		/**
		 * Function that loads image from URL or cache.
		 */
		loadImg = function(obj, cb) {
			var elm = new Image(), timer, source = obj, done = boolf,

			/* Function called when the image has been loaded */
			succ = function (elm) {
				var can, con;
				done = boolt;
				clearInterval(timer);
				timer = nil;
				if (source.data && elm.src !== source.data && 
					cross.isCanvasSupported()) {
					can = d.createElement(canvas);
					con = can.getContext(twod);
					con.drawImage(elm, 0, 0);	
				}
				cb.call(this, source.url);			
			};	

			/* Onload event handler */
			cross.setListener(elm, load, function () {
				if (!done) {
					succ.call(this, this);
				}
			});

			/* Onerror event handler */
			cross.setListener(elm, error, function () {
				if (!done) {
					if (source.data && source.url !== this.src) {
						cross.setAttribute(this, src, source.url);
					} else {
						succ.call(this, this);
					}
				}
			});

			/* Setting source of the image */
			if (!source.data) {
				cross.setAttribute(elm, src, source.url);
			} else {
				cross.setAttribute(elm, src, source.data);
			}
			
			/* If attributes has been defined for the wished object, we
			   append them to the image */
			makeAttributes(source.attr, elm);

			/* Append the image to the DOM */
			if (source.append && typeof source.append === object) {
				source.append.parentNode.insertBefore(elm, source.append);
			} else {
				d.body.insertBefore(elm, d.body.lastChild.nextSibling);
			}

			/* Setting timer interval to check if image is loaded as well */	
			timer = setInterval(function () {
				if ( !elm.complete || 
					 (elm.naturalWidth && elm.naturalWidth === 0) ) {
					return;
				}

				if (!done) {
					succ.call(this, elm);
				}
			}, 10);
		}, 
		
		/**
		 * Function that adds data to cache 
		 */
		add = function (obj) {
			var i, prefkey, key, item, jsonObj, append;
			if (obj.url && typeof obj.url === string && w.localStorage) {
				/* If everything goes well, we stringify our object and store
				   it in cache. Else we look for data that has expired to 
				   remove it */
				try {
					append = obj.append;
					try {
						delete obj.append;
					} catch (e) {
						obj.append = nil;
					}
					jsonObj = JSON.stringify(obj);
					w.localStorage.setItem(
						prefix + obj.url, 
						jsonObj	
					);
					obj.append = append;
				} catch (exc) {
					/* localStorage polyfill are throwing exception names that
					   contains the word "quota" or if IE "Error", when the 
					   storage is full */
					if (exc.name.match(/quota/i) || exc.name === "Error") {
						/* Loop through all elements in cache an delete them
						   if they are expired */
						for (i = w.localStorage.length-1; i > -1; i -= 1) {
							prefkey = w.localStorage.key(i);

							if (prefkey) {
								key = prefkey.split(prefix)[1];
							}

							if (key) {
								item = w.jsCache.get(key);	
								if (!item || !(item.url === key) || expired(item)) {
									w.jsCache.remove(key);
									if (JSON.stringify(item).length > jsonObj.length) {
										add(obj);
										break;
									}
								}
								item = nil;
							}
							key = nil;
							prefkey = nil;
						}
					}
				}
			}
		}; 

		/* If there isn't a native JSON object, we apply one */
		if (!w.JSON) {
			tmp = "//cdnjs.cloudflare.com/ajax/libs/json2/20130526/json2.min.js";
			loading.push(tmp);
			loadScript({url : tmp}, onload);
		}

		if (!w.localStorage) {
			/* Load SWFObject, to allow flash storage in our localStorage wrapper */
			if (!w.swfobject) {
				tmp = "//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js";
				loading.push(tmp);
				loadScript({url : tmp}, onload);
			}

			/* Load localStorage, to wrap the localStorage object */
			tmp = "localStorage.min.js";
			loading.push(tmp);
			loadScript({url : tmp}, onload);
		}

		return {
			/** 
			 * When should the cached data expire.
			 *
			 * Default: 5 day
			 */
			expires : (5 * 24 * 60 * 60 * 1000),

			/**
			 * When should script loading timeout.
			 *
			 * Default: 5 seconds
			 */
			timeout : 5000,

			/**
			 * If some of the cached files have been modified a timestamp 
			 * indicating when the modification was made, should be stored 
			 * in this variable, before any loading from the cache.
			 *
			 * Default: 0
			 */
			modified : 0,

			/**
			 * Function that gets cached data.
			 *
			 * @key [string] (String associated with some data)
			 */
			get : function (key) {
				var obj = nil;
				if (key && typeof key === string && w.localStorage) {
					try {
						obj = JSON.parse(w.localStorage.getItem(prefix + key));
						if (!obj || !(obj.url === key) || expired(obj)) {
							w.localStorage.removeItem(prefix + key);
							obj = nil;
						}
					} catch (ignore) {}
				}
				return obj;
			},

			/**
			 * Function that loads scripts and stylesheets
			 *
			 * @arguments [object, ..., object] (Object containing as minimum 
			 * 									 a url property)
			 */
			load : function () {
				var i, source, obj, elm, cors = new cross.cors(this.timeout),
				/* Function to be called when we wish to load or insert script */
				insert = function (obj) {
					var type = determine(obj);
					if (type) {
						if (type === js) { 
							loadScript.call(this, obj, onload);
						} else if (type === css) {
							loadStyle.call(this, obj, onload);
						} else if (type === img) {
							loadImg.call(this, obj, onload);
						}
					}
				};

				if (arguments.length > 0 && w.localStorage) {
					/* Loops through all arguments */
					for (i = arguments.length-1; i > -1; i -= 1) {
						source = arguments[i]; 
						/* If we have a valid argument */
						if ( source && typeof source === object && source.url && 
							 ( !source.detect || dict[source.detect]) ) {
							loading.push(source.url);
							obj = this.get(source.url);
							/* If the argument was stored in cache we insert 
							   it directly */
							if (obj) {
								if (source.append) {
									obj.append = source.append;
								}
								insert.call(
									this, 
									obj 
								);
							/* If the cache argument is set to false, we do 
							   not cache it */
							} else if (typeof source.cache === "boolean" && 
								!source.cache) {
								insert.call(
									this,
								source	
								);
							/* Else we request the arguments data with CORS 
							   and insert it */
							} else {
								try {
									/* If an image is requested, canvas is 
									   supported, and format isn't base64 */
									if (determine(source) === img &&
										cross.isCanvasSupported() &&
										(!source.format || source.format !== base64)) {
										elm = new Image();

										/* If crossOrigin attribute is 
										   supported on images and we have an
										   external URL */
										if (elm.crossOrigin && 
											source.url.match(/^(http|https|\/\/)/) ) {
											elm.crossOrigin = "anonymous";
										}

										/* Onload handler for image, that cache
										   the image an applying it to the DOM
										   by calling insert function */
										cross.setListener(elm, load, function () {
											var can = d.createElement(canvas),
                							con = can.getContext(twod),
											now = new Date().getTime();

											can.width = this.width;
											can.height = this.height;

											con.drawImage(
												this, 
												0, 
												0, 
												this.width, 
												this.height
											);
											
											source.data = can.toDataURL(
												image + "/" + png
											);
											source.type = png;
											source.expire = now + w.jsCache.expires;
											source.timestamp = now;
											add(source);
											insert.call(
												this, 
												source	
											);
										});

										/* Applying source to image */
										cross.setAttribute(elm, src, source.url);
									} else {
										/* If we do not have and image with the
										   required conditions, we fallback to 
										   CORS */
										throw {
											name : "CORSExpectedException",
											message : "CORS should be used"
										};
									}
								} catch (e) {
									cors.request(
										source, 
										/* If successfully loaded, we store it 
										   in cache */
										function (obj, data, type) {
											var now = new Date().getTime();
											obj.data = data;
											obj.type = obj.type || type;
											obj.expire = now + w.jsCache.expires;
											obj.timestamp = now;
											add(obj);
											insert.call(
												this, 
												obj 
											);
										},
										/* Else we just insert the argument 
										   asynchronously */
										function (obj) {
											insert.call(
												this, 
												obj
											);
										}
									);	
								}
							}
						}
					}
					queue.dequeue();
				}
				return this;
			},

			/**
			 * Function that waits for previous loaded files to be loaded
			 *
			 * @cb [function] (Function to call when previous files are loaded)
			 */
			then : function (cb) {
				var timer;
				queue.enqueue(cb);	
				setTimeout(function () {
					timer = setInterval(function () {
						if (queue.peek() === cb && loading.length === 0) {
							clearInterval(timer);
							cb.call(this);
						}
					}, 10);
				}, 1);
			},

			/**
			 * Remove cached data associated with the key
			 *
			 * @key [string] (String associated with some data)
			 */
			remove : function (key) {
				if (key && typeof key === string && w.localStorage) {
					try {
						w.localStorage.removeItem(prefix + key);
					} catch (ignore) {}
				}
				return this;
			},

			/**
			 * Delete the whole cache
			 */
			clear : function () {
				var i, key, prefkey;
				if (w.localStorage) {
					try {
						for (i = w.localStorage.length-1; i > -1; i -= 1) {
							prefkey = w.localStorage.key(i);

							if (prefkey) {
								key = prefkey.split(prefix)[1];
							}

							if (key) {
								this.remove(key);
							}

							prefkey = nil;
							key = nil;
						}
					} catch (ignore) {}
				}
				return this;
			},

			/**
			 * Detect specific IE versions.
			 *
			 * @cond [string] (Should be the same as traditionally IE version comment detection)
			 * @cb [function] (Function to call if condition is hold)
			 */
			detect : function(cond, cb) {
				if (dict[cond]) {
					cb.call(this);
				}
				return this;
			},

			/**
			 * Detect if DOM is ready for manipulation
			 *
			 * @cb [function] (Function to call when DOM is ready)
			 */
			domReady : function (cb) {
				cross.domReady(function () {
					if (w.swfLoaded) {
						w.swfLoaded(cb);
					} else {
						cb.call(this);
					}
				});
			}
		};
	};

	if (!w.jsCache) {
		w.jsCache = new jsCache();
	}

}(window, window.document, "string", "object", "function", "text", "css", 
  "script", "style", "javascript", "img", "application", "stylesheet", "link", 
  "jsCache", "type", "DOMContentLoaded", "readystatechange", "loaded", "load", 
  "complete", "GET", "Content-Type", "async", "js", "if IE", "if gt IE", 
  "if lt IE", "on", "Msxml2", "XMLHTTP", "error", "canvas", "2d", "src", "png", 
  "gif", "jpg", "svg", "image", "base64", "true", true, false, null));
