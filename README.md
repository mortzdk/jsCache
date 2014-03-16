jsCache
=======

jsCache is a javascript library that enables caching of javascripts,
css-stylesheets and images using one of my earlier projects [localStorage
Polyfill](https://github.com/mortzdk/localStorage) as the persistent caching
unit. To obtain the content of the javascript, css, or image files, CORS AJAX
and a canvas trick for images is used. This enables caching of both locally and
cross-origin files, if the right HTTP header `Access-Control-Allow-Origin: *`
is set at the cross-origin. If CORS is not available or something goes wrong
with the caching, the library will automatically fallback to do a normal HTTP
request for the files.

jsCache is especially useful when serving your website for mobile phones as it
will [speed up the loading of your website](http://www.stevesouders.com/blog/2011/03/28/storager-case-study-bing-google/)
and hearby increase the user experience, by providing a better way to cache the
files than the limited HTTP caching available on most mobile phones. jsCache
also speeds up your site in an ordinary webbrowser as it saves HTTP requests
and loads all the different files asynchronously if possible. The asynchronous 
loading make events such as when the DOM is ready and onload fire earlier and 
hearby make faster rendering of the page.

Eventhough all files are attempted to be loaded asynchronously, you still 
have the possibility to load the files in some specific order. This is done 
using the `then` method, which will wait for any earlier loads to terminate 
before executing its callback function. Hearby you can create a hierarchy of
scripts, styles and images and load them as you wish. This is really useful
when you want to load libraries with dependencies, as you can ensure that one
library actually is loaded before using it in another.

#Cross-browser compability

Because of the use of the localStorage polyfill, this library has compability 
for persistent storage in almost all browsers both new and old. More about this
can be seen at in the [README](https://github.com/mortzdk/localStorage) of the 
localStorage polyfill.

When it comes to the support of CORS, the first choice of implementation is the 
XMLHttpRequest version 2, which now adays is supported by every major browser. 
Moreover to support older versions of Internet Explorer, the XDomainRequest is
also used. If none of these are available, the old version of XMLHttpRequest or
the ActiveX versions of AJAX is used. These do not support CORS, so in case of 
such use, only the local files will be cached, while CORS files will be loaded
as a normal asynchronous HTTP request.

![Google Chrome](http://mortz.dk/img/chromium.png) Chrome has support of CORS 
from version 3 and support of XMLHttpRequest from version 1.

![Mozilla Firefox](http://mortz.dk/img/firefox.png) Firefox has support of CORS
from version 3.5 and support of XMLHttpRequest from version 1.

![Internet Explorer](http://mortz.dk/img/ie.png) Internet Explorer has support
of CORS from version 10 using the XMLHttpRequest version 2 and furthermore 
support CORS from version 8 using XDomainRequest. In addition to this there is
support for AJAX using either XMLHttpRequest or ActiveX from version 5.

![Safari](http://mortz.dk/img/safari.png) Safari has support of CORS from 
version 4 and support XMLHttpRequest from version 1.2.

![Opera](http://mortz.dk/img/opera.png) Opera has support of CORS from version 
12 and support XMLHttpRequest from version 7.6.

#Example Usage

In this example, we use the `domReady` method to ensure that the DOM is ready
to be manipulated before doing anything. Next we `detect` if the browser is IE
8 or lower. If so the callback function will be called, i.e. the function
holding an alert is invoked. Next we `load` a lot of files. By having the files
in the same load method, we state that the order of which the files are loaded
are not important and accept that the files are loaded asynchronous. Finally
the `then` method is used to ensure that the earlier loaded files are finished
loading before executing the callback function. This way we ensure that jQuery
is loaded before we use the library to get the firstChild of the element having
the id "logo". In the callback function we load an image, append the attributes
to the image and append the image before the firstChild of the element having
the "logo" id.

```html
<script type="text/javascript">
jsCache.domReady(function () {
	jsCache.detect("if lt IE 9", function () {
		// Include some IE 8 or lower specific code
		alert("IE 8 or lower!");
	}).load(
		// Load bootstrap CSS and CSS fixes for old IE versions
		{url : "//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"},
		{url : "css/bootstrap-round-corners.css", detect : "if lt IE 9"},
		{url : "css/bootstrap-ie7.css", detect : "if lt IE 8"},
		// Load jQuery library
		{url : "//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"}
	).then(function () {
		// Load image and append to element that is gotten by use of jQuery!
		jsCache.load(
			{
				url : "images/jsCache.png", 
				append : $("#logo")[0].firstChild,
				attr : {
					clss : "img-responsive center-block", 
					alt : "jsCache is the most awesome caching tool!", 
					title : "jsCache is the most awesome caching tool!"
				}
			}
		);
	});
});
</script>
```

#jsCache Object Explanation

The jsCache object is defined as follows: 

<pre>
jsCache {
	unsigned long expires;
	unsigned long modified;
	unsigned long timeout; 
	Object get(in DOMString key);
	jsCache load(in Object obj1, in Object obj 2, ...);
	jsCache then(in Function callback);
	jsCache remove(in DOMString key);
	jsCache clear();
	jsCache detect(in DOMString condition, in Function callback);
	void domReady(in Function callback);
};
</pre>

### expires

The `expires` variable determines when the cached files is to expire. The
default value is 5 day i.e. `5*24*60*60*1000` milliseconds. If you wish to
change this, you simply assign a new value to the variable, with a long value
determining the time in milliseconds.

### modified

The `modified` variable determines when any of the files was last modified.
This can be helpful if you have modified some of your local files and wishes to
serve these files instead of an old cached version of the file. Default this
variable is zero, but this can be changed the same way as the expires variable.

### timeout

The `timeout` variable determines when the AJAX call should timeout i.e. when
you have waited too long for loading a file and should instead try to do it the
normal way. This value is default 5 seconds i.e. `5000` milliseconds, but can
be changed the same way as the expires variable.

### get(in DOMString key)

The `get` method is used to get the cached data. This method should always be 
used instead of the get method of the localStorage object, as this method 
appends a string to the key. The method return a file Object containing 
information such as url, type, data, attributes etc.

### load(in Object obj1, in Object obj 2, ...)

The `load` method is used to load files. The method takes an infite amount of
special objects containing information about the files to be loaded. Such an
object have the following structure:

<pre>
Object {
	DOMString url;
	DOMString type;
	boolean cache;
	DOMString detect;
	Object append;
	Object attr;
	DOMString format;
}
</pre>

The object has a lot of different variables available, but the only required 
variable is the `url` variable, which should hold the address of the file to be 
loaded.

The `type` variable is optional. This variable can be used to statically 
determine the type of a file. When loading files, jsCache will dynamically
try to determine the type of the file, but if this variable is set, the file 
will always be handled as the set value.

The `cache` variable is optional. This variable should hold a boolean that
determines whether to cache the file or not. If this variable is not set or is
set to true, jsCache will cache the file. If the variable is set to false, no 
caching will be performed on the file.

The `detect` variable is optional. This variable works the same way as the
`detect` method of the jsCache object i.e. this variable should hold a HTML
conditional comments value. If the condition is true, the file will be loaded.

The `append` variable is optional. This variable should hold an object that you
wish to insert the files before.

The `attr` variable is optional. This variable holds an object of attributes.
These attributes are appended to the file loaded. For example if you wish to
give an image file a title or an alt attribute, you have to specify these in
this object. See the example usage for more information.

The `format` variable is optional. This is a special variable that currently
only should be used when using a image wrapper to get the base64 value of the
image. If such a wrapper is used, the format variable should be assigned the
"base64". In PHP such a wrapper would look something like this:

```php
<?php
$data = base64_encode(file_get_contents("images/jsCache.png"));  
echo("data:image/png;base64," . $data);
?>
```

### then(in Function callback);

The `then` method is used to guarantee that files that has previously been 
served to the `load` method, is fully loaded before the callback function of 
this method is invoked. This is extremely helpful you are dependent on 
libraries or other files.

### remove(in DOMString key);

The `remove` method is used to remove a specific file from the cache. This
method should always be used instead of the get method of the localStorage
object, as this method appends a string to the key.

### clear();

The `clear` method is used to remove all cached files from the cache.

### detect(in DOMString condition, in Function callback);

The `detect` method is another extremely useful method when having to detect if
the browser is Internet Explorer. Most of the time all other browsers than IE
is rendering your website more or less consistently, but as always IE is a pain
that needs special fixes to render your site properly. This method behave in
the same way as the HTML conditional comments and the method should be handled
a string such as `if IE` and a callback function to be called if the condition
is true.

### domReady(in Function callback);

The `domReady` method is used to wait for the DOM to be ready for manipulation.
This is useful when having to manipulate with the DOM as any manipulation 
before this state is not ensured to be successful. It is recommended to always
use this method.
