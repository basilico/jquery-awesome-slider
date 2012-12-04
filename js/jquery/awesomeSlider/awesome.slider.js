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
      'bulletts'      : true, 
      'transition'    : 'slide',
      'infinite'      : true,
      'speed'         : 800,
      'easing'        : 'easeInOutCubic'
  };

  var $this;

  var methods = {
    init : function(options) { 
      $this = this;
      settings = $.extend(settings, options);

      $this.addClass('awesome ' + settings['transition']);
      
      /* we need to specific a position for parent and set overflow to hidden value */
      if($this.css('position') === 'static'){ $this.css('position', 'relative'); }

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

      if(settings['bulletts']){
        methods.createBulletts();
      }

    },

    createBulletts: function(){
      var $bullettsContainer = $('<div class="bulletts" />');
      var $items = $this.find('.item');
      var start,end;
      $this.append($bullettsContainer);

      start = settings['transition'] === 'slide' && settings['infinite'] ? 1 : 0;
      end = settings['transition'] === 'slide' && settings['infinite'] ? $items.length - 1 : $items.length;

      for (var i = start; i < end; i++){
        var $bullett = $('<a href="#" slide-to="' + i +'">&bull;</a>');
        $bullettsContainer.append($bullett);

        $bullett.on('click', function(e){
          e.preventDefault();
          if (!$(this).hasClass('selected')){

            if (settings['transition'] === 'slide' && $this.find('.transition-box').is(':animated')){ return; }
            if (settings['transition'] === 'fade' && $this.find('.item.show').is(':animated')){ return; }

            $('.bulletts a.selected').removeClass('selected');
            $(this).addClass('selected');
            methods.showItem(parseInt($(this).attr('slide-to')));
          }
        });
      }

      $bullettsContainer.find('a:first').addClass('selected');
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