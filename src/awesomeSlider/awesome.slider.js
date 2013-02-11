/*!
 * 'jQuery Awesome Slider' Plugin for jQuery
 *
 * @author Valerio Capogna
 * @link http://https://github.com/Basilico/jquery-awesome-slider
 * @created 04-12-2012
 * @updated undefined
 * @version 0.1
 *
 * Description:
 * jQuery Awesome slider is a multifunctional slider. You can use it to create image slider
 * with load and resize events. you can create any kind of carousel.
 * Usage:
 * 
 */

 (function($){

  var settings = {
      'bullets'       : true,
      'arrows'        : false, 
      'transition'    : 'slide', //can be fade
      'loop'          : false,
      'speed'         : 400,
      'easing'        : 'easeInOutExpo',
      'slideshow'     : 0,
      'gallery'       : false, //{ 'stretch' : false, 'fluid' : false },
      'swipe'         : false
  };

  var $this;
  var $items;
  var timerSlideshow = null;

  var galleryMethods = {
    loadImage: function($images, callback){
      $images.each(function(){
        var $img = $(this);

       if (undefined !== $img.attr('data-src')){
          $img.addClass('loading').load(function(){
              $img.removeClass('loading').removeAttr('data-src'); 
              if (callback){ callback($img); }
          }).attr('src', $img.attr('data-src'));
        }else{
          if ($img[0].complete){
            if (callback){ callback($img); }
          }else{
            $img.load(function(){
              if (callback){ callback($img); }
            }).attr('src', $img.attr('src'));
          }
        }
      });
    },

    stretchImage: function($images){
      $images.each(function(){
        var $image = $(this);  
        var parentWidth, parentHeight;
        var deltaTop, deltaLeft;

        parentWidth = $image.parent().width();
        parentHeight = $image.parent().height();

        $image
          .css({ 'width': 'auto', 'marginTop': 0, 'marginLeft': 0 })
          .height(parentHeight);

        if ($image.width() < parentWidth){
          $image.css({ 'width': '100%', 'height': 'auto'});
        }

        deltaTop = parentHeight - $image.height();
        deltaLeft = parentWidth - $image.width();

        $image.css({ 
          'marginTop': deltaTop <= 0 ? (deltaTop / 2) : 0,
          'marginLeft': deltaLeft <=0 ? (deltaLeft / 2) : 0
        });
      });
    },

    createGallery: function(beforeLoad){
      if (beforeLoad){
        $this.find('.item').each(function(){
          var $image = $(this).find('img');
          $image.css('opacity', 0);
          if ($image.attr('data-src') !== undefined){
            $(this).addClass('load');
          }
        });
      }else{
        var $firstItem = $items.first();
        var imagesFirstLoad = [
            $firstItem,
            $items.last()
          ];

        if ($items.length > 2){
          imagesFirstLoad.push($firstItem.next());
          if (settings['loop']){ 
            imagesFirstLoad.push($firstItem.next().next());
            imagesFirstLoad.push($items.last().prev());  
          }
        }

        for(var i = 0; i < imagesFirstLoad.length; i++){
          galleryMethods.loadImage(imagesFirstLoad[i].find('img'), function(img){
            galleryMethods.resizeGalleryImages(img);
            img.animate({ opacity: 1 }, 'fast').parent().removeClass('load');
          });
        }
      }
    },

    resizeGalleryImages: function($images){
      $images.each(function(){     
        var $image = $(this); 
        var $parent = $image.parent();

        var isImageStretch = false !== settings['gallery'] 
              && undefined !== settings['gallery']['stretch'] 
              && settings['gallery']['stretch'];

        var isImageFluid = false !== settings['gallery'] 
              && undefined !== settings['gallery']['fluid'] 
              && settings['gallery']['fluid'];

        if (isImageFluid){ $(window).off('resize'); }
        
        if (!$parent.hasClass('show')){ $parent.addClass('show-for-resize'); }
        if (isImageStretch){ galleryMethods.stretchImage($image); }
        if (!$parent.hasClass('show')){ $parent.removeClass('show-for-resize'); }

        if (isImageFluid){ $(window).on('resize', galleryMethods.resizeGalleryHandler); }
        
      });
    },

    resizeGalleryHandler: function(){
      setTimeout(function(){
        $items.find('img').each(function(){
          galleryMethods.resizeGalleryImages($(this));              
        });
      },200);
    },

    prevNextGalleryLoader: function($item){
      var $prevItem = $item.prev();
      var $prevNext = $item.next();

      if ($item.hasClass('load') && !$item.hasClass('loading')){
        galleryMethods.loadImage($item.find('img'), function(img){
          galleryMethods.resizeGalleryImages(img);
          img.animate({ opacity: 1 }, 'fast').parent().removeClass('load');
        });
      }

      if ($prevItem.hasClass('load') && !$prevItem.hasClass('loading')){
        galleryMethods.loadImage($prevItem.find('img'), function(img){
          galleryMethods.resizeGalleryImages(img);
          img.animate({ opacity: 1 }, 'fast').parent().removeClass('load');
        });
      };

      if ($prevNext.hasClass('load') && !$prevItem.hasClass('loading')){
        galleryMethods.loadImage($prevNext.find('img'), function(img){
          galleryMethods.resizeGalleryImages(img);
          img.animate({ opacity: 1 }, 'fast').parent().removeClass('load');
        });
      };
    }
  };

  var methods = {
    init : function(options) { 
      $this = this;
      settings = $.extend(settings, options);

      $this.addClass('awesome ' + settings['transition']);
      
      /* we need to specific a position for parent and set overflow to hidden value */
      if ($this.css('position') === 'static'){ $this.css('position', 'relative'); }

      /* set up slider if user want to build a images gallery */
      if (settings['gallery']){
        galleryMethods.createGallery(true);
      }

      /* set up slider when transition value is set to "slide" */
      if (settings['transition'] === 'slide'){

        if (settings['loop']){
          var $firstItemClone = $this.find('.item:first').clone();
          var $lastItemClone = $this.find('.item:last').clone();
          $this.append($firstItemClone);
          $this.prepend($lastItemClone);
        }

        $this.wrapInner('<div class="transition-box" />');

        $this.find('.item:eq(' + (settings['loop'] ? 1 : 0) + ')').addClass('show');
      }else{
        /* hide all elements but not the first*/
        $this.find('.item:gt(0)').hide();
        $this.find('.item:first').addClass('show');
      }

      $items = $this.find('.item');

      /* load main images of the gallery to have a continuos effect */
      if (settings['gallery']){
        galleryMethods.createGallery(false);
      }

      if (settings['bullets'] && settings['arrows']){
        settings['bullets'] = false;
      }

      if(settings['bullets']){
        methods.createBullets();
      }

      if(settings['arrows']){
        methods.createArrows();
      }

      if(settings['slideshow']){
        methods.createSlideShow();
      }

      if (settings['swipe']){ 
        methods.addSwipeListener();
      }
    },

    createArrows: function(){
      var $arrowRight = $('<a href="#" class="arrow right" />');
      var $arrowLeft = $('<a href="#" class="arrow left" />');
      var startRight, startLeft;

      $this.append($arrowRight);
      $this.append($arrowLeft);

      $this.find('.arrow').on('click', function(e){
        e.preventDefault();

        var $arrow;
        var currentIndex, toShowIndex;

        if (settings['transition'] === 'slide' && $this.find('.transition-box').is(':animated')){ return; }
        if (settings['transition'] === 'fade' && $this.find('.item.show').is(':animated')){ return; }

        if (timerSlideshow !== null){ clearTimeout(timerSlideshow); }

        $arrow = $(this);
        currentIndex = $items.index($this.find('.item.show'));

        if ($arrow.hasClass('right')){
          toShowIndex =  currentIndex + 1;
          if (settings['transition'] === 'slide' 
                && settings['loop']
                && toShowIndex === ($items.length - 1)){ 
                  toShowIndex = 1; 
                }else if(toShowIndex === $items.length){
                  toShowIndex = 0;
                }
        }else{
          toShowIndex = currentIndex - 1;
          if (settings['transition'] === 'slide' 
                && settings['loop']
                && toShowIndex === 0){ 
                  toShowIndex = $items.length - 2; 
                }else if(toShowIndex < 0){
                  toShowIndex = $items.length - 1;
                }
        }
        
        methods.showItem(toShowIndex);
      });
    },

    createBullets: function(){
      var $bulletsContainer = $('<div class="bullets" />');
      var start,end;
      $this.append($bulletsContainer);

      start = settings['transition'] === 'slide' && settings['loop'] ? 1 : 0;
      end = settings['transition'] === 'slide' && settings['loop'] ? $items.length - 1 : $items.length;

      for (var i = start; i < end; i++){
        var $bullett = $('<a href="#" slide-to="' + i +'">&bull;</a>');
        $bulletsContainer.append($bullett);

        $bullett.on('click', function(e){
          e.preventDefault();
          if (!$(this).hasClass('selected')){

            if (settings['transition'] === 'slide' && $this.find('.transition-box').is(':animated')){ return; }
            if (settings['transition'] === 'fade' && $this.find('.item.show').is(':animated')){ return; }

            if (timerSlideshow !== null){ clearTimeout(timerSlideshow); }

            $bulletsContainer.find('a.selected').removeClass('selected');
            $(this).addClass('selected');
            methods.showItem(parseInt($(this).attr('slide-to')));
          }
        });
      }

      $bulletsContainer.find('a:first').addClass('selected');
    },

    createSlideShow: function(){
      if (timerSlideshow !== null){ clearTimeout(timerSlideshow); }

      timerSlideshow = setTimeout(function(){
        var currentIndex, toShowIndex;

        if (settings['transition'] === 'slide' && $this.find('.transition-box').is(':animated')){ return; }
        if (settings['transition'] === 'fade' && $this.find('.item.show').is(':animated')){ return; }

        currentIndex = $items.index($this.find('.item.show'));
        toShowIndex =  currentIndex + 1;
        if (settings['transition'] === 'slide' 
              && settings['loop']
              && toShowIndex === ($items.length - 1)){ 
                toShowIndex = 1; 
              }else if(toShowIndex === $items.length){
                toShowIndex = 0;
              }
        
        if (settings['bullets']){
            $this.find('.bullets a.selected').removeClass('selected');
            $this.find('.bullets a[slide-to=' + toShowIndex + ']').addClass('selected');
        }

        methods.showItem(toShowIndex);
        methods.createSlideShow();

      }, settings['slideshow']);
    },

    addSwipeListener: function(){
      $this.hammer().bind("swipe", function(ev) {

        var currentIndex, toShowIndex;

        if (settings['transition'] === 'slide' && $this.find('.transition-box').is(':animated')){ return; }
        if (settings['transition'] === 'fade' && $this.find('.item.show').is(':animated')){ return; }

        if (timerSlideshow !== null){ clearTimeout(timerSlideshow); }

        currentIndex = $items.index($this.find('.item.show'));

        if (ev.direction === 'left'){
          toShowIndex =  currentIndex + 1;
          if (settings['transition'] === 'slide' 
                && settings['loop']
                && toShowIndex === ($items.length - 1)){ 
                  toShowIndex = 1; 
                }else if(toShowIndex === $items.length){
                  toShowIndex = 0;
                }
        }else if (ev.direction === 'right'){
          toShowIndex = currentIndex - 1;
          if (settings['transition'] === 'slide' 
                && settings['loop']
                && toShowIndex === 0){ 
                  toShowIndex = $items.length - 2; 
                }else if(toShowIndex < 0){
                  toShowIndex = $items.length - 1;
                }
        }
        
        methods.showItem(toShowIndex);
      });
    },

    showItem: function(index){
      var $currentItem = $this.find('.item.show');
      var $toShowItem = $this.find('.item:eq(' + index + ')');
      var currentIndex, toShowIndex, itemLength;

      itemLength = $this.find('.item').length;

      if (!$currentItem.is($toShowItem)){
        currentIndex = $this.find('.item').index($currentItem);
        toShowIndex = index;

        if (settings['transition'] === 'slide'){

          if (settings['loop']){  
            if(currentIndex === itemLength - 2 && toShowIndex === 1){
              $toShowItem = $this.find('.item:last');
              toShowIndex = itemLength - 1;
            }else if(currentIndex === 1 && toShowIndex === itemLength - 2){
              $toShowItem = $this.find('.item:first');
              toShowIndex = 0;
            }
          }
          
          $toShowItem.addClass('show');

          if(toShowIndex > currentIndex){
            $this.find('.transition-box').stop(false,true).animate({
              left: '-100%'
            }, settings['speed'], settings['easing'], function(){
              $currentItem.removeClass('show');
              $(this).css('left', '0%');

              if (settings['loop'] && toShowIndex === itemLength - 1){
                $toShowItem.removeClass('show');
                $this.find('.item:eq(1)').addClass('show');
              }
            });
          }else{
            $this.find('.transition-box').css("left", "-100%").stop(false, true).animate({
                left: '0%'
            }, settings['speed'], settings['easing'], function(){
              $currentItem.removeClass('show');

              if (settings['loop'] && toShowIndex === 0){
                $toShowItem.removeClass('show');
                $this.find('.item:eq(' + ($this.find('.item').length - 2) + ')').addClass('show');
              }
            });
          }

        }else{
          $currentItem.stop(true,true).fadeOut(settings['speed'], settings['easing'], function(){
            $(this).removeClass('show');
          });

          $toShowItem.stop(true,true).fadeIn(settings['speed'], settings['easing'], function(){
            $(this).addClass('show');
          });
        }

        if (settings['gallery']){
          galleryMethods.prevNextGalleryLoader($toShowItem);
        }
      }
    }
  }

  $.fn.awesomeSlider = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.tooltip');
    }  
  };

})(jQuery);