/*
 * jFlickrBoard - A Flickr powered flier board
 * @author Kyle Smith <knksmith57@gmail.com>
 * @version 1.1
 *
 * Flickr refereces / resources:
 * -Flickr API documentation. The mother of all resources:
 *    http://www.flickr.com/services/api/
 *
 * -Image URLs and params: 
 *    http://www.flickr.com/services/api/misc.urls.html
 *
 * -jFlickrFeed, a very simple, but powerful jQuery Plugin. Watch out for old API code:
 *    http://www.gethifi.com/blog/a-jquery-flickr-feed-plugin
 *
 * -----------------------------   API   -----------------------------
 * limit:      number, how many photos to load in
 * fadeTime:   number, fade duration (milliseconds)
 * tweenTime:  number, tween duration (milliseconds)
 * flier:      object, controls individual flier properties
 *    width:         number, width of each flier
 *    height:        number, height of each flier
 *    randomAngles:  bool, should the fliers be rotated randomly?
 *    randomAnchor:  bool, should the pins be in random locations?
 *    maxAngle:      number, max swing angle (degrees)?
 *    vpad:          number, vertical padding for pin
 *    hpad:          number, horizontal padding for pin
 *    vrange:        number, up-down variance for pin placement
 * marker:     object, controls marker (pin) properties
 *    show:          bool, display the marker?
 *    sprite:        object, controls marker display properties
 *       isSprite:      bool, is the image a sprite?
 *       numSegs:       number, number of images in sprite
 *    image:         string, path to the marker image
 *    width:         number, marker width
 *    height:        number, marker height
 * flickr:     object, controls API call properties
 *    thumb:         string, size prefix for the thumbnail. See http://www.flickr.com/services/api/misc.urls.html for options 
 *    full:          string, size prefix for full image
 *    baseUrl:       string, API base URL
 *    params:        object, additional URL parameters
 *       base:          object, default URL params, override/add here for global effect
 *       main:          object, params for the main feed
 *       filter:        object, params for the individual photo feed calls
 * 
 */

(function($, undefined) {
	$.fn.jflickrboard = function(settings,filterFn,callback) {
      settings = $.extend(true, {
			limit: 5,
         fadeTime: 1000,
         tweenTime: 500,
         flier: {
            width: 160,
            height: 160,
            randomAngles: true,
            randomAnchor: true,
            maxAngle: 10,
            vpad: 10,
            hpad: 10,
            vrange: 10
         },
         marker: {
            show: true,
            sprite: {
               isSprite: true,
               numSegs: 2 
            },
            image:  "css/pins_small_mb.png",
            width: 18,
            height: 47 
         },
         flickr: {
            thumb: 'm',
            full: 'z',
            baseUrl: 'http://api.flickr.com/services/rest/', 
            params: {
               base: {
                  api_key: '4cde7515c71dd4aec55a779ccea24dce',
                  format: 'json',
                  lang: 'en-us',
                  jsoncallback: '?'
               },
               main: {
                  method: 'flickr.photosets.getPhotos',
                  photoset_id: '72157626553413058', //'72157625849370500',
               },
               filter: {
                  method: 'flickr.photos.getInfo'
               }
            },
         },      	
      }, settings);
      
      var fns = {

         /*
          * getOrigin
          * Creates a random origin for the marker based on set flier properties
          * @return {Origin Object}
          */
         getOrigin: function() {
            return {
            'top': (settings.flier.height / 2) - settings.flier.vpad - (Math.round(Math.random() * settings.flier.vrange)),
            'left': (settings.flier.width / 2) - settings.flier.hpad - (Math.round(Math.random() * settings.flier.hrange))
            }; 
         },

         /*
          * getAngle 
          * Creates a random angle (degrees) limited by
          * the maxAngle setting. We use this for random image rotations 
          * @return {number}
          */
         getAngle: function() {
            return Math.random()*(2*settings.flier.maxAngle + 1) - settings.flier.maxAngle; 
         },

         /*
          * addPhoto
          * Takes basic photo info and creates a flier in the DOM.
          * @param {string} thumbURL URL for the thumbnail image
          * @param {string} fullURL URL for the full image
          * @param {string} desc Text or raw HTML for flier description
          */
         addPhoto: function(thumbURL,fullURL,desc) {
            var img, pin, a, wrapper, li, origin = fns.getOrigin();

            img = document.createElement('img');
            img.src = thumbURL;

            $(img)
            .hide()
            .width(settings.flier.width)
            .load(function() {
               $(this).fadeIn(settings.fadeTime, function() {
                  $(this).parent().css('background-image', 'none'); // remove the loader image
               });
            });
            
            pin = $('<div class="pin"></div>')
            .css({
               'width': settings.marker.width,
               'height': settings.marker.sprite.segHeight,
               'top': (settings.flier.height / 2) - (settings.marker.sprite.segHeight / 2),                   
               'left': (settings.flier.width / 2) - (settings.marker.width / 2), 
               'background-image': 'url(' + settings.marker.image + ')',
               'background-position': function() {
                  return '0px' + ' -' + Math.floor(Math.random() * settings.marker.sprite.numSegs) * 
                     settings.marker.sprite.segHeight + 'px';
               }
            });

            a = $('<a />')
            .attr({
               'href': fullURL
            })
            .css({
               'top' : origin.top.toString() + 'px',
               'left' : origin.left.toString() + 'px',
            }).append(img);
            
            // Store the description (if it exists)
            $.data(a[0], 'desc', desc);

            wrapper = $('<div class="wrapper"></div>').append(a);
            
            li = $('<li />')
            .css({
               'top' : (origin.top*(-1)).toString() + 'px',
               'left' : (origin.left*(-1)).toString() + 'px'
            })
            .append(pin).append(wrapper);

            if(settings.flier.randomAngles) {

               var rot = fns.getAngle();

               wrapper.data('rot',rot);
               wrapper.rotate(rot);
               
               wrapper
               .hover(function() {
                  $(this) 
                  .css('z-index', 10)
                  // Probably need some browser checking in here for the
                  // animations
                  .rotate({
                     animateTo: 0,
                     duration: settings.tweenTime
                  });
               }, function() {
                  $(this)
                  .css('z-index', 1)
                  .rotate({
                     animateTo: $(this).data('rot'),
                     duration: settings.tweenTime
                  });
               });
            } 

            root.append(li);
         }
      },
      
      /*
       * filter
       * Takes data returned from a API response and applies a filter.
       * A formatted photo object is returned that must contain URLs for
       * thumb and full images, as well as a description.
       * @param {object} photo info API response object
       * @param {string} thumbPrefix Flickr image size prefix
       * @param {string} fullPrefix Flickr image size prefix
       * @return {Photo Object | bool}
       */
      var filter = filterFn || function(info, thumbPrefix, fullPrefix) {
         var base = 'http://farm' + info.farm + '.static.flickr.com/' + info.server + '/' + info.id + '_' + info.secret + '_',
             desc = info.description._content,
             reg = /^\d\d[-/]\d\d[-/]\d\d\d\d\s?/, 
             expire = new Date(); 

         if(reg.test(desc)) {
            expire = new Date(reg.exec(desc)[0]);
            desc = desc.replace(reg, "");  
         }

         return expire >= new Date() ? 
            {
               thumb: base + thumbPrefix + '.jpg', 
               full: base + fullPrefix + '.jpg',
               desc: desc == '' ? undefined : desc
            } : false;           
      };
      
      var root,total=0,loaded=0,url = settings.flickr.baseUrl + '?',murl,furl;
      
      // Limit the number of results to the set limit
      settings.flickr.params.main.per_page = settings.limit;
      
      // Calculate flier position bounds
      settings.flier.hrange = settings.flier.hrange || settings.flier.width - (2 * settings.flier.hpad);
      
      // Setup the marker 
      if(settings.marker.sprite.isSprite) {
         settings.marker.sprite.segHeight = settings.marker.sprite.segHeight 
            || Math.round(settings.marker.height/settings.marker.sprite.numSegs); 
      }
      
      // Build the base URL for retrieving feeds 
		for(var key in settings.flickr.params.base) {
			url += '&' + key + '=' + settings.flickr.params.base[key];
		}  
      
      // Build specific URL for main feed 
      murl = url;
      for(var key in settings.flickr.params.main) {
			murl += '&' + key + '=' + settings.flickr.params.main[key];
      }
      
      // Build specific URL for filter feed 
      furl = url;
      for(var key in settings.flickr.params.filter) {
			furl += '&' + key + '=' + settings.flickr.params.filter[key];
      }
     
		return $(this).each(function() {

         // Store reference to the root element and make sure it meets the
         // minimum size requirement to prevent 'jumping'
         root = $(this).css('min-height', settings.flier.height); 
         
         // Get the main feed
         $.getJSON(murl, function(data) {

            // Extract each photo from the main feed
            $.each(data.photoset.photo, function(i, photo) {
               total++; 

               // Build specific URL for this photo's info feed
               var iurl = furl + '&photo_id=' + photo.id + '&secret=' + photo.secret;
               
               // Get the specific photo feed
               $.getJSON(iurl, function(data) {
                  loaded++;
                  data = filter(data.photo, settings.flickr.thumb, settings.flickr.full);
                  if(data) fns.addPhoto(data.thumb,data.full,data.desc);
                     
                  // Once complete, call callback function
                  if(total == loaded && $.isFunction(callback)){
                     callback.call(root, undefined);
                  }
               });

            })// end $.each()
         }); // end $.getJSON
      }); // end $(this).each()
   } // end $.fn.jflickrboard
 })(jQuery);
