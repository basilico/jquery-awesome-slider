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
      'infinite'      : false,
      'speed'         : 400,
      'easing'        : 'easeInOutExpo',
      'gallery'       : false,
      'slideshow'     : 0
      'resize'        : false,
  };

  var $this;
  var $items;
  var timerSlideshow = null;

  var helper = {
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
        methods.createGallery(true);
      }

      /* set up slider when transition value is set to "slide" */
      if (settings['transition'] === 'slide'){

        if (settings['infinite']){
          var $firstItemClone = $this.find('.item:first').clone();
          var $lastItemClone = $this.find('.item:last').clone();
          $this.append($firstItemClone);
          $this.prepend($lastItemClone);
        }

        $this.wrapInner('<div class="transition-box" />');

        $this.find('.item:eq(' + (settings['infinite'] ? 1 : 0) + ')').addClass('show');
      }else{
        /* hide all elements but not the first*/
        $this.find('.item:gt(0)').hide();
        $this.find('.item:first').addClass('show');
      }

      $items = $this.find('.item');

      /* load main images of the gallery to have a continuos effect */
      if (settings['gallery']){
        methods.createGallery(false);
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

        $arrow = $(this);
        currentIndex = $items.index($this.find('.item.show'));

        if ($arrow.hasClass('right')){
          toShowIndex =  currentIndex + 1;
          if (settings['transition'] === 'slide' 
                && settings['infinite']
                && toShowIndex === ($items.length - 1)){ 
                  toShowIndex = 1; 
                }else if(toShowIndex === $items.length){
                  toShowIndex = 0;
                }
        }else{
          toShowIndex = currentIndex - 1;
          if (settings['transition'] === 'slide' 
                && settings['infinite']
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

      start = settings['transition'] === 'slide' && settings['infinite'] ? 1 : 0;
      end = settings['transition'] === 'slide' && settings['infinite'] ? $items.length - 1 : $items.length;

      for (var i = start; i < end; i++){
        var $bullett = $('<a href="#" slide-to="' + i +'">&bull;</a>');
        $bulletsContainer.append($bullett);

        $bullett.on('click', function(e){
          e.preventDefault();
          if (!$(this).hasClass('selected')){

            if (settings['transition'] === 'slide' && $this.find('.transition-box').is(':animated')){ return; }
            if (settings['transition'] === 'fade' && $this.find('.item.show').is(':animated')){ return; }

            $('.bullets a.selected').removeClass('selected');
            $(this).addClass('selected');
            methods.showItem(parseInt($(this).attr('slide-to')));
          }
        });
      }

      $bulletsContainer.find('a:first').addClass('selected');
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
          if (settings['infinite']){ 
            imagesFirstLoad.push($firstItem.next().next());
            imagesFirstLoad.push($items.last().prev());  
          }
        }

        for(var i = 0; i < imagesFirstLoad.length; i++){
          helper.loadImage(imagesFirstLoad[i].find('img'), function(img){
            img.animate({ opacity: 1 }, 'fast').parent().removeClass('load');
          });
        }
      }
    },

    prevNextGalleryLoader: function($item){
      var $prevItem = $item.prev();
      var $prevNext = $item.next();

      if ($item.hasClass('load') && !$item.hasClass('loading')){
        helper.loadImage($item.find('img'), function(img){
          img.animate({ opacity: 1 }, 'fast').parent().removeClass('load');
        });
      }

      if ($prevItem.hasClass('load') && !$prevItem.hasClass('loading')){
        helper.loadImage($prevItem.find('img'), function(img){
          img.animate({ opacity: 1 }, 'fast').parent().removeClass('load');
        });
      };

      if ($prevNext.hasClass('load') && !$prevItem.hasClass('loading')){
        helper.loadImage($prevNext.find('img'), function(img){
          img.animate({ opacity: 1 }, 'fast').parent().removeClass('load');
        });
      };

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

          if (settings['infinite']){  
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

              if (settings['infinite'] && toShowIndex === itemLength - 1){
                $toShowItem.removeClass('show');
                $this.find('.item:eq(1)').addClass('show');
              }
            });
          }else{
            $this.find('.transition-box').css("left", "-100%").stop(false, true).animate({
                left: '0%'
            }, settings['speed'], settings['easing'], function(){
              $currentItem.removeClass('show');

              if (settings['infinite'] && toShowIndex === 0){
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
          methods.prevNextGalleryLoader($toShowItem);
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