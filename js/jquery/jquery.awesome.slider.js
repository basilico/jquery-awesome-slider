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
      'bullets'      : false,
      'arrows'       : false,
      'isSlideshow'  : false,
      'backToStart'  : false,
      'transition'   : 'slide',
      'speed'        : 800,
      'easing'       : 'easeInOutExpo',
      'timer'        : -1 
  };

  var methods = {
    init : function(options) { 
      var $this = this;
      settings = $.extend(settings, options);
      
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