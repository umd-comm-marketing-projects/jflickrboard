jFlickrBoard
============

jFlickrBoard is a jQuery plugin that retrieves JSON feeds from Flickr and
builds a "flier board" out of the images.

Be aware that the development code -> production code filenames are deceiving. While 
`jflickrboard.jquery.js` only contains the jflickrboard plugin code, `jflickrboard.jquery.min.js`
has minified versions of fancybox, rotate.js, and jflickrboard rolled into one file. The
same goes for jflickrboard.css


## How it do

In a nutshell, here's how the script works:

1. The specified flickr photoset feed is retrieved and parsed.

2. Basic, individual photo information is extracted from this main feed and specific feeds
   for each photo are then loaded in.

3. Once all feeds have been returned they are filtered (optional, defaults to a simple
   date comarison that is explained in more detail below) and then formatted into objects.

4. Photos are then loaded in using data from the formatted feed objects and injected into
   the DOM.


## Le API

```
limit:      number, how many photos to load in
fadeTime:   number, fade duration (milliseconds)
tweenTime:  number, tween duration (milliseconds)
flier:      object, controls individual flier properties
  width:         number, width of each flier
  height:        number, height of each flier
  randomAngles:  bool, should the fliers be rotated randomly?
  randomAnchor:  bool, should the pins be in random locations?
  maxAngle:      number, max swing angle (degrees)?
  vpad:          number, vertical padding for pin
  hpad:          number, horizontal padding for pin
  vrange:        number, up-down variance for pin placement
marker:     object, controls marker (pin) properties
  show:          bool, display the marker?
  sprite:        object, controls marker display properties
     isSprite:      bool, is the image a sprite?
     numSegs:       number, number of images in sprite
  image:         string, path to the marker image
  width:         number, marker width
  height:        number, marker height
flickr:     object, controls API call properties
  thumb:         string, size prefix for the thumbnail. See http://www.flickr.com/services/api/misc.urls.html for options 
  full:          string, size prefix for full image
  baseUrl:       string, API base URL
  params:        object, additional URL parameters
     base:          object, default URL params, override/add here for global effect
     main:          object, params for the main feed
     filter:        object, params for the individual photo feed calls
```


## References / Resources

-Flickr API documentation. The mother of all resources: <http://www.flickr.com/services/api/>
-Image URLs and params: <http://www.flickr.com/services/api/misc.urls.html>
-jFlickrFeed, a very simple, but powerful jQuery Plugin. Watch out for old API code: <http://www.gethifi.com/blog/a-jquery-flickr-feed-plugin>


## Notes / Terms

I don't own [`jQuery`](js/jquery-1.5.2.min.js), [`fancybox`](js/fancybox.jquery.js),
or [`rotate.js`](js/rotate.jquery.js)-- I just put them together to make something cool.
See each file for the respective credits / usage / email-to-send-beer-money-to
