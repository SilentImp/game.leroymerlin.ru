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

                this.vh = document.querySelector('.vh');
                window.addEventListener('resize', this.resizeAll.bind(this));
                this.resizeAll();

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

                if (document.body.parentNode.classList.contains('touch')) {
                    var hammertime = new Hammer(this.page);
                    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
                    hammertime.on('swipeup', this.next.bind(this));
                    hammertime.on('swipedown', this.prev.bind(this));
                }
            }
        }, {
            key: "resizeAll",
            value: function resizeAll() {
                var _this2 = this;

                var slides = document.querySelectorAll('.slide'),
                    scenes = document.querySelectorAll('.scene'),
                    delta = undefined;

                [].forEach.call(slides, function (slide) {
                    slide.style.height = _this2.vh.offsetHeight + 'px';
                    slide.style.lineHeight = _this2.vh.offsetHeight + 'px';
                });

                [].forEach.call(scenes, function (scene) {
                    scene.style.height = 3 * _this2.vh.offsetHeight + 'px';
                });

                document.querySelector('.slide_1 .slide__wrapper').style.height = this.vh.offsetHeight + 'px';

                if (this.vh.offsetHeight >= 900) {
                    delta = 335;
                }

                if (this.vh.offsetHeight < 900) {
                    delta = 435;
                }

                document.querySelector('.slide__devices').style.maxHeight = this.vh.offsetHeight - delta + 'px';

                this.rescroll();
            }
        }, {
            key: "closeLocation",
            value: function closeLocation() {
                Velocity(this.loca, "stop");
                Velocity(this.loca, {
                    top: -this.vh.offsetHeight
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
                Velocity(this.navigation, "stop");
                Velocity(this.navigation, {
                    top: -this.vh.offsetHeight
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
                var _this3 = this;

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
                    _this3.wheeling = false;
                }, 750);
            }
        }, {
            key: "showVideo",
            value: function showVideo() {
                var _this4 = this;

                var iframe = document.createElement('IFRAME');
                iframe.className = "slide__screen-tube";
                iframe.setAttribute("width", 560);
                iframe.setAttribute("height", 315);
                iframe.setAttribute("frameborder", 0);
                iframe.setAttribute("allowfullscreen", true);
                iframe.setAttribute("src", this.video.getAttribute('data-src'));
                this.video.appendChild(iframe);
                setTimeout(function () {
                    Velocity(_this4.video, "fadeIn", { duration: 750 });
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
                document.body.parentNode.classList.toggle('landscape', this.vh.offsetWidth > this.vh.offsetHeight);
                document.body.parentNode.classList.toggle('limit-500', this.vh.offsetHeight <= 500);
                document.body.parentNode.classList.toggle('limit-600', this.vh.offsetHeight <= 600);
                document.body.parentNode.classList.toggle('limit-600-900', this.vh.offsetHeight > 600 && this.vh.offsetHeight <= 900);

                var button = this.current;
                if (button != null) {
                    button.click();
                }
            }
        }, {
            key: "checkState",
            value: function checkState() {
                var top = Math.abs(parseInt(this.page.style.top, 10)),
                    distance = top - (this.page.offsetHeight - this.vh.offsetHeight - this.footer.offsetHeight),
                    distance_long = top - (this.page.offsetHeight - 2 * this.vh.offsetHeight - this.footer.offsetHeight);

                if (distance > 0) {
                    this.social.style.bottom = distance + "px";
                    if (this.vh.offsetHeight >= 900) {
                        this.paginator.style.marginTop = -this.paginator.offsetHeight / 2 - distance + "px";
                    }
                } else {
                    this.social.removeAttribute('style');
                    if (this.vh.offsetHeight >= 900) {
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
                var _this5 = this;

                if (this.scrolling == true) {
                    return;
                }
                this.scrolling = true;

                var link = event.currentTarget,
                    old_id = parseInt(this.current.getAttribute('data-slide'), 10),
                    id = parseInt(link.getAttribute('data-slide'), 10) - 1,
                    diff = Math.abs(old_id - (id + 1)),
                    slide = document.querySelector('.slide_' + (id + 1)),
                    target = Math.min(this.vh.offsetHeight * id, this.page.offsetHeight - this.vh.offsetHeight);

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
                            _this5.scrolling = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2luYXRvci9wYWdpbmF0b3IuanMiLCJzb2NpYWwvc29jaWFsLmpzIiwiYnVnZ3lmaWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBWTtBQUNULGdCQUFZLENBQUM7Ozs7Ozs7UUFNTixNQUFNOzs7Ozs7O0FBTUcsaUJBTlQsTUFBTSxHQU1NO2tDQU5aLE1BQU07O0FBT0wsZ0JBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRztBQUN2QyxvQkFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRSxPQUFPLE9BQU8sRUFBRSxDQUFDO0FBQ3ZELHdCQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7MkJBQUssT0FBTyxFQUFFO2lCQUFBLENBQUMsQ0FBQzthQUNqRSxDQUFDLENBQUM7QUFDSCxpQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3BDOzs7Ozs7cUJBWkUsTUFBTTs7bUJBaUJKLGdCQUFHOzs7QUFDSixvQkFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLG9CQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEQsb0JBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxvQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pFLG9CQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsb0JBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENB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QUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUM1RCxNQUFNO0FBQ0gsd0JBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDM0Q7O0FBRUQsd0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLHdCQUFRLENBQ0osSUFBSSxDQUFDLElBQUksRUFDUDtBQUNFLHVCQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUMsSUFBSTtpQkFDaEIsRUFDSDtBQUNFLDRCQUFRLEVBQUUsSUFBSSxHQUFDLEdBQUc7QUFDaEIsNEJBQVEsRUFBRSxvQkFBTTtBQUNkLGtDQUFVLENBQUMsWUFBTTtBQUNiLG1DQUFLLFNBQVMsR0FBRyxLQUFLLENBQUM7eUJBQzFCLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ1g7aUJBQ0osQ0FBQyxDQUFDO2FBQ1Y7OztlQTFTRSxNQUFNOzs7QUE2U2IsUUFBSSxNQUFNLEVBQUEsQ0FBQztDQUNkLENBQUEsRUFBRyxDQUFDO0FDclRMOzs7QUNBQSxNQUFNLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQywyQkFBMkIsRUFBQyxDQUFDLENBQUM7QUFDaEYsc0JBQXNCLENBQUMsT0FBTyxFQUFFLENBQUMiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAqIEBjbGFzc2Rlc2MgQ2xhc3MgcmVwcmVzZW50aW5nIHRpdGxlXG4gICAgKiBAY2xhc3NcbiAgICAqL1xuICAgICBjbGFzcyBTbGlkZXMge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gU3RhcnQgaW5pdGlhbGl6YXRpb24gb24gZG9tbG9hZFxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIGxldCByZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gXCJsb2FkaW5nXCIpIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCk9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWFkeS50aGVuKHRoaXMuaW5pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQWRkIGV2ZW50cyBhbmQgaW5pdGlhbGl6ZSBzbGlkZXJcbiAgICAgICAgICovXG4gICAgICAgIGluaXQgKCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2luYXRvcicpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnBhZ2luYXRvci5xdWVyeVNlbGVjdG9yKCcucGFnaW5hdG9yX19zbGlkZV9jdXJyZW50Jyk7XG4gICAgICAgICAgICB0aGlzLnNvY2lhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWwnKTtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTdGF0ZUJpbmQgPSB0aGlzLmNoZWNrU3RhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd192aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fdmlkZW8nKTtcbiAgICAgICAgICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3NjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy5oaWRlX3ZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19zY3JlZW4tY2xvc2UnKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXZpZ2F0aW9uJyk7XG4gICAgICAgICAgICB0aGlzLmxvY2EgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19vcHRpb25zJyk7XG5cbiAgICAgICAgICAgIHRoaXMudmggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmgnKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUFsbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplQWxsKCk7XG5cbiAgICAgICAgICAgIGxldCBidXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idXJnZXInKTtcbiAgICAgICAgICAgIGJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub3Blbk5hdmlnYXRpb24uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGxldCBjbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2Nsb3NlJyk7XG4gICAgICAgICAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2VOYXZpZ2F0aW9uLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBsZXQgY2xvc2VfbG9jYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19jbG9zZS1sb2NhdGlvbicpO1xuICAgICAgICAgICAgY2xvc2VfbG9jYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsb3NlTG9jYXRpb24uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGxldCBvcGVuX2xvY2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fb3Blbi1sb2NhdGlvbicpO1xuICAgICAgICAgICAgb3Blbl9sb2NhdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub3BlbkxvY2F0aW9uLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBsZXQgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZV9fcGxheScpO1xuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGJ1dHRvbnMsIChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNjcm9sbFRvTGlua3MuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IHBhZ2luYXRvcl9saW5rcyA9IHRoaXMucGFnaW5hdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdpbmF0b3JfX3NsaWRlJyk7XG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwocGFnaW5hdG9yX2xpbmtzLCAobGluaykgPT4ge1xuICAgICAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNjcm9sbFRvU2xpZGUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGFnaW5hdG9yX2xpbmtzWzBdLmNsaWNrKCk7XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja1N0YXRlQmluZCk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmtleWJvYXJkQ29udHJvbGxlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2Nyb2xsLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy53aGVlbENvbnRyb2xsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLnNob3dfdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNob3dWaWRlby5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuaGlkZV92aWRlby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZVZpZGVvLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndG91Y2gnKSkge1xuICAgICAgICAgICAgICAgIGxldCBoYW1tZXJ0aW1lID0gbmV3IEhhbW1lcih0aGlzLnBhZ2UpO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUuZ2V0KCdzd2lwZScpLnNldCh7IGRpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9WRVJUSUNBTCB9KTtcbiAgICAgICAgICAgICAgICBoYW1tZXJ0aW1lLm9uKCdzd2lwZXVwJywgdGhpcy5uZXh0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUub24oJ3N3aXBlZG93bicsIHRoaXMucHJldi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2l6ZUFsbCAoKSB7XG5cbiAgICAgICAgICAgIGxldCBzbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGUnKVxuICAgICAgICAgICAgICAgICwgc2NlbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNjZW5lJylcbiAgICAgICAgICAgICAgICAsIGRlbHRhO1xuXG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwoc2xpZGVzLCAoc2xpZGUpID0+IHtcbiAgICAgICAgICAgICAgICBzbGlkZS5zdHlsZS5oZWlnaHQgPSB0aGlzLnZoLm9mZnNldEhlaWdodCsncHgnO1xuICAgICAgICAgICAgICAgIHNsaWRlLnN0eWxlLmxpbmVIZWlnaHQgPSB0aGlzLnZoLm9mZnNldEhlaWdodCsncHgnO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChzY2VuZXMsIChzY2VuZSkgPT4ge1xuICAgICAgICAgICAgICAgIHNjZW5lLnN0eWxlLmhlaWdodCA9IDMqdGhpcy52aC5vZmZzZXRIZWlnaHQrJ3B4JztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfMSAuc2xpZGVfX3dyYXBwZXInKS5zdHlsZS5oZWlnaHQgPSB0aGlzLnZoLm9mZnNldEhlaWdodCsncHgnO1xuXG4gICAgICAgICAgICBpZiAodGhpcy52aC5vZmZzZXRIZWlnaHQ+PTkwMCkge1xuICAgICAgICAgICAgICAgIGRlbHRhID0gMzM1O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy52aC5vZmZzZXRIZWlnaHQ8OTAwKSB7XG4gICAgICAgICAgICAgICAgZGVsdGEgPSA0MzU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fZGV2aWNlcycpLnN0eWxlLm1heEhlaWdodCA9ICh0aGlzLnZoLm9mZnNldEhlaWdodCAtIGRlbHRhKSsncHgnO1xuXG5cbiAgICAgICAgICAgIHRoaXMucmVzY3JvbGwoKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY2xvc2VMb2NhdGlvbiAoKSB7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLmxvY2EsIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubG9jYSwge1xuICAgICAgICAgICAgICAgIHRvcDogLXRoaXMudmgub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcGVuTG9jYXRpb24gKCkge1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5sb2NhLCBcInN0b3BcIik7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLmxvY2EsIHtcbiAgICAgICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY2xvc2VOYXZpZ2F0aW9uICgpIHtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubmF2aWdhdGlvbiwgXCJzdG9wXCIpO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5uYXZpZ2F0aW9uLCB7XG4gICAgICAgICAgICAgICAgdG9wOiAtdGhpcy52aC5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wZW5OYXZpZ2F0aW9uICgpIHtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubmF2aWdhdGlvbiwgXCJzdG9wXCIpO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5uYXZpZ2F0aW9uLCB7XG4gICAgICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGVlbENvbnRyb2xsZXIgKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy53aGVlbGluZyA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLndoZWVsaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChldmVudC5kZWx0YVkgPiAzKXtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGVsdGFZIDwgLTMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXYoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9Pnt0aGlzLndoZWVsaW5nID0gZmFsc2U7fSwgNzUwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dWaWRlbyAoKSB7XG4gICAgICAgICAgICBsZXQgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnSUZSQU1FJyk7XG4gICAgICAgICAgICBpZnJhbWUuY2xhc3NOYW1lID0gXCJzbGlkZV9fc2NyZWVuLXR1YmVcIjtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCA1NjApO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCAzMTUpO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImZyYW1lYm9yZGVyXCIsIDApO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImFsbG93ZnVsbHNjcmVlblwiLCB0cnVlKTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgdGhpcy52aWRlby5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpO1xuICAgICAgICAgICAgdGhpcy52aWRlby5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMudmlkZW8sIFwiZmFkZUluXCIsIHtkdXJhdGlvbjogNzUwfSk7XG4gICAgICAgICAgICB9LCAyNSk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlVmlkZW8gKCkge1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy52aWRlbywgXCJmYWRlT3V0XCIsIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNzUwXG4gICAgICAgICAgICAgICAgLCBjb21wbGV0ZTogKCk9PntcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19zY3JlZW4tdHViZScpO1xuICAgICAgICAgICAgICAgICAgICB2aWRlby5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHZpZGVvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGtleWJvYXJkQ29udHJvbGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJldigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJldiAoKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnbGFuZHNjYXBlJylcbiAgICAgICAgICAgICAgICAmJiBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW1pdC01MDAnKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuY3VycmVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKGJ1dHRvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuZXh0ICgpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdsYW5kc2NhcGUnKVxuICAgICAgICAgICAgICAgICYmIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbWl0LTUwMCcpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5jdXJyZW50Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChidXR0b24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzY3JvbGwgKCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ2xhbmRzY2FwZScsICggdGhpcy52aC5vZmZzZXRXaWR0aCA+IHRoaXMudmgub2Zmc2V0SGVpZ2h0KSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGltaXQtNTAwJywgKHRoaXMudmgub2Zmc2V0SGVpZ2h0IDw9IDUwMCkpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ2xpbWl0LTYwMCcsICh0aGlzLnZoLm9mZnNldEhlaWdodCA8PSA2MDAgKSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGltaXQtNjAwLTkwMCcsICh0aGlzLnZoLm9mZnNldEhlaWdodCA+IDYwMCkmJih0aGlzLnZoLm9mZnNldEhlaWdodDw9OTAwKSk7XG5cbiAgICAgICAgICAgIGxldCBidXR0b24gPSB0aGlzLmN1cnJlbnQ7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrU3RhdGUgKCkge1xuICAgICAgICAgICAgbGV0IHRvcCA9IE1hdGguYWJzKHBhcnNlSW50KHRoaXMucGFnZS5zdHlsZS50b3AsIDEwKSlcbiAgICAgICAgICAgICAgICAsIGRpc3RhbmNlID0gdG9wIC0gKHRoaXMucGFnZS5vZmZzZXRIZWlnaHQgLSB0aGlzLnZoLm9mZnNldEhlaWdodCAtIHRoaXMuZm9vdGVyLm9mZnNldEhlaWdodClcbiAgICAgICAgICAgICAgICAsIGRpc3RhbmNlX2xvbmcgPSB0b3AgLSAodGhpcy5wYWdlLm9mZnNldEhlaWdodCAtIDIqdGhpcy52aC5vZmZzZXRIZWlnaHQgLSB0aGlzLmZvb3Rlci5vZmZzZXRIZWlnaHQpO1xuXG4gICAgICAgICAgICBpZihkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2lhbC5zdHlsZS5ib3R0b20gPSBkaXN0YW5jZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnZoLm9mZnNldEhlaWdodCA+PSA5MDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3Iuc3R5bGUubWFyZ2luVG9wID0gKC10aGlzLnBhZ2luYXRvci5vZmZzZXRIZWlnaHQvMiAtIGRpc3RhbmNlKSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc29jaWFsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnZoLm9mZnNldEhlaWdodCA+PSA5MDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrU3RhdGVCaW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjcm9sbFRvTGlua3MgKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2xpZGU9XCI2XCJdJykuY2xpY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjcm9sbFRvU2xpZGUgKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbGluZyA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBsZXQgbGluayA9IGV2ZW50LmN1cnJlbnRUYXJnZXRcbiAgICAgICAgICAgICAgICAsIG9sZF9pZCA9IHBhcnNlSW50KHRoaXMuY3VycmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGUnKSwgMTApXG4gICAgICAgICAgICAgICAgLCBpZCA9IHBhcnNlSW50KGxpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlJyksIDEwKSAtIDFcbiAgICAgICAgICAgICAgICAsIGRpZmYgPSBNYXRoLmFicyhvbGRfaWQgLSAoaWQgKyAxKSlcbiAgICAgICAgICAgICAgICAsIHNsaWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlXycgKyAoaWQrMSkpXG4gICAgICAgICAgICAgICAgLCB0YXJnZXQgPSBNYXRoLm1pbih0aGlzLnZoLm9mZnNldEhlaWdodCAqIGlkLCB0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0IC0gdGhpcy52aC5vZmZzZXRIZWlnaHQpO1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuY2xhc3NMaXN0LnJlbW92ZSgncGFnaW5hdG9yX19zbGlkZV9jdXJyZW50Jyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBsaW5rO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50LmNsYXNzTGlzdC5hZGQoJ3BhZ2luYXRvcl9fc2xpZGVfY3VycmVudCcpO1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZV9nb2xkJylcbiAgICAgICAgICAgICAgICB8fCBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NsaWRlX2dyZWVuJylcbiAgICAgICAgICAgICAgICB8fCBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NsaWRlX2RhcmsnKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IuY2xhc3NMaXN0LnRvZ2dsZSgncGFnaW5hdG9yX2RhcmsnLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLmNsYXNzTGlzdC50b2dnbGUoJ3BhZ2luYXRvcl9kYXJrJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMucGFnZSwgXCJzdG9wXCIpO1xuICAgICAgICAgICAgVmVsb2NpdHkoXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlXG4gICAgICAgICAgICAgICAgLCB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogLXRhcmdldCtcInB4XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICwge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogZGlmZioyNTBcbiAgICAgICAgICAgICAgICAgICAgLCBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5ldyBTbGlkZXM7XG59KSgpO1xuIiwiIiwid2luZG93LnZpZXdwb3J0VW5pdHNCdWdneWZpbGwuaW5pdCh7aGFja3M6IHdpbmRvdy52aWV3cG9ydFVuaXRzQnVnZ3lmaWxsSGFja3N9KTtcbnZpZXdwb3J0VW5pdHNCdWdneWZpbGwucmVmcmVzaCgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9