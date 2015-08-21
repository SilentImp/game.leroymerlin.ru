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

                // , viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
                viewport_height = document.querySelector('.slide').offsetHeight,
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

                // , viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
                viewport_height = document.querySelector('.slide').offsetHeight,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2luYXRvci9wYWdpbmF0b3IuanMiLCJzb2NpYWwvc29jaWFsLmpzIiwiYnVnZ3lmaWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBWTtBQUNULGdCQUFZLENBQUM7Ozs7Ozs7UUFNTixNQUFNOzs7Ozs7O0FBTUcsaUJBTlQsTUFBTSxHQU1NO2tDQU5aLE1BQU07O0FBT0wsZ0JBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRztBQUN2QyxvQkFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRSxPQUFPLE9BQU8sRUFBRSxDQUFDO0FBQ3ZELHdCQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7MkJBQUssT0FBTyxFQUFFO2lCQUFBLENBQUMsQ0FBQzthQUNqRSxDQUFDLENBQUM7QUFDSCxpQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3BDOzs7Ozs7cUJBWkUsTUFBTTs7bUJBaUJKLGdCQUFHOzs7QUFDSixvQkFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLG9CQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEQsb0JBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxvQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pFLG9CQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsb0JBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENB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Q0FBQyxDQUFDO2lCQUMzRDs7QUFFRCx3QkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUIsd0JBQVEsQ0FDSixJQUFJLENBQUMsSUFBSSxFQUNQO0FBQ0UsdUJBQUcsRUFBRSxDQUFDLE1BQU0sR0FBQyxJQUFJO2lCQUNoQixFQUNIO0FBQ0UsNEJBQVEsRUFBRSxJQUFJLEdBQUMsR0FBRztBQUNoQiw0QkFBUSxFQUFFLG9CQUFNO0FBQ2Qsa0NBQVUsQ0FBQyxZQUFNO0FBQ2IsbUNBQUssU0FBUyxHQUFHLEtBQUssQ0FBQzt5QkFDMUIsRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDWDtpQkFDSixDQUFDLENBQUM7YUFDVjs7O2VBcE5FLE1BQU07OztBQXVOYixRQUFJLE1BQU0sRUFBQSxDQUFDO0NBQ2QsQ0FBQSxFQUFHLENBQUM7QUMvTkw7OztBQ0FBLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLDJCQUEyQixFQUFDLENBQUMsQ0FBQztBQUNoRixzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICogQGNsYXNzZGVzYyBDbGFzcyByZXByZXNlbnRpbmcgdGl0bGVcbiAgICAqIEBjbGFzc1xuICAgICovXG4gICAgIGNsYXNzIFNsaWRlcyB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBTdGFydCBpbml0aWFsaXphdGlvbiBvbiBkb21sb2FkXG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgbGV0IHJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSBcImxvYWRpbmdcIikgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKT0+IHJlc29sdmUoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlYWR5LnRoZW4odGhpcy5pbml0LmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBBZGQgZXZlbnRzIGFuZCBpbml0aWFsaXplIHNsaWRlclxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCAoKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZScpO1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnaW5hdG9yJyk7XG4gICAgICAgICAgICB0aGlzLmZvb3RlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXInKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMucGFnaW5hdG9yLnF1ZXJ5U2VsZWN0b3IoJy5wYWdpbmF0b3JfX3NsaWRlX2N1cnJlbnQnKTtcbiAgICAgICAgICAgIHRoaXMuc29jaWFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNvY2lhbCcpO1xuICAgICAgICAgICAgdGhpcy5jaGVja1N0YXRlQmluZCA9IHRoaXMuY2hlY2tTdGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zaG93X3ZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX192aWRlbycpO1xuICAgICAgICAgICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fc2NyZWVuJyk7XG4gICAgICAgICAgICB0aGlzLmhpZGVfdmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3NjcmVlbi1jbG9zZScpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgbGV0IHBhZ2luYXRvcl9saW5rcyA9IHRoaXMucGFnaW5hdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdpbmF0b3JfX3NsaWRlJyk7XG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwocGFnaW5hdG9yX2xpbmtzLCAobGluaykgPT4ge1xuICAgICAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNjcm9sbFRvU2xpZGUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGFnaW5hdG9yX2xpbmtzWzBdLmNsaWNrKCk7XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja1N0YXRlQmluZCk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmtleWJvYXJkQ29udHJvbGxlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2Nyb2xsLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy53aGVlbENvbnRyb2xsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLnNob3dfdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNob3dWaWRlby5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuaGlkZV92aWRlby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZVZpZGVvLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLnJlc2Nyb2xsKCk7XG5cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b3VjaCcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGhhbW1lcnRpbWUgPSBuZXcgSGFtbWVyKHRoaXMucGFnZSk7XG4gICAgICAgICAgICAgICAgaGFtbWVydGltZS5nZXQoJ3N3aXBlJykuc2V0KHsgZGlyZWN0aW9uOiBIYW1tZXIuRElSRUNUSU9OX1ZFUlRJQ0FMIH0pO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUub24oJ3N3aXBldXAnLCB0aGlzLm5leHQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgaGFtbWVydGltZS5vbignc3dpcGVkb3duJywgdGhpcy5wcmV2LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgd2hlZWxDb250cm9sbGVyIChldmVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMud2hlZWxpbmcgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy53aGVlbGluZyA9IHRydWU7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGVsdGFZID4gMyl7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmRlbHRhWSA8IC0zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57dGhpcy53aGVlbGluZyA9IGZhbHNlO30sIDc1MCk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93VmlkZW8gKCkge1xuICAgICAgICAgICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0lGUkFNRScpO1xuICAgICAgICAgICAgaWZyYW1lLmNsYXNzTmFtZSA9IFwic2xpZGVfX3NjcmVlbi10dWJlXCI7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgNTYwKTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgMzE1KTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJmcmFtZWJvcmRlclwiLCAwKTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJhbGxvd2Z1bGxzY3JlZW5cIiwgdHJ1ZSk7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwic3JjXCIsIHRoaXMudmlkZW8uZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpKTtcbiAgICAgICAgICAgIHRoaXMudmlkZW8uYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnZpZGVvLCBcImZhZGVJblwiLCB7ZHVyYXRpb246IDc1MH0pO1xuICAgICAgICAgICAgfSwgMjUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVZpZGVvICgpIHtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMudmlkZW8sIFwiZmFkZU91dFwiLCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDc1MFxuICAgICAgICAgICAgICAgICwgY29tcGxldGU6ICgpPT57XG4gICAgICAgICAgICAgICAgICAgIGxldCB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fc2NyZWVuLXR1YmUnKTtcbiAgICAgICAgICAgICAgICAgICAgdmlkZW8ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh2aWRlbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBrZXlib2FyZENvbnRyb2xsZXIgKGV2ZW50KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXYoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByZXYgKCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2xhbmRzY2FwZScpXG4gICAgICAgICAgICAgICAgJiYgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnbGltaXQtNTAwJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBidXR0b24gPSB0aGlzLmN1cnJlbnQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChidXR0b24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCAoKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnbGFuZHNjYXBlJylcbiAgICAgICAgICAgICAgICAmJiBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW1pdC01MDAnKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuY3VycmVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2Nyb2xsICgpIHtcblxuICAgICAgICAgICAgbGV0IHNsaWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGFuZHNjYXBlJywgKCB3aW5kb3cuaW5uZXJXaWR0aCA+IHdpbmRvdy5pbm5lckhlaWdodCkpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ2xpbWl0LTUwMCcsIChzbGlkZS5vZmZzZXRIZWlnaHQgPD0gNTAwKSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGltaXQtNjAwJywgKE1vZGVybml6ci5tcSgnKG1heC1oZWlnaHQ6IDYwMHB4KScpKSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGltaXQtNjAwLTkwMCcsIChNb2Rlcm5penIubXEoJyhtaW4taGVpZ2h0OiA2MDFweCkgYW5kIChtYXgtaGVpZ2h0OiA5MDApJykpKTtcblxuXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5jdXJyZW50O1xuICAgICAgICAgICAgaWYgKGJ1dHRvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1N0YXRlICgpIHtcbiAgICAgICAgICAgIGxldCB0b3AgPSBNYXRoLmFicyhwYXJzZUludCh0aGlzLnBhZ2Uuc3R5bGUudG9wLCAxMCkpXG4gICAgICAgICAgICAgICAgLy8gLCB2aWV3cG9ydF9oZWlnaHQgPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgICAgICAgICAgICAgICAsIHZpZXdwb3J0X2hlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZScpLm9mZnNldEhlaWdodFxuICAgICAgICAgICAgICAgICwgZGlzdGFuY2UgPSB0b3AgLSAodGhpcy5wYWdlLm9mZnNldEhlaWdodCAtIHZpZXdwb3J0X2hlaWdodCAtIHRoaXMuZm9vdGVyLm9mZnNldEhlaWdodClcbiAgICAgICAgICAgICAgICAsIGRpc3RhbmNlX2xvbmcgPSB0b3AgLSAodGhpcy5wYWdlLm9mZnNldEhlaWdodCAtIDIqdmlld3BvcnRfaGVpZ2h0IC0gdGhpcy5mb290ZXIub2Zmc2V0SGVpZ2h0KTtcblxuICAgICAgICAgICAgaWYoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwuY2xhc3NMaXN0LnRvZ2dsZSgnc29jaWFsX2ZpeGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwuc3R5bGUuYm90dG9tID0gZGlzdGFuY2UgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgaWYodmlld3BvcnRfaGVpZ2h0ID49IDkwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5zdHlsZS5tYXJnaW5Ub3AgPSAoLXRoaXMucGFnaW5hdG9yLm9mZnNldEhlaWdodC8yIC0gZGlzdGFuY2UpICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwuY2xhc3NMaXN0LnRvZ2dsZSgnc29jaWFsX2ZpeGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuc29jaWFsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICBpZih2aWV3cG9ydF9oZWlnaHQgPj0gOTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja1N0YXRlQmluZCk7XG4gICAgICAgIH1cblxuICAgICAgICBzY3JvbGxUb1NsaWRlIChldmVudCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxpbmcgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbGV0IGxpbmsgPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgICAgICAgICAgICAgLCBvbGRfaWQgPSBwYXJzZUludCh0aGlzLmN1cnJlbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlJyksIDEwKVxuICAgICAgICAgICAgICAgICwgaWQgPSBwYXJzZUludChsaW5rLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZScpLCAxMCkgLSAxXG4gICAgICAgICAgICAgICAgLCBkaWZmID0gTWF0aC5hYnMob2xkX2lkIC0gKGlkICsgMSkpXG4gICAgICAgICAgICAgICAgLCBzbGlkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV8nICsgKGlkKzEpKVxuICAgICAgICAgICAgICAgIC8vICwgdmlld3BvcnRfaGVpZ2h0ID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApXG4gICAgICAgICAgICAgICAgLCB2aWV3cG9ydF9oZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGUnKS5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgICAgICAsIHRhcmdldCA9IE1hdGgubWluKHZpZXdwb3J0X2hlaWdodCAqIGlkLCB0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0IC0gdmlld3BvcnRfaGVpZ2h0KTtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2luYXRvcl9fc2xpZGVfY3VycmVudCcpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gbGluaztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5jbGFzc0xpc3QuYWRkKCdwYWdpbmF0b3JfX3NsaWRlX2N1cnJlbnQnKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVfZ29sZCcpXG4gICAgICAgICAgICAgICAgfHwgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZV9ncmVlbicpXG4gICAgICAgICAgICAgICAgfHwgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZV9kYXJrJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLmNsYXNzTGlzdC50b2dnbGUoJ3BhZ2luYXRvcl9kYXJrJywgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5jbGFzc0xpc3QudG9nZ2xlKCdwYWdpbmF0b3JfZGFyaycsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnBhZ2UsIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KFxuICAgICAgICAgICAgICAgIHRoaXMucGFnZVxuICAgICAgICAgICAgICAgICwge1xuICAgICAgICAgICAgICAgICAgICB0b3A6IC10YXJnZXQrXCJweFwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAsIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGRpZmYqMjUwXG4gICAgICAgICAgICAgICAgICAgICwgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXcgU2xpZGVzO1xufSkoKTtcbiIsIiIsIndpbmRvdy52aWV3cG9ydFVuaXRzQnVnZ3lmaWxsLmluaXQoe2hhY2tzOiB3aW5kb3cudmlld3BvcnRVbml0c0J1Z2d5ZmlsbEhhY2tzfSk7XG52aWV3cG9ydFVuaXRzQnVnZ3lmaWxsLnJlZnJlc2goKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==