/**
 * @file
 * The script that activates Slick carousels.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.d_p_carousel = {
    attach: function (context) {
      $(`[data-slick]`, context).each((index, element) => {
        const $carouselElement = $(element);
        const carouselItems = $carouselElement.children().length;
        const slickData = $carouselElement.data('slick');

        if (carouselItems >= 2) {
          $carouselElement.slick();

          if (slickData.slidesToShow >= carouselItems) {
            $carouselElement.addClass('carousel-fixed');
          }

          if (slickData.slidesToShow === 1) {
            $carouselElement.on('beforeChange', function(event, slick, currentSlide) {
              const $currentSlide = $(slick.$slides[currentSlide]);
              const $iframe = $currentSlide.find('iframe[src*="youtube"]');
              
              if ($iframe.length) {
                const iframeSrc = $iframe.attr('src');
                $iframe.attr('src', iframeSrc);
              }
            });
          }
        }
      });
    },
  };
})(jQuery, Drupal);
