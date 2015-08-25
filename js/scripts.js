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
                    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
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
                    road = document.querySelector('.road-2'),
                    delta = undefined;

                [].forEach.call(slides, function (slide) {
                    slide.style.height = _this2.vh.offsetHeight + 'px';
                    slide.style.lineHeight = _this2.vh.offsetHeight + 'px';
                });

                [].forEach.call(scenes, function (scene) {
                    scene.style.top = 2 * _this2.vh.offsetHeight + 'px';

                    if (_this2.vh.offsetWidth > 850) {
                        road.style.height = 3 * _this2.vh.offsetHeight - 102 + 'px';
                        scene.style.height = 3 * _this2.vh.offsetHeight - 102 + 'px';
                    } else {
                        scene.style.height = 3 * _this2.vh.offsetHeight + 'px';
                    }
                });

                document.querySelector('.slide_1 .slide__wrapper').style.height = this.vh.offsetHeight + 'px';

                if (this.vh.offsetHeight >= 900) {
                    delta = 335;
                }

                if (this.vh.offsetHeight < 900) {
                    delta = 435;
                }

                document.querySelector('.slide__devices').style.maxHeight = this.vh.offsetHeight - delta + 'px';

                document.querySelector('.stars-from-bag').style.top = 2.75 * this.vh.offsetHeight + 'px';

                document.querySelector('.bag').style.top = 2.75 * this.vh.offsetHeight - 31 + 'px';

                document.querySelector('.clock').style.top = 2 * this.vh.offsetHeight + 'px';
                document.querySelector('.clock__arrow-1').style.top = 2 * this.vh.offsetHeight + 'px';
                document.querySelector('.clock__arrow-2').style.top = 2 * this.vh.offsetHeight + 'px';

                this.rescroll();
            }
        }, {
            key: "closeLocation",
            value: function closeLocation() {
                Velocity(this.loca, "stop");
                Velocity(this.loca, {
                    top: -this.vh.offsetHeight * 2 + 'px'
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
                    top: -this.vh.offsetHeight * 2 + 'px'
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
                if (event.deltaY > 0) {
                    this.next();
                } else if (event.deltaY < 0) {
                    this.prev();
                }
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
                var button = this.current.previousElementSibling;
                if (button != null) {
                    button.click();
                }
            }
        }, {
            key: "next",
            value: function next() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2luYXRvci9wYWdpbmF0b3IuanMiLCJzb2NpYWwvc29jaWFsLmpzIiwiYnVnZ3lmaWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBWTtBQUNULGdCQUFZLENBQUM7Ozs7Ozs7UUFNTixNQUFNOzs7Ozs7O0FBTUcsaUJBTlQsTUFBTSxHQU1NO2tDQU5aLE1BQU07O0FBT0wsZ0JBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRztBQUN2QyxvQkFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRSxPQUFPLE9BQU8sRUFBRSxDQUFDO0FBQ3ZELHdCQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7MkJBQUssT0FBTyxFQUFFO2lCQUFBLENBQUMsQ0FBQzthQUNqRSxDQUFDLENBQUM7QUFDSCxpQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3BDOzs7Ozs7cUJBWkUsTUFBTTs7bUJBaUJKLGdCQUFHOzs7QUFDSixvQkFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLG9CQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEQsb0JBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxvQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pFLG9CQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsb0JBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsb0JBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMxRCxvQkFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdEQsb0JBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2pFLG9CQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QixvQkFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDaEUsb0JBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUV2RCxvQkFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLHNCQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDN0Qsb0JBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFakIsb0JBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN2RCxzQkFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUVqRSxvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3JELHFCQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRWpFLG9CQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkUsOEJBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFeEUsb0JBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNyRSw2QkFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUV0RSxvQkFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3hELGtCQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDakMsMEJBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBSyxhQUFhLENBQUMsSUFBSSxPQUFNLENBQUMsQ0FBQztpQkFDbkUsQ0FBQyxDQUFDOztBQUVILG9CQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDM0Usa0JBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxVQUFDLElBQUksRUFBSztBQUN2Qyx3QkFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFLLGFBQWEsQ0FBQyxJQUFJLE9BQU0sQ0FBQyxDQUFDO2lCQUNqRSxDQUFDLENBQUM7O0FBRUgsK0JBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFM0Isc0JBQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbEQsc0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLHNCQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDNUQsc0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNsRSxvQkFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNyRSxvQkFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFckUsb0JBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN0RCx3QkFBSSxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLDhCQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztBQUNqRSw4QkFBVSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMvQyw4QkFBVSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDcEQ7YUFDSjs7O21CQUVTLHFCQUFHOzs7QUFFVCxvQkFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztvQkFDMUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7b0JBQzVDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztvQkFDeEMsS0FBSyxZQUFBLENBQUM7O0FBRVosa0JBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQUssRUFBSztBQUMvQix5QkFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsT0FBSyxFQUFFLENBQUMsWUFBWSxHQUFDLElBQUksQ0FBQztBQUMvQyx5QkFBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsT0FBSyxFQUFFLENBQUMsWUFBWSxHQUFDLElBQUksQ0FBQztpQkFDdEQsQ0FBQyxDQUFDOztBQUVILGtCQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDL0IseUJBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBQyxPQUFLLEVBQUUsQ0FBQyxZQUFZLEdBQUMsSUFBSSxDQUFDOztBQUU5Qyx3QkFBSSxPQUFLLEVBQUUsQ0FBQyxXQUFXLEdBQUcsR0FBRyxFQUFFO0FBQzNCLDRCQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxBQUFDLENBQUMsR0FBQyxPQUFLLEVBQUUsQ0FBQyxZQUFZLEdBQUMsR0FBRyxHQUFFLElBQUksQ0FBQztBQUN0RCw2QkFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQUFBQyxDQUFDLEdBQUMsT0FBSyxFQUFFLENBQUMsWUFBWSxHQUFDLEdBQUcsR0FBRSxJQUFJLENBQUM7cUJBQzFELE1BQU07QUFDSCw2QkFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFDLE9BQUssRUFBRSxDQUFDLFlBQVksR0FBQyxJQUFJLENBQUM7cUJBQ3BEO2lCQUNKLENBQUMsQ0FBQzs7QUFFSCx3QkFBUSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUMsSUFBSSxDQUFDOztBQUU1RixvQkFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksSUFBRSxHQUFHLEVBQUU7QUFDM0IseUJBQUssR0FBRyxHQUFHLENBQUM7aUJBQ2Y7O0FBRUQsb0JBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUMsR0FBRyxFQUFFO0FBQzFCLHlCQUFLLEdBQUcsR0FBRyxDQUFDO2lCQUNmOztBQUVELHdCQUFRLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxBQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFHLEtBQUssR0FBRSxJQUFJLENBQUM7O0FBRWhHLHdCQUFRLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUMsSUFBSSxDQUFDOztBQUVyRix3QkFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEFBQUMsSUFBSSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFHLEVBQUUsR0FBRSxJQUFJLENBQUM7O0FBRWpGLHdCQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFDLElBQUksQ0FBQztBQUN6RSx3QkFBUSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFDLElBQUksQ0FBQztBQUNsRix3QkFBUSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFDLElBQUksQ0FBQzs7QUFHbEYsb0JBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNuQjs7O21CQUdhLHlCQUFHO0FBQ2Isd0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLHdCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtBQUNoQix1QkFBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUMsQ0FBQyxHQUFDLElBQUk7aUJBQ3BDLEVBQUU7QUFDQyw0QkFBUSxFQUFFLEdBQUc7aUJBQ2hCLENBQUMsQ0FBQzthQUNOOzs7bUJBRVksd0JBQUc7QUFDWix3QkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUIsd0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2hCLHVCQUFHLEVBQUUsQ0FBQztpQkFDVCxFQUFFO0FBQ0MsNEJBQVEsRUFBRSxHQUFHO2lCQUNoQixDQUFDLENBQUM7YUFDTjs7O21CQUdlLDJCQUFHO0FBQ2Ysd0JBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLHdCQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN0Qix1QkFBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUMsQ0FBQyxHQUFDLElBQUk7aUJBQ3BDLEVBQUU7QUFDQyw0QkFBUSxFQUFFLEdBQUc7aUJBQ2hCLENBQUMsQ0FBQzthQUNOOzs7bUJBRWMsMEJBQUc7QUFDZCx3QkFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEMsd0JBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3RCLHVCQUFHLEVBQUUsQ0FBQztpQkFDVCxFQUFFO0FBQ0MsNEJBQVEsRUFBRSxHQUFHO2lCQUNoQixDQUFDLENBQUM7YUFDTjs7O21CQUVlLHlCQUFDLEtBQUssRUFBRTtBQUNwQixvQkFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQztBQUNqQix3QkFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN6Qix3QkFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNmO2FBQ0o7OzttQkFFUyxxQkFBRzs7O0FBQ1Qsb0JBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUMsc0JBQU0sQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUM7QUFDeEMsc0JBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLHNCQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuQyxzQkFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsc0JBQU0sQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0Msc0JBQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDaEUsb0JBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLDBCQUFVLENBQUMsWUFBSTtBQUNYLDRCQUFRLENBQUMsT0FBSyxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7aUJBQ25ELEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDVjs7O21CQUVTLHFCQUFHO0FBQ1Qsd0JBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtBQUM1Qiw0QkFBUSxFQUFFLEdBQUc7QUFDWCw0QkFBUSxFQUFFLG9CQUFJO0FBQ1osNEJBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMxRCw2QkFBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ3ZDO2lCQUNKLENBQUMsQ0FBQzthQUNOOzs7bUJBRWtCLDRCQUFDLEtBQUssRUFBRTtBQUN2Qix3QkFBUSxLQUFLLENBQUMsT0FBTztBQUNyQix5QkFBSyxFQUFFO0FBQ0gsNkJBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2Qiw0QkFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osOEJBQU07QUFBQSxBQUNWLHlCQUFLLEVBQUU7QUFDSCw2QkFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLDRCQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWiw4QkFBTTtBQUFBLGlCQUNUO2FBQ0o7OzttQkFFSSxnQkFBRztBQUNKLG9CQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDO0FBQ2pELG9CQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFDaEIsMEJBQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDbEI7YUFDSjs7O21CQUVJLGdCQUFHO0FBQ0osb0JBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUM7QUFDN0Msb0JBQUksTUFBTSxJQUFJLElBQUksRUFBRTtBQUNoQiwwQkFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNsQjthQUNKOzs7bUJBRVEsb0JBQUc7QUFDUix3QkFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUUsQ0FBQztBQUN0Ryx3QkFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLElBQUksR0FBRyxDQUFFLENBQUM7QUFDdEYsd0JBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxJQUFJLEdBQUcsQ0FBRyxDQUFDO0FBQ3ZGLHdCQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxBQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksSUFBRSxHQUFHLEFBQUMsQ0FBQyxDQUFDOztBQUV0SCxvQkFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUMxQixvQkFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ2hCLDBCQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ2xCO2FBQ0o7OzttQkFFVSxzQkFBRztBQUNWLG9CQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQy9DLFFBQVEsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUEsQUFBQztvQkFDM0YsYUFBYSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUEsQUFBQyxDQUFDOztBQUV6RyxvQkFBRyxRQUFRLEdBQUcsQ0FBQyxFQUFFO0FBQ2Isd0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQzNDLHdCQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxJQUFJLEdBQUcsRUFBRTtBQUM1Qiw0QkFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEFBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBQyxDQUFDLEdBQUcsUUFBUSxHQUFJLElBQUksQ0FBQztxQkFDdkY7aUJBQ0osTUFBTTtBQUNILHdCQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQyx3QkFBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksSUFBSSxHQUFHLEVBQUU7QUFDNUIsNEJBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUMzQztpQkFDSjs7QUFFRCxzQkFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUNyRDs7O21CQUVhLHVCQUFDLEtBQUssRUFBRTtBQUNsQixxQkFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLHdCQUFRLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDdEQ7OzttQkFFYSx1QkFBQyxLQUFLLEVBQUU7OztBQUVsQixvQkFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtBQUN4QiwyQkFBTztpQkFDVjtBQUNELG9CQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFdEIsb0JBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxhQUFhO29CQUN4QixNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDOUQsRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ3RELElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQztvQkFDbEMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxJQUFJLEVBQUUsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO29CQUNsRCxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFbEcsb0JBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzFELG9CQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixvQkFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRXZELG9CQUNJLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUNuQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFDdkMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQzNDO0FBQ0Usd0JBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDNUQsTUFBTTtBQUNILHdCQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQzNEOztBQUVELHdCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1Qix3QkFBUSxDQUNKLElBQUksQ0FBQyxJQUFJLEVBQ1A7QUFDRSx1QkFBRyxFQUFFLENBQUMsTUFBTSxHQUFDLElBQUk7aUJBQ2hCLEVBQ0g7QUFDRSw0QkFBUSxFQUFFLElBQUksR0FBQyxHQUFHO0FBQ2hCLDRCQUFRLEVBQUUsb0JBQU07QUFDZCxrQ0FBVSxDQUFDLFlBQU07QUFDYixtQ0FBSyxTQUFTLEdBQUcsS0FBSyxDQUFDO3lCQUMxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNYO2lCQUNKLENBQUMsQ0FBQzthQUNWOzs7ZUF6U0UsTUFBTTs7O0FBNFNiLFFBQUksTUFBTSxFQUFBLENBQUM7Q0FDZCxDQUFBLEVBQUcsQ0FBQztBQ3BUTDs7O0FDQUEsTUFBTSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsMkJBQTJCLEVBQUMsQ0FBQyxDQUFDO0FBQ2hGLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxDQUFDIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgKiBAY2xhc3NkZXNjIENsYXNzIHJlcHJlc2VudGluZyB0aXRsZVxuICAgICogQGNsYXNzXG4gICAgKi9cbiAgICAgY2xhc3MgU2xpZGVzIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFN0YXJ0IGluaXRpYWxpemF0aW9uIG9uIGRvbWxvYWRcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICBsZXQgcmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9IFwibG9hZGluZ1wiKSByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpPT4gcmVzb2x2ZSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVhZHkudGhlbih0aGlzLmluaXQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIEFkZCBldmVudHMgYW5kIGluaXRpYWxpemUgc2xpZGVyXG4gICAgICAgICAqL1xuICAgICAgICBpbml0ICgpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlJyk7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdpbmF0b3InKTtcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3RlcicpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5wYWdpbmF0b3IucXVlcnlTZWxlY3RvcignLnBhZ2luYXRvcl9fc2xpZGVfY3VycmVudCcpO1xuICAgICAgICAgICAgdGhpcy5zb2NpYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc29jaWFsJyk7XG4gICAgICAgICAgICB0aGlzLmNoZWNrU3RhdGVCaW5kID0gdGhpcy5jaGVja1N0YXRlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNob3dfdmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3ZpZGVvJyk7XG4gICAgICAgICAgICB0aGlzLnZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19zY3JlZW4nKTtcbiAgICAgICAgICAgIHRoaXMuaGlkZV92aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fc2NyZWVuLWNsb3NlJyk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2aWdhdGlvbicpO1xuICAgICAgICAgICAgdGhpcy5sb2NhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fb3B0aW9ucycpO1xuXG4gICAgICAgICAgICB0aGlzLnZoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZoJyk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVBbGwuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUFsbCgpO1xuXG4gICAgICAgICAgICBsZXQgYnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnVyZ2VyJyk7XG4gICAgICAgICAgICBidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9wZW5OYXZpZ2F0aW9uLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBsZXQgY2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19jbG9zZScpO1xuICAgICAgICAgICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsb3NlTmF2aWdhdGlvbi5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgbGV0IGNsb3NlX2xvY2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fY2xvc2UtbG9jYXRpb24nKTtcbiAgICAgICAgICAgIGNsb3NlX2xvY2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbG9zZUxvY2F0aW9uLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBsZXQgb3Blbl9sb2NhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX29wZW4tbG9jYXRpb24nKTtcbiAgICAgICAgICAgIG9wZW5fbG9jYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9wZW5Mb2NhdGlvbi5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgbGV0IGJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVfX3BsYXknKTtcbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChidXR0b25zLCAoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zY3JvbGxUb0xpbmtzLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBwYWdpbmF0b3JfbGlua3MgPSB0aGlzLnBhZ2luYXRvci5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5hdG9yX19zbGlkZScpO1xuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKHBhZ2luYXRvcl9saW5rcywgKGxpbmspID0+IHtcbiAgICAgICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zY3JvbGxUb1NsaWRlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBhZ2luYXRvcl9saW5rc1swXS5jbGljaygpO1xuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY2hlY2tTdGF0ZUJpbmQpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5rZXlib2FyZENvbnRyb2xsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNjcm9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMud2hlZWxDb250cm9sbGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5zaG93X3ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zaG93VmlkZW8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmhpZGVfdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGVWaWRlby5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3RvdWNoJykpIHtcbiAgICAgICAgICAgICAgICBsZXQgaGFtbWVydGltZSA9IG5ldyBIYW1tZXIodGhpcy5wYWdlKTtcbiAgICAgICAgICAgICAgICBoYW1tZXJ0aW1lLmdldCgnc3dpcGUnKS5zZXQoeyBkaXJlY3Rpb246IEhhbW1lci5ESVJFQ1RJT05fQUxMIH0pO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUub24oJ3N3aXBldXAnLCB0aGlzLm5leHQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgaGFtbWVydGltZS5vbignc3dpcGVkb3duJywgdGhpcy5wcmV2LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzaXplQWxsICgpIHtcblxuICAgICAgICAgICAgbGV0IHNsaWRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZScpXG4gICAgICAgICAgICAgICAgLCBzY2VuZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2NlbmUnKVxuICAgICAgICAgICAgICAgICwgcm9hZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb2FkLTInKVxuICAgICAgICAgICAgICAgICwgZGVsdGE7XG5cbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChzbGlkZXMsIChzbGlkZSkgPT4ge1xuICAgICAgICAgICAgICAgIHNsaWRlLnN0eWxlLmhlaWdodCA9IHRoaXMudmgub2Zmc2V0SGVpZ2h0KydweCc7XG4gICAgICAgICAgICAgICAgc2xpZGUuc3R5bGUubGluZUhlaWdodCA9IHRoaXMudmgub2Zmc2V0SGVpZ2h0KydweCc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKHNjZW5lcywgKHNjZW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgc2NlbmUuc3R5bGUudG9wID0gMip0aGlzLnZoLm9mZnNldEhlaWdodCsncHgnO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmgub2Zmc2V0V2lkdGggPiA4NTApIHtcbiAgICAgICAgICAgICAgICAgICAgcm9hZC5zdHlsZS5oZWlnaHQgPSAoMyp0aGlzLnZoLm9mZnNldEhlaWdodC0xMDIpKydweCc7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lLnN0eWxlLmhlaWdodCA9ICgzKnRoaXMudmgub2Zmc2V0SGVpZ2h0LTEwMikrJ3B4JztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzY2VuZS5zdHlsZS5oZWlnaHQgPSAzKnRoaXMudmgub2Zmc2V0SGVpZ2h0KydweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV8xIC5zbGlkZV9fd3JhcHBlcicpLnN0eWxlLmhlaWdodCA9IHRoaXMudmgub2Zmc2V0SGVpZ2h0KydweCc7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZoLm9mZnNldEhlaWdodD49OTAwKSB7XG4gICAgICAgICAgICAgICAgZGVsdGEgPSAzMzU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZoLm9mZnNldEhlaWdodDw5MDApIHtcbiAgICAgICAgICAgICAgICBkZWx0YSA9IDQzNTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19kZXZpY2VzJykuc3R5bGUubWF4SGVpZ2h0ID0gKHRoaXMudmgub2Zmc2V0SGVpZ2h0IC0gZGVsdGEpKydweCc7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFycy1mcm9tLWJhZycpLnN0eWxlLnRvcCA9IDIuNzUqdGhpcy52aC5vZmZzZXRIZWlnaHQrJ3B4JztcblxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhZycpLnN0eWxlLnRvcCA9ICgyLjc1KnRoaXMudmgub2Zmc2V0SGVpZ2h0IC0gMzEpKydweCc7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9jaycpLnN0eWxlLnRvcCA9IDIqdGhpcy52aC5vZmZzZXRIZWlnaHQrJ3B4JztcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9ja19fYXJyb3ctMScpLnN0eWxlLnRvcCA9IDIqdGhpcy52aC5vZmZzZXRIZWlnaHQrJ3B4JztcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9ja19fYXJyb3ctMicpLnN0eWxlLnRvcCA9IDIqdGhpcy52aC5vZmZzZXRIZWlnaHQrJ3B4JztcblxuXG4gICAgICAgICAgICB0aGlzLnJlc2Nyb2xsKCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNsb3NlTG9jYXRpb24gKCkge1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5sb2NhLCBcInN0b3BcIik7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLmxvY2EsIHtcbiAgICAgICAgICAgICAgICB0b3A6IC10aGlzLnZoLm9mZnNldEhlaWdodCoyKydweCdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wZW5Mb2NhdGlvbiAoKSB7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLmxvY2EsIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubG9jYSwge1xuICAgICAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICBjbG9zZU5hdmlnYXRpb24gKCkge1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5uYXZpZ2F0aW9uLCBcInN0b3BcIik7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLm5hdmlnYXRpb24sIHtcbiAgICAgICAgICAgICAgICB0b3A6IC10aGlzLnZoLm9mZnNldEhlaWdodCoyKydweCdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wZW5OYXZpZ2F0aW9uICgpIHtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubmF2aWdhdGlvbiwgXCJzdG9wXCIpO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5uYXZpZ2F0aW9uLCB7XG4gICAgICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGVlbENvbnRyb2xsZXIgKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGVsdGFZID4gMCl7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmRlbHRhWSA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXYoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dWaWRlbyAoKSB7XG4gICAgICAgICAgICBsZXQgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnSUZSQU1FJyk7XG4gICAgICAgICAgICBpZnJhbWUuY2xhc3NOYW1lID0gXCJzbGlkZV9fc2NyZWVuLXR1YmVcIjtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCA1NjApO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCAzMTUpO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImZyYW1lYm9yZGVyXCIsIDApO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImFsbG93ZnVsbHNjcmVlblwiLCB0cnVlKTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgdGhpcy52aWRlby5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpO1xuICAgICAgICAgICAgdGhpcy52aWRlby5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMudmlkZW8sIFwiZmFkZUluXCIsIHtkdXJhdGlvbjogNzUwfSk7XG4gICAgICAgICAgICB9LCAyNSk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlVmlkZW8gKCkge1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy52aWRlbywgXCJmYWRlT3V0XCIsIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNzUwXG4gICAgICAgICAgICAgICAgLCBjb21wbGV0ZTogKCk9PntcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19zY3JlZW4tdHViZScpO1xuICAgICAgICAgICAgICAgICAgICB2aWRlby5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHZpZGVvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGtleWJvYXJkQ29udHJvbGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJldigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJldiAoKSB7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5jdXJyZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQgKCkge1xuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuY3VycmVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2Nyb2xsICgpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdsYW5kc2NhcGUnLCAoIHRoaXMudmgub2Zmc2V0V2lkdGggPiB0aGlzLnZoLm9mZnNldEhlaWdodCkpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ2xpbWl0LTUwMCcsICh0aGlzLnZoLm9mZnNldEhlaWdodCA8PSA1MDApKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdsaW1pdC02MDAnLCAodGhpcy52aC5vZmZzZXRIZWlnaHQgPD0gNjAwICkpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ2xpbWl0LTYwMC05MDAnLCAodGhpcy52aC5vZmZzZXRIZWlnaHQgPiA2MDApJiYodGhpcy52aC5vZmZzZXRIZWlnaHQ8PTkwMCkpO1xuXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5jdXJyZW50O1xuICAgICAgICAgICAgaWYgKGJ1dHRvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1N0YXRlICgpIHtcbiAgICAgICAgICAgIGxldCB0b3AgPSBNYXRoLmFicyhwYXJzZUludCh0aGlzLnBhZ2Uuc3R5bGUudG9wLCAxMCkpXG4gICAgICAgICAgICAgICAgLCBkaXN0YW5jZSA9IHRvcCAtICh0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0IC0gdGhpcy52aC5vZmZzZXRIZWlnaHQgLSB0aGlzLmZvb3Rlci5vZmZzZXRIZWlnaHQpXG4gICAgICAgICAgICAgICAgLCBkaXN0YW5jZV9sb25nID0gdG9wIC0gKHRoaXMucGFnZS5vZmZzZXRIZWlnaHQgLSAyKnRoaXMudmgub2Zmc2V0SGVpZ2h0IC0gdGhpcy5mb290ZXIub2Zmc2V0SGVpZ2h0KTtcblxuICAgICAgICAgICAgaWYoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwuc3R5bGUuYm90dG9tID0gZGlzdGFuY2UgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgaWYodGhpcy52aC5vZmZzZXRIZWlnaHQgPj0gOTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLnN0eWxlLm1hcmdpblRvcCA9ICgtdGhpcy5wYWdpbmF0b3Iub2Zmc2V0SGVpZ2h0LzIgLSBkaXN0YW5jZSkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2lhbC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgaWYodGhpcy52aC5vZmZzZXRIZWlnaHQgPj0gOTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja1N0YXRlQmluZCk7XG4gICAgICAgIH1cblxuICAgICAgICBzY3JvbGxUb0xpbmtzIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNsaWRlPVwiNlwiXScpLmNsaWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzY3JvbGxUb1NsaWRlIChldmVudCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxpbmcgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbGV0IGxpbmsgPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgICAgICAgICAgICAgLCBvbGRfaWQgPSBwYXJzZUludCh0aGlzLmN1cnJlbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlJyksIDEwKVxuICAgICAgICAgICAgICAgICwgaWQgPSBwYXJzZUludChsaW5rLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZScpLCAxMCkgLSAxXG4gICAgICAgICAgICAgICAgLCBkaWZmID0gTWF0aC5hYnMob2xkX2lkIC0gKGlkICsgMSkpXG4gICAgICAgICAgICAgICAgLCBzbGlkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV8nICsgKGlkKzEpKVxuICAgICAgICAgICAgICAgICwgdGFyZ2V0ID0gTWF0aC5taW4odGhpcy52aC5vZmZzZXRIZWlnaHQgKiBpZCwgdGhpcy5wYWdlLm9mZnNldEhlaWdodCAtIHRoaXMudmgub2Zmc2V0SGVpZ2h0KTtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2luYXRvcl9fc2xpZGVfY3VycmVudCcpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gbGluaztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5jbGFzc0xpc3QuYWRkKCdwYWdpbmF0b3JfX3NsaWRlX2N1cnJlbnQnKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVfZ29sZCcpXG4gICAgICAgICAgICAgICAgfHwgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZV9ncmVlbicpXG4gICAgICAgICAgICAgICAgfHwgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZV9kYXJrJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLmNsYXNzTGlzdC50b2dnbGUoJ3BhZ2luYXRvcl9kYXJrJywgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5jbGFzc0xpc3QudG9nZ2xlKCdwYWdpbmF0b3JfZGFyaycsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnBhZ2UsIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KFxuICAgICAgICAgICAgICAgIHRoaXMucGFnZVxuICAgICAgICAgICAgICAgICwge1xuICAgICAgICAgICAgICAgICAgICB0b3A6IC10YXJnZXQrXCJweFwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAsIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGRpZmYqMjUwXG4gICAgICAgICAgICAgICAgICAgICwgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXcgU2xpZGVzO1xufSkoKTtcbiIsIiIsIndpbmRvdy52aWV3cG9ydFVuaXRzQnVnZ3lmaWxsLmluaXQoe2hhY2tzOiB3aW5kb3cudmlld3BvcnRVbml0c0J1Z2d5ZmlsbEhhY2tzfSk7XG52aWV3cG9ydFVuaXRzQnVnZ3lmaWxsLnJlZnJlc2goKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==