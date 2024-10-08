/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************************************************!*\
  !*** ./src/components/demo-random-price/demo-random-price.js ***!
  \***************************************************************/
(function ($, Drupal) {
  'use strict';

  /**
   * Generate random prices and values of change (percentage) every 5 sec and pass optional css class
   * to run global function setPrice() which displays those values
   * in black stripe in d_p_single_text_block paragraphs that contain modifier class "with-price"
   */
  Drupal.behaviors.d_demo_random_price = {
    attach: function attach(context, settings) {
      if ($('.price-block', context).length !== 0) {
        setInterval(function () {
          var number = ((2000 + Math.floor(Math.random() * 1000)) / 100).toFixed(2);
          var timestamp = Date.now() / 1000 - Math.floor(Math.random() * 31 * 24 * 3600);
          var change = 0;
          if (localStorage.getItem('price')) {
            var oldPrice = localStorage.getItem('price');
            change = Math.round((number - oldPrice) * 100 / oldPrice * 100) / 100;
          }
          localStorage.setItem('price', number);
          window.setPrice(number, change, timestamp, 'EUR');
        }, 5000);
      }
    }
  };
})(jQuery, Drupal);
/******/ })()
;
//# sourceMappingURL=demo-random-price.js.map