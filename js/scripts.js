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
                    scene.style.top = 2 * _this2.vh.offsetHeight + 'px';
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

                document.querySelector('.stars-from-bag').style.top = 2.75 * this.vh.offsetHeight + 'px';
                document.querySelector('.bag').style.top = 2.75 * this.vh.offsetHeight + 'px';
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
                var _this3 = this;

                if (this.wheeling == true) {
                    return;
                }
                this.wheeling = true;
                if (event.deltaY > 1) {
                    this.next();
                } else if (event.deltaY < -1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2luYXRvci9wYWdpbmF0b3IuanMiLCJzb2NpYWwvc29jaWFsLmpzIiwiYnVnZ3lmaWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBWTtBQUNULGdCQUFZLENBQUM7Ozs7Ozs7UUFNTixNQUFNOzs7Ozs7O0FBTUcsaUJBTlQsTUFBTSxHQU1NO2tDQU5aLE1BQU07O0FBT0wsZ0JBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRztBQUN2QyxvQkFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRSxPQUFPLE9BQU8sRUFBRSxDQUFDO0FBQ3ZELHdCQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7MkJBQUssT0FBTyxFQUFFO2lCQUFBLENBQUMsQ0FBQzthQUNqRSxDQUFDLENBQUM7QUFDSCxpQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3BDOzs7Ozs7cUJBWkUsTUFBTTs7bUJBaUJKLGdCQUFHOzs7QUFDSixvQkFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLG9CQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEQsb0JBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxvQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pFLG9CQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsb0JBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENB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SUFBSSxFQUNQO0FBQ0UsdUJBQUcsRUFBRSxDQUFDLE1BQU0sR0FBQyxJQUFJO2lCQUNoQixFQUNIO0FBQ0UsNEJBQVEsRUFBRSxJQUFJLEdBQUMsR0FBRztBQUNoQiw0QkFBUSxFQUFFLG9CQUFNO0FBQ2Qsa0NBQVUsQ0FBQyxZQUFNO0FBQ2IsbUNBQUssU0FBUyxHQUFHLEtBQUssQ0FBQzt5QkFDMUIsRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDWDtpQkFDSixDQUFDLENBQUM7YUFDVjs7O2VBalRFLE1BQU07OztBQW9UYixRQUFJLE1BQU0sRUFBQSxDQUFDO0NBQ2QsQ0FBQSxFQUFHLENBQUM7QUM1VEw7OztBQ0FBLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLDJCQUEyQixFQUFDLENBQUMsQ0FBQztBQUNoRixzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICogQGNsYXNzZGVzYyBDbGFzcyByZXByZXNlbnRpbmcgdGl0bGVcbiAgICAqIEBjbGFzc1xuICAgICovXG4gICAgIGNsYXNzIFNsaWRlcyB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBTdGFydCBpbml0aWFsaXphdGlvbiBvbiBkb21sb2FkXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgbGV0IHJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSBcImxvYWRpbmdcIikgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKT0+IHJlc29sdmUoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlYWR5LnRoZW4odGhpcy5pbml0LmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBBZGQgZXZlbnRzIGFuZCBpbml0aWFsaXplIHNsaWRlclxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCAoKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZScpO1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnaW5hdG9yJyk7XG4gICAgICAgICAgICB0aGlzLmZvb3RlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXInKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMucGFnaW5hdG9yLnF1ZXJ5U2VsZWN0b3IoJy5wYWdpbmF0b3JfX3NsaWRlX2N1cnJlbnQnKTtcbiAgICAgICAgICAgIHRoaXMuc29jaWFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNvY2lhbCcpO1xuICAgICAgICAgICAgdGhpcy5jaGVja1N0YXRlQmluZCA9IHRoaXMuY2hlY2tTdGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zaG93X3ZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX192aWRlbycpO1xuICAgICAgICAgICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fc2NyZWVuJyk7XG4gICAgICAgICAgICB0aGlzLmhpZGVfdmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3NjcmVlbi1jbG9zZScpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdmlnYXRpb24nKTtcbiAgICAgICAgICAgIHRoaXMubG9jYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX29wdGlvbnMnKTtcblxuICAgICAgICAgICAgdGhpcy52aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aCcpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplQWxsLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5yZXNpemVBbGwoKTtcblxuICAgICAgICAgICAgbGV0IGJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2J1cmdlcicpO1xuICAgICAgICAgICAgYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vcGVuTmF2aWdhdGlvbi5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgbGV0IGNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fY2xvc2UnKTtcbiAgICAgICAgICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbG9zZU5hdmlnYXRpb24uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGxldCBjbG9zZV9sb2NhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2Nsb3NlLWxvY2F0aW9uJyk7XG4gICAgICAgICAgICBjbG9zZV9sb2NhdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2VMb2NhdGlvbi5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgbGV0IG9wZW5fbG9jYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19vcGVuLWxvY2F0aW9uJyk7XG4gICAgICAgICAgICBvcGVuX2xvY2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vcGVuTG9jYXRpb24uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGxldCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlX19wbGF5Jyk7XG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwoYnV0dG9ucywgKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2Nyb2xsVG9MaW5rcy5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgcGFnaW5hdG9yX2xpbmtzID0gdGhpcy5wYWdpbmF0b3IucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2luYXRvcl9fc2xpZGUnKTtcbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChwYWdpbmF0b3JfbGlua3MsIChsaW5rKSA9PiB7XG4gICAgICAgICAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2Nyb2xsVG9TbGlkZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwYWdpbmF0b3JfbGlua3NbMF0uY2xpY2soKTtcblxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrU3RhdGVCaW5kKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMua2V5Ym9hcmRDb250cm9sbGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzY3JvbGwuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCB0aGlzLndoZWVsQ29udHJvbGxlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd192aWRlby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2hvd1ZpZGVvLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5oaWRlX3ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlVmlkZW8uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b3VjaCcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGhhbW1lcnRpbWUgPSBuZXcgSGFtbWVyKHRoaXMucGFnZSk7XG4gICAgICAgICAgICAgICAgaGFtbWVydGltZS5nZXQoJ3N3aXBlJykuc2V0KHsgZGlyZWN0aW9uOiBIYW1tZXIuRElSRUNUSU9OX1ZFUlRJQ0FMIH0pO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUub24oJ3N3aXBldXAnLCB0aGlzLm5leHQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgaGFtbWVydGltZS5vbignc3dpcGVkb3duJywgdGhpcy5wcmV2LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzaXplQWxsICgpIHtcblxuICAgICAgICAgICAgbGV0IHNsaWRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZScpXG4gICAgICAgICAgICAgICAgLCBzY2VuZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2NlbmUnKVxuICAgICAgICAgICAgICAgICwgZGVsdGE7XG5cbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChzbGlkZXMsIChzbGlkZSkgPT4ge1xuICAgICAgICAgICAgICAgIHNsaWRlLnN0eWxlLmhlaWdodCA9IHRoaXMudmgub2Zmc2V0SGVpZ2h0KydweCc7XG4gICAgICAgICAgICAgICAgc2xpZGUuc3R5bGUubGluZUhlaWdodCA9IHRoaXMudmgub2Zmc2V0SGVpZ2h0KydweCc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKHNjZW5lcywgKHNjZW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgc2NlbmUuc3R5bGUudG9wID0gMip0aGlzLnZoLm9mZnNldEhlaWdodCsncHgnO1xuICAgICAgICAgICAgICAgIHNjZW5lLnN0eWxlLmhlaWdodCA9IDMqdGhpcy52aC5vZmZzZXRIZWlnaHQrJ3B4JztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfMSAuc2xpZGVfX3dyYXBwZXInKS5zdHlsZS5oZWlnaHQgPSB0aGlzLnZoLm9mZnNldEhlaWdodCsncHgnO1xuXG4gICAgICAgICAgICBpZiAodGhpcy52aC5vZmZzZXRIZWlnaHQ+PTkwMCkge1xuICAgICAgICAgICAgICAgIGRlbHRhID0gMzM1O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy52aC5vZmZzZXRIZWlnaHQ8OTAwKSB7XG4gICAgICAgICAgICAgICAgZGVsdGEgPSA0MzU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fZGV2aWNlcycpLnN0eWxlLm1heEhlaWdodCA9ICh0aGlzLnZoLm9mZnNldEhlaWdodCAtIGRlbHRhKSsncHgnO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnMtZnJvbS1iYWcnKS5zdHlsZS50b3AgPSAyLjc1KnRoaXMudmgub2Zmc2V0SGVpZ2h0KydweCc7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFnJykuc3R5bGUudG9wID0gMi43NSp0aGlzLnZoLm9mZnNldEhlaWdodCsncHgnO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsb2NrJykuc3R5bGUudG9wID0gMip0aGlzLnZoLm9mZnNldEhlaWdodCsncHgnO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsb2NrX19hcnJvdy0xJykuc3R5bGUudG9wID0gMip0aGlzLnZoLm9mZnNldEhlaWdodCsncHgnO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsb2NrX19hcnJvdy0yJykuc3R5bGUudG9wID0gMip0aGlzLnZoLm9mZnNldEhlaWdodCsncHgnO1xuXG5cbiAgICAgICAgICAgIHRoaXMucmVzY3JvbGwoKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY2xvc2VMb2NhdGlvbiAoKSB7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLmxvY2EsIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubG9jYSwge1xuICAgICAgICAgICAgICAgIHRvcDogLXRoaXMudmgub2Zmc2V0SGVpZ2h0KjIrJ3B4J1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgb3BlbkxvY2F0aW9uICgpIHtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubG9jYSwgXCJzdG9wXCIpO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5sb2NhLCB7XG4gICAgICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNsb3NlTmF2aWdhdGlvbiAoKSB7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLm5hdmlnYXRpb24sIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubmF2aWdhdGlvbiwge1xuICAgICAgICAgICAgICAgIHRvcDogLXRoaXMudmgub2Zmc2V0SGVpZ2h0KjIrJ3B4J1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgb3Blbk5hdmlnYXRpb24gKCkge1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5uYXZpZ2F0aW9uLCBcInN0b3BcIik7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLm5hdmlnYXRpb24sIHtcbiAgICAgICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoZWVsQ29udHJvbGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLndoZWVsaW5nID09IHRydWUpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMud2hlZWxpbmcgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGV2ZW50LmRlbHRhWSA+IDEpe1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5kZWx0YVkgPCAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJldigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e3RoaXMud2hlZWxpbmcgPSBmYWxzZTt9LCA3NTApO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1ZpZGVvICgpIHtcbiAgICAgICAgICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdJRlJBTUUnKTtcbiAgICAgICAgICAgIGlmcmFtZS5jbGFzc05hbWUgPSBcInNsaWRlX19zY3JlZW4tdHViZVwiO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIDU2MCk7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIDMxNSk7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwiZnJhbWVib3JkZXJcIiwgMCk7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwiYWxsb3dmdWxsc2NyZWVuXCIsIHRydWUpO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcInNyY1wiLCB0aGlzLnZpZGVvLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSk7XG4gICAgICAgICAgICB0aGlzLnZpZGVvLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgVmVsb2NpdHkodGhpcy52aWRlbywgXCJmYWRlSW5cIiwge2R1cmF0aW9uOiA3NTB9KTtcbiAgICAgICAgICAgIH0sIDI1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhpZGVWaWRlbyAoKSB7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnZpZGVvLCBcImZhZGVPdXRcIiwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA3NTBcbiAgICAgICAgICAgICAgICAsIGNvbXBsZXRlOiAoKT0+e1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3NjcmVlbi10dWJlJyk7XG4gICAgICAgICAgICAgICAgICAgIHZpZGVvLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodmlkZW8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAga2V5Ym9hcmRDb250cm9sbGVyIChldmVudCkge1xuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2ICgpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdsYW5kc2NhcGUnKVxuICAgICAgICAgICAgICAgICYmIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbWl0LTUwMCcpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5jdXJyZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQgKCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2xhbmRzY2FwZScpXG4gICAgICAgICAgICAgICAgJiYgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnbGltaXQtNTAwJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBidXR0b24gPSB0aGlzLmN1cnJlbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKGJ1dHRvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXNjcm9sbCAoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGFuZHNjYXBlJywgKCB0aGlzLnZoLm9mZnNldFdpZHRoID4gdGhpcy52aC5vZmZzZXRIZWlnaHQpKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdsaW1pdC01MDAnLCAodGhpcy52aC5vZmZzZXRIZWlnaHQgPD0gNTAwKSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGltaXQtNjAwJywgKHRoaXMudmgub2Zmc2V0SGVpZ2h0IDw9IDYwMCApKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdsaW1pdC02MDAtOTAwJywgKHRoaXMudmgub2Zmc2V0SGVpZ2h0ID4gNjAwKSYmKHRoaXMudmgub2Zmc2V0SGVpZ2h0PD05MDApKTtcblxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuY3VycmVudDtcbiAgICAgICAgICAgIGlmIChidXR0b24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tTdGF0ZSAoKSB7XG4gICAgICAgICAgICBsZXQgdG9wID0gTWF0aC5hYnMocGFyc2VJbnQodGhpcy5wYWdlLnN0eWxlLnRvcCwgMTApKVxuICAgICAgICAgICAgICAgICwgZGlzdGFuY2UgPSB0b3AgLSAodGhpcy5wYWdlLm9mZnNldEhlaWdodCAtIHRoaXMudmgub2Zmc2V0SGVpZ2h0IC0gdGhpcy5mb290ZXIub2Zmc2V0SGVpZ2h0KVxuICAgICAgICAgICAgICAgICwgZGlzdGFuY2VfbG9uZyA9IHRvcCAtICh0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0IC0gMip0aGlzLnZoLm9mZnNldEhlaWdodCAtIHRoaXMuZm9vdGVyLm9mZnNldEhlaWdodCk7XG5cbiAgICAgICAgICAgIGlmKGRpc3RhbmNlID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc29jaWFsLnN0eWxlLmJvdHRvbSA9IGRpc3RhbmNlICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMudmgub2Zmc2V0SGVpZ2h0ID49IDkwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5zdHlsZS5tYXJnaW5Ub3AgPSAoLXRoaXMucGFnaW5hdG9yLm9mZnNldEhlaWdodC8yIC0gZGlzdGFuY2UpICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMudmgub2Zmc2V0SGVpZ2h0ID49IDkwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY2hlY2tTdGF0ZUJpbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2Nyb2xsVG9MaW5rcyAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zbGlkZT1cIjZcIl0nKS5jbGljaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2Nyb2xsVG9TbGlkZSAoZXZlbnQpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsaW5nID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGxldCBsaW5rID0gZXZlbnQuY3VycmVudFRhcmdldFxuICAgICAgICAgICAgICAgICwgb2xkX2lkID0gcGFyc2VJbnQodGhpcy5jdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZScpLCAxMClcbiAgICAgICAgICAgICAgICAsIGlkID0gcGFyc2VJbnQobGluay5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGUnKSwgMTApIC0gMVxuICAgICAgICAgICAgICAgICwgZGlmZiA9IE1hdGguYWJzKG9sZF9pZCAtIChpZCArIDEpKVxuICAgICAgICAgICAgICAgICwgc2xpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfJyArIChpZCsxKSlcbiAgICAgICAgICAgICAgICAsIHRhcmdldCA9IE1hdGgubWluKHRoaXMudmgub2Zmc2V0SGVpZ2h0ICogaWQsIHRoaXMucGFnZS5vZmZzZXRIZWlnaHQgLSB0aGlzLnZoLm9mZnNldEhlaWdodCk7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5jbGFzc0xpc3QucmVtb3ZlKCdwYWdpbmF0b3JfX3NsaWRlX2N1cnJlbnQnKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IGxpbms7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuY2xhc3NMaXN0LmFkZCgncGFnaW5hdG9yX19zbGlkZV9jdXJyZW50Jyk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NsaWRlX2dvbGQnKVxuICAgICAgICAgICAgICAgIHx8IHNsaWRlLmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVfZ3JlZW4nKVxuICAgICAgICAgICAgICAgIHx8IHNsaWRlLmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVfZGFyaycpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5jbGFzc0xpc3QudG9nZ2xlKCdwYWdpbmF0b3JfZGFyaycsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IuY2xhc3NMaXN0LnRvZ2dsZSgncGFnaW5hdG9yX2RhcmsnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5wYWdlLCBcInN0b3BcIik7XG4gICAgICAgICAgICBWZWxvY2l0eShcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VcbiAgICAgICAgICAgICAgICAsIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAtdGFyZ2V0K1wicHhcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLCB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkaWZmKjI1MFxuICAgICAgICAgICAgICAgICAgICAsIGNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV3IFNsaWRlcztcbn0pKCk7XG4iLCIiLCJ3aW5kb3cudmlld3BvcnRVbml0c0J1Z2d5ZmlsbC5pbml0KHtoYWNrczogd2luZG93LnZpZXdwb3J0VW5pdHNCdWdneWZpbGxIYWNrc30pO1xudmlld3BvcnRVbml0c0J1Z2d5ZmlsbC5yZWZyZXNoKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=