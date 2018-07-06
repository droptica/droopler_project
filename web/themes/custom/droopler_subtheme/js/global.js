(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.droopler_subtheme = {
    attach: function (context, settings) {

    }
  };

  Drupal.behaviors.sticky_menu = {
    attach: function (context, settings) {

      $(window).scroll(function(context) {
        var scroll = $(window).scrollTop();
        if (scroll >= 1) {
          $("header.header").addClass("header-sticky");
        } else {
          $("header.header").removeClass("header-sticky");
        }
      });

    }
  };

})(jQuery, Drupal);
