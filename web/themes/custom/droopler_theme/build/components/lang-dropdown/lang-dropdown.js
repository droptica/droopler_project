!function(a,d){"use strict";d.behaviors.lang_dropdown={attach:function(d,n){var o=a("body"),l=a("html");if(!o.hasClass("d-lang-added")){var e=a(".block.language-switcher-language-url .block__content:not(.dropdown)",o),r=a(".links",e),s=l.attr("lang"),t=a("<a>",{href:"#",class:"dropdown-toggle",role:"button",id:"dropdownMenuLink","data-bs-toggle":"dropdown","aria-expanded":"false"});t.html(s),e.prepend(t).addClass("dropdown"),r.removeClass("nav").addClass("dropdown-menu").attr("aria-labelledby","dropdownMenuLink"),a("li",r).addClass("dropdown-item"),o.addClass("d-lang-added")}}}}(jQuery,Drupal);
//# sourceMappingURL=lang-dropdown.js.map