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

                var paginator_links = this.paginator.querySelectorAll('.paginator__slide');
                [].forEach.call(paginator_links, function (link) {
                    link.addEventListener('click', _this.scrollToSlide.bind(_this));
                });

                paginator_links[0].click();

                window.requestAnimationFrame(this.checkStateBind);
                window.addEventListener('keyup', this.keyboardController.bind(this));
                window.addEventListener('resize', this.rescroll.bind(this));
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
            key: "showVideo",
            value: function showVideo() {
                var _this2 = this;

                var iframe = document.createElement('IFRAME');
                iframe.className = "slide__screen-tube";
                iframe.setAttribute("width", 560);
                iframe.setAttribute("height", 315);
                iframe.setAttribute("frameborder", 0);
                iframe.setAttribute("allowfullscreen", true);
                iframe.setAttribute("src", this.video.getAttribute('data-src'));
                this.video.appendChild(iframe);
                setTimeout(function () {
                    Velocity(_this2.video, "fadeIn", { duration: 750 });
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
                    duration: diff * 250
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2luYXRvci9wYWdpbmF0b3IuanMiLCJzb2NpYWwvc29jaWFsLmpzIiwiYnVnZ3lmaWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBWTtBQUNULGdCQUFZLENBQUM7Ozs7Ozs7UUFNTixNQUFNOzs7Ozs7O0FBTUcsaUJBTlQsTUFBTSxHQU1NO2tDQU5aLE1BQU07O0FBT0wsZ0JBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRztBQUN2QyxvQkFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRSxPQUFPLE9BQU8sRUFBRSxDQUFDO0FBQ3ZELHdCQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7MkJBQUssT0FBTyxFQUFFO2lCQUFBLENBQUMsQ0FBQzthQUNqRSxDQUFDLENBQUM7QUFDSCxpQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3BDOzs7Ozs7cUJBWkUsTUFBTTs7bUJBaUJKLGdCQUFHOzs7QUFDSixvQkFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLG9CQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEQsb0JBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxvQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pFLG9CQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsb0JBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENB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LENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQywyQkFBMkIsRUFBQyxDQUFDLENBQUM7QUFDaEYsc0JBQXNCLENBQUMsT0FBTyxFQUFFLENBQUMiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAqIEBjbGFzc2Rlc2MgQ2xhc3MgcmVwcmVzZW50aW5nIHRpdGxlXG4gICAgKiBAY2xhc3NcbiAgICAqL1xuICAgICBjbGFzcyBTbGlkZXMge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gU3RhcnQgaW5pdGlhbGl6YXRpb24gb24gZG9tbG9hZFxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIGxldCByZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gXCJsb2FkaW5nXCIpIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCk9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWFkeS50aGVuKHRoaXMuaW5pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQWRkIGV2ZW50cyBhbmQgaW5pdGlhbGl6ZSBzbGlkZXJcbiAgICAgICAgICovXG4gICAgICAgIGluaXQgKCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2luYXRvcicpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnBhZ2luYXRvci5xdWVyeVNlbGVjdG9yKCcucGFnaW5hdG9yX19zbGlkZV9jdXJyZW50Jyk7XG4gICAgICAgICAgICB0aGlzLnNvY2lhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWwnKTtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTdGF0ZUJpbmQgPSB0aGlzLmNoZWNrU3RhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd192aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fdmlkZW8nKTtcbiAgICAgICAgICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3NjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy5oaWRlX3ZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19zY3JlZW4tY2xvc2UnKTtcblxuICAgICAgICAgICAgbGV0IHBhZ2luYXRvcl9saW5rcyA9IHRoaXMucGFnaW5hdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdpbmF0b3JfX3NsaWRlJyk7XG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwocGFnaW5hdG9yX2xpbmtzLCAobGluaykgPT4ge1xuICAgICAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNjcm9sbFRvU2xpZGUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGFnaW5hdG9yX2xpbmtzWzBdLmNsaWNrKCk7XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja1N0YXRlQmluZCk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmtleWJvYXJkQ29udHJvbGxlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2Nyb2xsLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5zaG93X3ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zaG93VmlkZW8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmhpZGVfdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGVWaWRlby5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5yZXNjcm9sbCgpO1xuXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndG91Y2gnKSkge1xuICAgICAgICAgICAgICAgIGxldCBoYW1tZXJ0aW1lID0gbmV3IEhhbW1lcih0aGlzLnBhZ2UpO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUuZ2V0KCdzd2lwZScpLnNldCh7IGRpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9WRVJUSUNBTCB9KTtcbiAgICAgICAgICAgICAgICBoYW1tZXJ0aW1lLm9uKCdzd2lwZXVwJywgdGhpcy5uZXh0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIGhhbW1lcnRpbWUub24oJ3N3aXBlZG93bicsIHRoaXMucHJldi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dWaWRlbyAoKSB7XG4gICAgICAgICAgICBsZXQgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnSUZSQU1FJyk7XG4gICAgICAgICAgICBpZnJhbWUuY2xhc3NOYW1lID0gXCJzbGlkZV9fc2NyZWVuLXR1YmVcIjtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCA1NjApO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCAzMTUpO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImZyYW1lYm9yZGVyXCIsIDApO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImFsbG93ZnVsbHNjcmVlblwiLCB0cnVlKTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgdGhpcy52aWRlby5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpO1xuICAgICAgICAgICAgdGhpcy52aWRlby5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMudmlkZW8sIFwiZmFkZUluXCIsIHtkdXJhdGlvbjogNzUwfSk7XG4gICAgICAgICAgICB9LCAyNSk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlVmlkZW8gKCkge1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy52aWRlbywgXCJmYWRlT3V0XCIsIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNzUwXG4gICAgICAgICAgICAgICAgLCBjb21wbGV0ZTogKCk9PntcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19zY3JlZW4tdHViZScpO1xuICAgICAgICAgICAgICAgICAgICB2aWRlby5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHZpZGVvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGtleWJvYXJkQ29udHJvbGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJldigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJldiAoKSB7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5jdXJyZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQgKCkge1xuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuY3VycmVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2Nyb2xsICgpIHtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ2xpbWl0LTYwMCcsIChNb2Rlcm5penIubXEoJyhtYXgtaGVpZ2h0OiA2MDBweCknKSkpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ2xpbWl0LTYwMC05MDAnLCAoTW9kZXJuaXpyLm1xKCcobWluLWhlaWdodDogNjAxcHgpIGFuZCAobWF4LWhlaWdodDogOTAwKScpKSk7XG5cblxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuY3VycmVudDtcbiAgICAgICAgICAgIGlmIChidXR0b24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tTdGF0ZSAoKSB7XG4gICAgICAgICAgICBsZXQgdG9wID0gTWF0aC5hYnMocGFyc2VJbnQodGhpcy5wYWdlLnN0eWxlLnRvcCwgMTApKVxuICAgICAgICAgICAgICAgIC8vICwgdmlld3BvcnRfaGVpZ2h0ID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApXG4gICAgICAgICAgICAgICAgLCB2aWV3cG9ydF9oZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGUnKS5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgICAgICAsIGRpc3RhbmNlID0gdG9wIC0gKHRoaXMucGFnZS5vZmZzZXRIZWlnaHQgLSB2aWV3cG9ydF9oZWlnaHQgLSB0aGlzLmZvb3Rlci5vZmZzZXRIZWlnaHQpXG4gICAgICAgICAgICAgICAgLCBkaXN0YW5jZV9sb25nID0gdG9wIC0gKHRoaXMucGFnZS5vZmZzZXRIZWlnaHQgLSAyKnZpZXdwb3J0X2hlaWdodCAtIHRoaXMuZm9vdGVyLm9mZnNldEhlaWdodCk7XG5cbiAgICAgICAgICAgIGlmKGRpc3RhbmNlID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc29jaWFsLmNsYXNzTGlzdC50b2dnbGUoJ3NvY2lhbF9maXhlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc29jaWFsLnN0eWxlLmJvdHRvbSA9IGRpc3RhbmNlICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGlmKHZpZXdwb3J0X2hlaWdodCA+PSA5MDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3Iuc3R5bGUubWFyZ2luVG9wID0gKC10aGlzLnBhZ2luYXRvci5vZmZzZXRIZWlnaHQvMiAtIGRpc3RhbmNlKSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc29jaWFsLmNsYXNzTGlzdC50b2dnbGUoJ3NvY2lhbF9maXhlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2lhbC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgaWYodmlld3BvcnRfaGVpZ2h0ID49IDkwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuY2hlY2tTdGF0ZUJpbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2Nyb2xsVG9TbGlkZSAoZXZlbnQpIHtcbiAgICAgICAgICAgIGxldCBsaW5rID0gZXZlbnQuY3VycmVudFRhcmdldFxuICAgICAgICAgICAgICAgICwgb2xkX2lkID0gcGFyc2VJbnQodGhpcy5jdXJyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZScpLCAxMClcbiAgICAgICAgICAgICAgICAsIGlkID0gcGFyc2VJbnQobGluay5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGUnKSwgMTApIC0gMVxuICAgICAgICAgICAgICAgICwgZGlmZiA9IE1hdGguYWJzKG9sZF9pZCAtIChpZCArIDEpKVxuICAgICAgICAgICAgICAgICwgc2xpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfJyArIChpZCsxKSlcbiAgICAgICAgICAgICAgICAvLyAsIHZpZXdwb3J0X2hlaWdodCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICAgICAgICAgICAgICAgICwgdmlld3BvcnRfaGVpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlJykub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgICAgICAgLCB0YXJnZXQgPSBNYXRoLm1pbih2aWV3cG9ydF9oZWlnaHQgKiBpZCwgdGhpcy5wYWdlLm9mZnNldEhlaWdodCAtIHZpZXdwb3J0X2hlaWdodCk7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5jbGFzc0xpc3QucmVtb3ZlKCdwYWdpbmF0b3JfX3NsaWRlX2N1cnJlbnQnKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IGxpbms7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuY2xhc3NMaXN0LmFkZCgncGFnaW5hdG9yX19zbGlkZV9jdXJyZW50Jyk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NsaWRlX2dvbGQnKVxuICAgICAgICAgICAgICAgIHx8IHNsaWRlLmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVfZ3JlZW4nKVxuICAgICAgICAgICAgICAgIHx8IHNsaWRlLmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVfZGFyaycpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5jbGFzc0xpc3QudG9nZ2xlKCdwYWdpbmF0b3JfZGFyaycsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IuY2xhc3NMaXN0LnRvZ2dsZSgncGFnaW5hdG9yX2RhcmsnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5wYWdlLCBcInN0b3BcIik7XG4gICAgICAgICAgICBWZWxvY2l0eShcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VcbiAgICAgICAgICAgICAgICAsIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAtdGFyZ2V0K1wicHhcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLCB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkaWZmKjI1MFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV3IFNsaWRlcztcbn0pKCk7XG4iLCIiLCJ3aW5kb3cudmlld3BvcnRVbml0c0J1Z2d5ZmlsbC5pbml0KHtoYWNrczogd2luZG93LnZpZXdwb3J0VW5pdHNCdWdneWZpbGxIYWNrc30pO1xudmlld3BvcnRVbml0c0J1Z2d5ZmlsbC5yZWZyZXNoKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=