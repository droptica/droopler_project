(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.droopler_subtheme = {
    attach: function (context, settings) {

    }
  };

  Drupal.behaviors.sticky_menu = {
    attach: function (context, settings) {

      $(window).scroll(function(context) {
        if ($(window).scrollTop() > 0) {
          $("header.header").addClass("header-sticky");
        } else {
          $("header.header").removeClass("header-sticky");
        }
      });

    }
  };

  Drupal.behaviors.random_partners = {
    attach: function (context, settings) {
      var $parent = $(".view-partner-list .view-content");
      var $divs = $parent.children();
      while ($divs.length) {
        $parent.append($divs.splice(Math.floor(Math.random() * $divs.length), 1)[0]);
      }
    }
  };

})(jQuery, Drupal);
