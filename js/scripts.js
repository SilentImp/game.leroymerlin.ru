"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    "use strict";

    /**
    * @classdesc Class representing title
    * @class
    */

    var Slides = (function () {

        /**
         * @description Start initialization on domload
         * @constructor
         */

        function Slides() {
            _classCallCheck(this, Slides);

            var ready = new Promise(function (resolve, reject) {
                if (document.readyState != "loading") return resolve();
                document.addEventListener("DOMContentLoaded", function () {
                    return resolve();
                });
            });
            ready.then(this.init.bind(this));
        }

        /**
         * @description Add events and initialize slider
         */

        _createClass(Slides, [{
            key: "init",
            value: function init() {
                var _this = this;

                this.page = document.querySelector('.page');
                this.paginator = document.querySelector('.paginator');
                this.footer = document.querySelector('.footer');
                this.current = this.paginator.querySelector('.paginator__slide_current');
                this.social = document.querySelector('.social');
                this.checkStateBind = this.checkState.bind(this);
                this.show_video = document.querySelector('.slide__video');
                this.video = document.querySelector('.slide__screen');
                this.hide_video = document.querySelector('.slide__screen-close');
                this.scrolling = false;
                this.navigation = document.querySelector('.header__navigation');
                this.loca = document.querySelector('.header__options');

                var burger = document.querySelector('.header__burger');
                burger.addEventListener('click', this.openNavigation.bind(this));

                var close = document.querySelector('.header__close');
                close.addEventListener('click', this.closeNavigation.bind(this));

                var close_location = document.querySelector('.header__close-location');
                close_location.addEventListener('click', this.closeLocation.bind(this));

                var open_location = document.querySelector('.header__open-location');
                open_location.addEventListener('click', this.openLocation.bind(this));

                var buttons = document.querySelectorAll('.slide__play');
                [].forEach.call(buttons, function (button) {
                    button.addEventListener('click', _this.scrollToLinks.bind(_this));
                });

                var paginator_links = this.paginator.querySelectorAll('.paginator__slide');
                [].forEach.call(paginator_links, function (link) {
                    link.addEventListener('click', _this.scrollToSlide.bind(_this));
                });

                paginator_links[0].click();

                window.requestAnimationFrame(this.checkStateBind);
                window.addEventListener('keyup', this.keyboardController.bind(this));
                window.addEventListener('resize', this.rescroll.bind(this));
                window.addEventListener('wheel', this.wheelController.bind(this));
                this.show_video.addEventListener('click', this.showVideo.bind(this));
                this.hide_video.addEventListener('click', this.hideVideo.bind(this));

                this.rescroll();

                if (document.body.parentNode.classList.contains('touch')) {
                    var hammertime = new Hammer(this.page);
                    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
                    hammertime.on('swipeup', this.next.bind(this));
                    hammertime.on('swipedown', this.prev.bind(this));
                }
            }
        }, {
            key: "closeLocation",
            value: function closeLocation() {
                var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                Velocity(this.loca, "stop");
                Velocity(this.loca, {
                    top: -viewport_height
                }, {
                    duration: 500
                });
            }
        }, {
            key: "openLocation",
            value: function openLocation() {
                Velocity(this.loca, "stop");
                Velocity(this.loca, {
                    top: 0
                }, {
                    duration: 500
                });
            }
        }, {
            key: "closeNavigation",
            value: function closeNavigation() {
                var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                Velocity(this.navigation, "stop");
                Velocity(this.navigation, {
                    top: -viewport_height
                }, {
                    duration: 500
                });
            }
        }, {
            key: "openNavigation",
            value: function openNavigation() {
                Velocity(this.navigation, "stop");
                Velocity(this.navigation, {
                    top: 0
                }, {
                    duration: 500
                });
            }
        }, {
            key: "wheelController",
            value: function wheelController(event) {
                var _this2 = this;

                if (this.wheeling == true) {
                    return;
                }
                this.wheeling = true;
                if (event.deltaY > 3) {
                    this.next();
                } else if (event.deltaY < -3) {
                    this.prev();
                }
                setTimeout(function () {
                    _this2.wheeling = false;
                }, 750);
            }
        }, {
            key: "showVideo",
            value: function showVideo() {
                var _this3 = this;

                var iframe = document.createElement('IFRAME');
                iframe.className = "slide__screen-tube";
                iframe.setAttribute("width", 560);
                iframe.setAttribute("height", 315);
                iframe.setAttribute("frameborder", 0);
                iframe.setAttribute("allowfullscreen", true);
                iframe.setAttribute("src", this.video.getAttribute('data-src'));
                this.video.appendChild(iframe);
                setTimeout(function () {
                    Velocity(_this3.video, "fadeIn", { duration: 750 });
                }, 25);
            }
        }, {
            key: "hideVideo",
            value: function hideVideo() {
                Velocity(this.video, "fadeOut", {
                    duration: 750,
                    complete: function complete() {
                        var video = document.querySelector('.slide__screen-tube');
                        video.parentNode.removeChild(video);
                    }
                });
            }
        }, {
            key: "keyboardController",
            value: function keyboardController(event) {
                switch (event.keyCode) {
                    case 38:
                        event.preventDefault();
                        this.prev();
                        break;
                    case 40:
                        event.preventDefault();
                        this.next();
                        break;
                }
            }
        }, {
            key: "prev",
            value: function prev() {
                if (document.body.parentNode.classList.contains('landscape') && document.body.parentNode.classList.contains('limit-500')) {
                    return;
                }
                var button = this.current.previousElementSibling;
                if (button != null) {
                    button.click();
                }
            }
        }, {
            key: "next",
            value: function next() {
                if (document.body.parentNode.classList.contains('landscape') && document.body.parentNode.classList.contains('limit-500')) {
                    return;
                }
                var button = this.current.nextElementSibling;
                if (button != null) {
                    button.click();
                }
            }
        }, {
            key: "rescroll",
            value: function rescroll() {

                var slide = document.querySelector('.slide');
                document.body.parentNode.classList.toggle('landscape', window.innerWidth > window.innerHeight);
                document.body.parentNode.classList.toggle('limit-500', slide.offsetHeight <= 500);
                document.body.parentNode.classList.toggle('limit-600', Modernizr.mq('(max-height: 600px)'));
                document.body.parentNode.classList.toggle('limit-600-900', Modernizr.mq('(min-height: 601px) and (max-height: 900)'));

                var button = this.current;
                if (button != null) {
                    button.click();
                }
            }
        }, {
            key: "checkState",
            value: function checkState() {
                var top = Math.abs(parseInt(this.page.style.top, 10)),
                    viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),

                // , viewport_height = document.querySelector('.slide').offsetHeight
                distance = top - (this.page.offsetHeight - viewport_height - this.footer.offsetHeight),
                    distance_long = top - (this.page.offsetHeight - 2 * viewport_height - this.footer.offsetHeight);

                if (distance > 0) {
                    this.social.classList.toggle('social_fixed', true);
                    this.social.style.bottom = distance + "px";
                    if (viewport_height >= 900) {
                        this.paginator.style.marginTop = -this.paginator.offsetHeight / 2 - distance + "px";
                    }
                } else {
                    this.social.classList.toggle('social_fixed', false);
                    this.social.removeAttribute('style');
                    if (viewport_height >= 900) {
                        this.paginator.removeAttribute('style');
                    }
                }

                window.requestAnimationFrame(this.checkStateBind);
            }
        }, {
            key: "scrollToLinks",
            value: function scrollToLinks(event) {
                event.preventDefault();
                document.querySelector('[data-slide="6"]').click();
            }
        }, {
            key: "scrollToSlide",
            value: function scrollToSlide(event) {
                var _this4 = this;

                if (this.scrolling == true) {
                    return;
                }
                this.scrolling = true;

                var link = event.currentTarget,
                    old_id = parseInt(this.current.getAttribute('data-slide'), 10),
                    id = parseInt(link.getAttribute('data-slide'), 10) - 1,
                    diff = Math.abs(old_id - (id + 1)),
                    slide = document.querySelector('.slide_' + (id + 1)),
                    viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),

                // , viewport_height = document.querySelector('.slide').offsetHeight
                target = Math.min(viewport_height * id, this.page.offsetHeight - viewport_height);

                this.current.classList.remove('paginator__slide_current');
                this.current = link;
                this.current.classList.add('paginator__slide_current');

                if (slide.classList.contains('slide_gold') || slide.classList.contains('slide_green') || slide.classList.contains('slide_dark')) {
                    this.paginator.classList.toggle('paginator_dark', false);
                } else {
                    this.paginator.classList.toggle('paginator_dark', true);
                }

                Velocity(this.page, "stop");
                Velocity(this.page, {
                    top: -target + "px"
                }, {
                    duration: diff * 250,
                    complete: function complete() {
                        setTimeout(function () {
                            _this4.scrolling = false;
                        }, 250);
                    }
                });
            }
        }]);

        return Slides;
    })();

    new Slides();
})();
"use strict";
"use strict";

window.viewportUnitsBuggyfill.init({ hacks: window.viewportUnitsBuggyfillHacks });
viewportUnitsBuggyfill.refresh();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2luYXRvci9wYWdpbmF0b3IuanMiLCJzb2NpYWwvc29jaWFsLmpzIiwiYnVnZ3lmaWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBWTtBQUNULGdCQUFZLENBQUM7Ozs7Ozs7UUFNTixNQUFNOzs7Ozs7O0FBTUcsaUJBTlQsTUFBTSxHQU1NO2tDQU5aLE1BQU07O0FBT0wsZ0JBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRztBQUN2QyxvQkFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRSxPQUFPLE9BQU8sRUFBRSxDQUFDO0FBQ3ZELHdCQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7MkJBQUssT0FBTyxFQUFFO2lCQUFBLENBQUMsQ0FBQzthQUNqRSxDQUFDLENBQUM7QUFDSCxpQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3BDOzs7Ozs7cUJBWkUsTUFBTTs7bUJBaUJKLGdCQUFHOzs7QUFDSixvQkFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLG9CQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEQsb0JBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxvQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pFLG9CQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsb0JBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENB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QUFTLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUNuQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFDdkMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQzNDO0FBQ0Usd0JBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDNUQsTUFBTTtBQUNILHdCQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQzNEOztBQUVELHdCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1Qix3QkFBUSxDQUNKLElBQUksQ0FBQyxJQUFJLEVBQ1A7QUFDRSx1QkFBRyxFQUFFLENBQUMsTUFBTSxHQUFDLElBQUk7aUJBQ2hCLEVBQ0g7QUFDRSw0QkFBUSxFQUFFLElBQUksR0FBQyxHQUFHO0FBQ2hCLDRCQUFRLEVBQUUsb0JBQU07QUFDZCxrQ0FBVSxDQUFDLFlBQU07QUFDYixtQ0FBSyxTQUFTLEdBQUcsS0FBSyxDQUFDO3lCQUMxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNYO2lCQUNKLENBQUMsQ0FBQzthQUNWOzs7ZUFwUkUsTUFBTTs7O0FBdVJiLFFBQUksTUFBTSxFQUFBLENBQUM7Q0FDZCxDQUFBLEVBQUcsQ0FBQztBQy9STDs7O0FDQUEsTUFBTSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsMkJBQTJCLEVBQUMsQ0FBQyxDQUFDO0FBQ2hGLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxDQUFDIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgKiBAY2xhc3NkZXNjIENsYXNzIHJlcHJlc2VudGluZyB0aXRsZVxuICAgICogQGNsYXNzXG4gICAgKi9cbiAgICAgY2xhc3MgU2xpZGVzIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFN0YXJ0IGluaXRpYWxpemF0aW9uIG9uIGRvbWxvYWRcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICBsZXQgcmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9IFwibG9hZGluZ1wiKSByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpPT4gcmVzb2x2ZSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVhZHkudGhlbih0aGlzLmluaXQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIEFkZCBldmVudHMgYW5kIGluaXRpYWxpemUgc2xpZGVyXG4gICAgICAgICAqL1xuICAgICAgICBpbml0ICgpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlJyk7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdpbmF0b3InKTtcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3RlcicpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5wYWdpbmF0b3IucXVlcnlTZWxlY3RvcignLnBhZ2luYXRvcl9fc2xpZGVfY3VycmVudCcpO1xuICAgICAgICAgICAgdGhpcy5zb2NpYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc29jaWFsJyk7XG4gICAgICAgICAgICB0aGlzLmNoZWNrU3RhdGVCaW5kID0gdGhpcy5jaGVja1N0YXRlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNob3dfdmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3ZpZGVvJyk7XG4gICAgICAgICAgICB0aGlzLnZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19zY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuaGlkZV92aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fc2NyZWVuLWNsb3NlJyk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2aWdhdGlvbicpO1xuICAgICAgICAgICAgdGhpcy5sb2NhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fb3B0aW9ucycpO1xuXG4gICAgICAgICAgICBsZXQgYnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnVyZ2VyJyk7XG4gICAgICAgICAgICBidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9wZW5OYXZpZ2F0aW9uLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBsZXQgY2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19jbG9zZScpO1xuICAgICAgICAgICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsb3NlTmF2aWdhdGlvbi5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgbGV0IGNsb3NlX2xvY2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fY2xvc2UtbG9jYXRpb24nKTtcbiAgICAgICAgICAgIGNsb3NlX2xvY2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbG9zZUxvY2F0aW9uLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBsZXQgb3Blbl9sb2NhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX29wZW4tbG9jYXRpb24nKTtcbiAgICAgICAgICAgIG9wZW5fbG9jYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9wZW5Mb2NhdGlvbi5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgbGV0IGJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVfX3BsYXknKTtcbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChidXR0b25zLCAoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zY3JvbGxUb0xpbmtzLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBwYWdpbmF0b3JfbGlua3MgPSB0aGlzLnBhZ2luYXRvci5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5hdG9yX19zbGlkZScpO1xuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKHBhZ2luYXRvcl9saW5rcywgKGxpbmspID0+IHtcbiAgICAgICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zY3JvbGxUb1NsaWRlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBhZ2luYXRvcl9saW5rc1swXS5jbGljaygpO1xuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY2hlY2tTdGF0ZUJpbmQpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5rZXlib2FyZENvbnRyb2xsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNjcm9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMud2hlZWxDb250cm9sbGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5zaG93X3ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zaG93VmlkZW8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmhpZGVfdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGVWaWRlby5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5yZXNjcm9sbCgpO1xuXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndG91Y2gnKSkge1xuICAgICAgICAgICAgICAgIGxldCBoYW1tZXJ0aW1lID0gbmV3IEhhbW1lcih0aGlzLnBhZ2UpO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUuZ2V0KCdzd2lwZScpLnNldCh7IGRpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9WRVJUSUNBTCB9KTtcbiAgICAgICAgICAgICAgICBoYW1tZXJ0aW1lLm9uKCdzd2lwZXVwJywgdGhpcy5uZXh0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUub24oJ3N3aXBlZG93bicsIHRoaXMucHJldi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgY2xvc2VMb2NhdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgdmlld3BvcnRfaGVpZ2h0ID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5sb2NhLCBcInN0b3BcIik7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLmxvY2EsIHtcbiAgICAgICAgICAgICAgICB0b3A6IC12aWV3cG9ydF9oZWlnaHRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wZW5Mb2NhdGlvbiAoKSB7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLmxvY2EsIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubG9jYSwge1xuICAgICAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICBjbG9zZU5hdmlnYXRpb24gKCkge1xuICAgICAgICAgICAgbGV0IHZpZXdwb3J0X2hlaWdodCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubmF2aWdhdGlvbiwgXCJzdG9wXCIpO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5uYXZpZ2F0aW9uLCB7XG4gICAgICAgICAgICAgICAgdG9wOiAtdmlld3BvcnRfaGVpZ2h0XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcGVuTmF2aWdhdGlvbiAoKSB7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLm5hdmlnYXRpb24sIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubmF2aWdhdGlvbiwge1xuICAgICAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hlZWxDb250cm9sbGVyIChldmVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMud2hlZWxpbmcgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy53aGVlbGluZyA9IHRydWU7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGVsdGFZID4gMyl7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmRlbHRhWSA8IC0zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57dGhpcy53aGVlbGluZyA9IGZhbHNlO30sIDc1MCk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93VmlkZW8gKCkge1xuICAgICAgICAgICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0lGUkFNRScpO1xuICAgICAgICAgICAgaWZyYW1lLmNsYXNzTmFtZSA9IFwic2xpZGVfX3NjcmVlbi10dWJlXCI7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgNTYwKTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgMzE1KTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJmcmFtZWJvcmRlclwiLCAwKTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJhbGxvd2Z1bGxzY3JlZW5cIiwgdHJ1ZSk7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwic3JjXCIsIHRoaXMudmlkZW8uZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpKTtcbiAgICAgICAgICAgIHRoaXMudmlkZW8uYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnZpZGVvLCBcImZhZGVJblwiLCB7ZHVyYXRpb246IDc1MH0pO1xuICAgICAgICAgICAgfSwgMjUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVZpZGVvICgpIHtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMudmlkZW8sIFwiZmFkZU91dFwiLCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDc1MFxuICAgICAgICAgICAgICAgICwgY29tcGxldGU6ICgpPT57XG4gICAgICAgICAgICAgICAgICAgIGxldCB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fc2NyZWVuLXR1YmUnKTtcbiAgICAgICAgICAgICAgICAgICAgdmlkZW8ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh2aWRlbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBrZXlib2FyZENvbnRyb2xsZXIgKGV2ZW50KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXYoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByZXYgKCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2xhbmRzY2FwZScpXG4gICAgICAgICAgICAgICAgJiYgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnbGltaXQtNTAwJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBidXR0b24gPSB0aGlzLmN1cnJlbnQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChidXR0b24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCAoKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnbGFuZHNjYXBlJylcbiAgICAgICAgICAgICAgICAmJiBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW1pdC01MDAnKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuY3VycmVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2Nyb2xsICgpIHtcblxuICAgICAgICAgICAgbGV0IHNsaWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGFuZHNjYXBlJywgKCB3aW5kb3cuaW5uZXJXaWR0aCA+IHdpbmRvdy5pbm5lckhlaWdodCkpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ2xpbWl0LTUwMCcsIChzbGlkZS5vZmZzZXRIZWlnaHQgPD0gNTAwKSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGltaXQtNjAwJywgKE1vZGVybml6ci5tcSgnKG1heC1oZWlnaHQ6IDYwMHB4KScpKSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGltaXQtNjAwLTkwMCcsIChNb2Rlcm5penIubXEoJyhtaW4taGVpZ2h0OiA2MDFweCkgYW5kIChtYXgtaGVpZ2h0OiA5MDApJykpKTtcblxuXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5jdXJyZW50O1xuICAgICAgICAgICAgaWYgKGJ1dHRvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1N0YXRlICgpIHtcbiAgICAgICAgICAgIGxldCB0b3AgPSBNYXRoLmFicyhwYXJzZUludCh0aGlzLnBhZ2Uuc3R5bGUudG9wLCAxMCkpXG4gICAgICAgICAgICAgICAgLCB2aWV3cG9ydF9oZWlnaHQgPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgICAgICAgICAgICAgICAvLyAsIHZpZXdwb3J0X2hlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZScpLm9mZnNldEhlaWdodFxuICAgICAgICAgICAgICAgICwgZGlzdGFuY2UgPSB0b3AgLSAodGhpcy5wYWdlLm9mZnNldEhlaWdodCAtIHZpZXdwb3J0X2hlaWdodCAtIHRoaXMuZm9vdGVyLm9mZnNldEhlaWdodClcbiAgICAgICAgICAgICAgICAsIGRpc3RhbmNlX2xvbmcgPSB0b3AgLSAodGhpcy5wYWdlLm9mZnNldEhlaWdodCAtIDIqdmlld3BvcnRfaGVpZ2h0IC0gdGhpcy5mb290ZXIub2Zmc2V0SGVpZ2h0KTtcblxuICAgICAgICAgICAgaWYoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwuY2xhc3NMaXN0LnRvZ2dsZSgnc29jaWFsX2ZpeGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwuc3R5bGUuYm90dG9tID0gZGlzdGFuY2UgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgaWYodmlld3BvcnRfaGVpZ2h0ID49IDkwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5zdHlsZS5tYXJnaW5Ub3AgPSAoLXRoaXMucGFnaW5hdG9yLm9mZnNldEhlaWdodC8yIC0gZGlzdGFuY2UpICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwuY2xhc3NMaXN0LnRvZ2dsZSgnc29jaWFsX2ZpeGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuc29jaWFsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICBpZih2aWV3cG9ydF9oZWlnaHQgPj0gOTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja1N0YXRlQmluZCk7XG4gICAgICAgIH1cblxuICAgICAgICBzY3JvbGxUb0xpbmtzIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNsaWRlPVwiNlwiXScpLmNsaWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzY3JvbGxUb1NsaWRlIChldmVudCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxpbmcgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbGV0IGxpbmsgPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgICAgICAgICAgICAgLCBvbGRfaWQgPSBwYXJzZUludCh0aGlzLmN1cnJlbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlJyksIDEwKVxuICAgICAgICAgICAgICAgICwgaWQgPSBwYXJzZUludChsaW5rLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZScpLCAxMCkgLSAxXG4gICAgICAgICAgICAgICAgLCBkaWZmID0gTWF0aC5hYnMob2xkX2lkIC0gKGlkICsgMSkpXG4gICAgICAgICAgICAgICAgLCBzbGlkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV8nICsgKGlkKzEpKVxuICAgICAgICAgICAgICAgICwgdmlld3BvcnRfaGVpZ2h0ID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApXG4gICAgICAgICAgICAgICAgLy8gLCB2aWV3cG9ydF9oZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGUnKS5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgICAgICAsIHRhcmdldCA9IE1hdGgubWluKHZpZXdwb3J0X2hlaWdodCAqIGlkLCB0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0IC0gdmlld3BvcnRfaGVpZ2h0KTtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2luYXRvcl9fc2xpZGVfY3VycmVudCcpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gbGluaztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5jbGFzc0xpc3QuYWRkKCdwYWdpbmF0b3JfX3NsaWRlX2N1cnJlbnQnKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVfZ29sZCcpXG4gICAgICAgICAgICAgICAgfHwgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZV9ncmVlbicpXG4gICAgICAgICAgICAgICAgfHwgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZV9kYXJrJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLmNsYXNzTGlzdC50b2dnbGUoJ3BhZ2luYXRvcl9kYXJrJywgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5jbGFzc0xpc3QudG9nZ2xlKCdwYWdpbmF0b3JfZGFyaycsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnBhZ2UsIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KFxuICAgICAgICAgICAgICAgIHRoaXMucGFnZVxuICAgICAgICAgICAgICAgICwge1xuICAgICAgICAgICAgICAgICAgICB0b3A6IC10YXJnZXQrXCJweFwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAsIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGRpZmYqMjUwXG4gICAgICAgICAgICAgICAgICAgICwgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXcgU2xpZGVzO1xufSkoKTtcbiIsIiIsIndpbmRvdy52aWV3cG9ydFVuaXRzQnVnZ3lmaWxsLmluaXQoe2hhY2tzOiB3aW5kb3cudmlld3BvcnRVbml0c0J1Z2d5ZmlsbEhhY2tzfSk7XG52aWV3cG9ydFVuaXRzQnVnZ3lmaWxsLnJlZnJlc2goKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==