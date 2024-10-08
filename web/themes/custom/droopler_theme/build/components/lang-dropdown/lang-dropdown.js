/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!*******************************************************!*\
  !*** ./src/components/lang-dropdown/lang-dropdown.js ***!
  \*******************************************************/
(function ($, Drupal) {
  "use strict";

  Drupal.behaviors.lang_dropdown = {
    attach: function attach(context, settings) {
      var $body = $("body");
      var $html = $("html");
      if ($body.hasClass("d-lang-added")) {
        return;
      }
      var $languageSwitcher = $(".block.language-switcher-language-url .block__content:not(.dropdown)", $body);
      var $links = $(".links", $languageSwitcher);
      var activeLangCode = $html.attr("lang");
      var $div = $("<a>", {
        "href": "#",
        "class": "dropdown-toggle",
        "role": "button",
        "id": "dropdownMenuLink",
        "data-bs-toggle": "dropdown",
        "aria-expanded": "false"
      });
      $div.html(activeLangCode);
      $languageSwitcher.prepend($div).addClass("dropdown");
      $links.removeClass("nav").addClass("dropdown-menu").attr("aria-labelledby", "dropdownMenuLink");
      $("li", $links).addClass("dropdown-item");
      $body.addClass("d-lang-added");
    }
  };
})(jQuery, Drupal);
/******/ })()
;
//# sourceMappingURL=lang-dropdown.js.map