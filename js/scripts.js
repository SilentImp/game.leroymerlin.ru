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
                if (event.deltaY > 0) {
                    this.next();
                } else if (event.deltaY < 0) {
                    this.prev();
                }
                setTimeout(function () {
                    _this2.wheeling = false;
                }, 1000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2luYXRvci9wYWdpbmF0b3IuanMiLCJzb2NpYWwvc29jaWFsLmpzIiwiYnVnZ3lmaWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBWTtBQUNULGdCQUFZLENBQUM7Ozs7Ozs7UUFNTixNQUFNOzs7Ozs7O0FBTUcsaUJBTlQsTUFBTSxHQU1NO2tDQU5aLE1BQU07O0FBT0wsZ0JBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRztBQUN2QyxvQkFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRSxPQUFPLE9BQU8sRUFBRSxDQUFDO0FBQ3ZELHdCQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7MkJBQUssT0FBTyxFQUFFO2lCQUFBLENBQUMsQ0FBQzthQUNqRSxDQUFDLENBQUM7QUFDSCxpQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3BDOzs7Ozs7cUJBWkUsTUFBTTs7bUJBaUJKLGdCQUFHOzs7QUFDSixvQkFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLG9CQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEQsb0JBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxvQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pFLG9CQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsb0JBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENB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Q0FBQzs7QUFFdkQsb0JBQ0ksS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQ25DLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUN2QyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFDM0M7QUFDRSx3QkFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUM1RCxNQUFNO0FBQ0gsd0JBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDM0Q7O0FBRUQsd0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLHdCQUFRLENBQ0osSUFBSSxDQUFDLElBQUksRUFDUDtBQUNFLHVCQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUMsSUFBSTtpQkFDaEIsRUFDSDtBQUNFLDRCQUFRLEVBQUUsSUFBSSxHQUFDLEdBQUc7QUFDaEIsNEJBQVEsRUFBRSxvQkFBTTtBQUNkLGtDQUFVLENBQUMsWUFBTTtBQUNiLG1DQUFLLFNBQVMsR0FBRyxLQUFLLENBQUM7eUJBQzFCLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ1g7aUJBQ0osQ0FBQyxDQUFDO2FBQ1Y7OztlQXJNRSxNQUFNOzs7QUF3TWIsUUFBSSxNQUFNLEVBQUEsQ0FBQztDQUNkLENBQUEsRUFBRyxDQUFDO0FDaE5MOzs7QUNBQSxNQUFNLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQywyQkFBMkIsRUFBQyxDQUFDLENBQUM7QUFDaEYsc0JBQXNCLENBQUMsT0FBTyxFQUFFLENBQUMiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAqIEBjbGFzc2Rlc2MgQ2xhc3MgcmVwcmVzZW50aW5nIHRpdGxlXG4gICAgKiBAY2xhc3NcbiAgICAqL1xuICAgICBjbGFzcyBTbGlkZXMge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gU3RhcnQgaW5pdGlhbGl6YXRpb24gb24gZG9tbG9hZFxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIGxldCByZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gXCJsb2FkaW5nXCIpIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCk9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWFkeS50aGVuKHRoaXMuaW5pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQWRkIGV2ZW50cyBhbmQgaW5pdGlhbGl6ZSBzbGlkZXJcbiAgICAgICAgICovXG4gICAgICAgIGluaXQgKCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2luYXRvcicpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnBhZ2luYXRvci5xdWVyeVNlbGVjdG9yKCcucGFnaW5hdG9yX19zbGlkZV9jdXJyZW50Jyk7XG4gICAgICAgICAgICB0aGlzLnNvY2lhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWwnKTtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTdGF0ZUJpbmQgPSB0aGlzLmNoZWNrU3RhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd192aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fdmlkZW8nKTtcbiAgICAgICAgICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3NjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy5oaWRlX3ZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19zY3JlZW4tY2xvc2UnKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGxldCBwYWdpbmF0b3JfbGlua3MgPSB0aGlzLnBhZ2luYXRvci5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5hdG9yX19zbGlkZScpO1xuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKHBhZ2luYXRvcl9saW5rcywgKGxpbmspID0+IHtcbiAgICAgICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zY3JvbGxUb1NsaWRlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBhZ2luYXRvcl9saW5rc1swXS5jbGljaygpO1xuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY2hlY2tTdGF0ZUJpbmQpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5rZXlib2FyZENvbnRyb2xsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNjcm9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMud2hlZWxDb250cm9sbGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5zaG93X3ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zaG93VmlkZW8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmhpZGVfdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGVWaWRlby5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5yZXNjcm9sbCgpO1xuXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndG91Y2gnKSkge1xuICAgICAgICAgICAgICAgIGxldCBoYW1tZXJ0aW1lID0gbmV3IEhhbW1lcih0aGlzLnBhZ2UpO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUuZ2V0KCdzd2lwZScpLnNldCh7IGRpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9WRVJUSUNBTCB9KTtcbiAgICAgICAgICAgICAgICBoYW1tZXJ0aW1lLm9uKCdzd2lwZXVwJywgdGhpcy5uZXh0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUub24oJ3N3aXBlZG93bicsIHRoaXMucHJldi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHdoZWVsQ29udHJvbGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLndoZWVsaW5nID09IHRydWUpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMud2hlZWxpbmcgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGV2ZW50LmRlbHRhWSA+IDApe1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5kZWx0YVkgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57dGhpcy53aGVlbGluZyA9IGZhbHNlO30sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd1ZpZGVvICgpIHtcbiAgICAgICAgICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdJRlJBTUUnKTtcbiAgICAgICAgICAgIGlmcmFtZS5jbGFzc05hbWUgPSBcInNsaWRlX19zY3JlZW4tdHViZVwiO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIDU2MCk7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIDMxNSk7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwiZnJhbWVib3JkZXJcIiwgMCk7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKFwiYWxsb3dmdWxsc2NyZWVuXCIsIHRydWUpO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcInNyY1wiLCB0aGlzLnZpZGVvLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSk7XG4gICAgICAgICAgICB0aGlzLnZpZGVvLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgVmVsb2NpdHkodGhpcy52aWRlbywgXCJmYWRlSW5cIiwge2R1cmF0aW9uOiA3NTB9KTtcbiAgICAgICAgICAgIH0sIDI1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhpZGVWaWRlbyAoKSB7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnZpZGVvLCBcImZhZGVPdXRcIiwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA3NTBcbiAgICAgICAgICAgICAgICAsIGNvbXBsZXRlOiAoKT0+e1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3NjcmVlbi10dWJlJyk7XG4gICAgICAgICAgICAgICAgICAgIHZpZGVvLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodmlkZW8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAga2V5Ym9hcmRDb250cm9sbGVyIChldmVudCkge1xuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2ICgpIHtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSB0aGlzLmN1cnJlbnQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChidXR0b24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCAoKSB7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5jdXJyZW50Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChidXR0b24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzY3JvbGwgKCkge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGltaXQtNjAwJywgKE1vZGVybml6ci5tcSgnKG1heC1oZWlnaHQ6IDYwMHB4KScpKSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGltaXQtNjAwLTkwMCcsIChNb2Rlcm5penIubXEoJyhtaW4taGVpZ2h0OiA2MDFweCkgYW5kIChtYXgtaGVpZ2h0OiA5MDApJykpKTtcblxuXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5jdXJyZW50O1xuICAgICAgICAgICAgaWYgKGJ1dHRvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1N0YXRlICgpIHtcbiAgICAgICAgICAgIGxldCB0b3AgPSBNYXRoLmFicyhwYXJzZUludCh0aGlzLnBhZ2Uuc3R5bGUudG9wLCAxMCkpXG4gICAgICAgICAgICAgICAgLy8gLCB2aWV3cG9ydF9oZWlnaHQgPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgICAgICAgICAgICAgICAsIHZpZXdwb3J0X2hlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZScpLm9mZnNldEhlaWdodFxuICAgICAgICAgICAgICAgICwgZGlzdGFuY2UgPSB0b3AgLSAodGhpcy5wYWdlLm9mZnNldEhlaWdodCAtIHZpZXdwb3J0X2hlaWdodCAtIHRoaXMuZm9vdGVyLm9mZnNldEhlaWdodClcbiAgICAgICAgICAgICAgICAsIGRpc3RhbmNlX2xvbmcgPSB0b3AgLSAodGhpcy5wYWdlLm9mZnNldEhlaWdodCAtIDIqdmlld3BvcnRfaGVpZ2h0IC0gdGhpcy5mb290ZXIub2Zmc2V0SGVpZ2h0KTtcblxuICAgICAgICAgICAgaWYoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwuY2xhc3NMaXN0LnRvZ2dsZSgnc29jaWFsX2ZpeGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwuc3R5bGUuYm90dG9tID0gZGlzdGFuY2UgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgaWYodmlld3BvcnRfaGVpZ2h0ID49IDkwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5zdHlsZS5tYXJnaW5Ub3AgPSAoLXRoaXMucGFnaW5hdG9yLm9mZnNldEhlaWdodC8yIC0gZGlzdGFuY2UpICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwuY2xhc3NMaXN0LnRvZ2dsZSgnc29jaWFsX2ZpeGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuc29jaWFsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICBpZih2aWV3cG9ydF9oZWlnaHQgPj0gOTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja1N0YXRlQmluZCk7XG4gICAgICAgIH1cblxuICAgICAgICBzY3JvbGxUb1NsaWRlIChldmVudCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxpbmcgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbGV0IGxpbmsgPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgICAgICAgICAgICAgLCBvbGRfaWQgPSBwYXJzZUludCh0aGlzLmN1cnJlbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlJyksIDEwKVxuICAgICAgICAgICAgICAgICwgaWQgPSBwYXJzZUludChsaW5rLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZScpLCAxMCkgLSAxXG4gICAgICAgICAgICAgICAgLCBkaWZmID0gTWF0aC5hYnMob2xkX2lkIC0gKGlkICsgMSkpXG4gICAgICAgICAgICAgICAgLCBzbGlkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV8nICsgKGlkKzEpKVxuICAgICAgICAgICAgICAgIC8vICwgdmlld3BvcnRfaGVpZ2h0ID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApXG4gICAgICAgICAgICAgICAgLCB2aWV3cG9ydF9oZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGUnKS5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgICAgICAsIHRhcmdldCA9IE1hdGgubWluKHZpZXdwb3J0X2hlaWdodCAqIGlkLCB0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0IC0gdmlld3BvcnRfaGVpZ2h0KTtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2luYXRvcl9fc2xpZGVfY3VycmVudCcpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gbGluaztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5jbGFzc0xpc3QuYWRkKCdwYWdpbmF0b3JfX3NsaWRlX2N1cnJlbnQnKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVfZ29sZCcpXG4gICAgICAgICAgICAgICAgfHwgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZV9ncmVlbicpXG4gICAgICAgICAgICAgICAgfHwgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZV9kYXJrJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLmNsYXNzTGlzdC50b2dnbGUoJ3BhZ2luYXRvcl9kYXJrJywgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5jbGFzc0xpc3QudG9nZ2xlKCdwYWdpbmF0b3JfZGFyaycsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnBhZ2UsIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KFxuICAgICAgICAgICAgICAgIHRoaXMucGFnZVxuICAgICAgICAgICAgICAgICwge1xuICAgICAgICAgICAgICAgICAgICB0b3A6IC10YXJnZXQrXCJweFwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAsIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGRpZmYqMjUwXG4gICAgICAgICAgICAgICAgICAgICwgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXcgU2xpZGVzO1xufSkoKTtcbiIsIiIsIndpbmRvdy52aWV3cG9ydFVuaXRzQnVnZ3lmaWxsLmluaXQoe2hhY2tzOiB3aW5kb3cudmlld3BvcnRVbml0c0J1Z2d5ZmlsbEhhY2tzfSk7XG52aWV3cG9ydFVuaXRzQnVnZ3lmaWxsLnJlZnJlc2goKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==