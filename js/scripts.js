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

                if (document.body.parentNode.classList.contains('touch')) {
                    var hammertime = new Hammer(this.page);
                    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
                    hammertime.on('swipeleft', this.next.bind(this));
                    hammertime.on('swiperight', this.prev.bind(this));
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
                    scrollHeight = Math.max(800, viewport_height),
                    distance = top - (this.page.offsetHeight - scrollHeight - this.footer.offsetHeight),
                    distance_long = top - (this.page.offsetHeight - 2 * scrollHeight - this.footer.offsetHeight);

                if (distance > 0) {
                    this.social.classList.toggle('social_fixed', true);
                    this.social.style.bottom = distance + "px";
                    this.paginator.style.marginTop = -this.paginator.offsetHeight / 2 - distance + "px";
                } else {
                    this.social.classList.toggle('social_fixed', false);
                    this.social.removeAttribute('style');
                    this.paginator.removeAttribute('style');
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
                    viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                    scrollHeight = Math.max(800, viewport_height),
                    target = Math.min(scrollHeight * id, this.page.offsetHeight - scrollHeight);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2luYXRvci9wYWdpbmF0b3IuanMiLCJzb2NpYWwvc29jaWFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBWTtBQUNULGdCQUFZLENBQUM7Ozs7Ozs7UUFNTixNQUFNOzs7Ozs7O0FBTUcsaUJBTlQsTUFBTSxHQU1NO2tDQU5aLE1BQU07O0FBT0wsZ0JBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRztBQUN2QyxvQkFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRSxPQUFPLE9BQU8sRUFBRSxDQUFDO0FBQ3ZELHdCQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7MkJBQUssT0FBTyxFQUFFO2lCQUFBLENBQUMsQ0FBQzthQUNqRSxDQUFDLENBQUM7QUFDSCxpQkFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3BDOzs7Ozs7cUJBWkUsTUFBTTs7bUJBaUJKLGdCQUFHOzs7QUFDSixvQkFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLG9CQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEQsb0JBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxvQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pFLG9CQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsb0JBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENB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bEYsb0JBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzFELG9CQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixvQkFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRXZELG9CQUNJLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUNuQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFDdkMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQzNDO0FBQ0Usd0JBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDNUQsTUFBTTtBQUNILHdCQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQzNEOztBQUVELHdCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1Qix3QkFBUSxDQUNKLElBQUksQ0FBQyxJQUFJLEVBQ1A7QUFDRSx1QkFBRyxFQUFFLENBQUMsTUFBTSxHQUFDLElBQUk7aUJBQ2hCLEVBQ0g7QUFDRSw0QkFBUSxFQUFFLElBQUksR0FBQyxHQUFHO2lCQUNyQixDQUFDLENBQUM7YUFDVjs7O2VBaEtFLE1BQU07OztBQW1LYixRQUFJLE1BQU0sRUFBQSxDQUFDO0NBQ2QsQ0FBQSxFQUFHLENBQUM7QUMzS0wiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAqIEBjbGFzc2Rlc2MgQ2xhc3MgcmVwcmVzZW50aW5nIHRpdGxlXG4gICAgKiBAY2xhc3NcbiAgICAqL1xuICAgICBjbGFzcyBTbGlkZXMge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gU3RhcnQgaW5pdGlhbGl6YXRpb24gb24gZG9tbG9hZFxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIGxldCByZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gXCJsb2FkaW5nXCIpIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCk9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWFkeS50aGVuKHRoaXMuaW5pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQWRkIGV2ZW50cyBhbmQgaW5pdGlhbGl6ZSBzbGlkZXJcbiAgICAgICAgICovXG4gICAgICAgIGluaXQgKCkge1xuICAgICAgICAgICAgdGhpcy5wYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2luYXRvcicpO1xuICAgICAgICAgICAgdGhpcy5mb290ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnBhZ2luYXRvci5xdWVyeVNlbGVjdG9yKCcucGFnaW5hdG9yX19zbGlkZV9jdXJyZW50Jyk7XG4gICAgICAgICAgICB0aGlzLnNvY2lhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWwnKTtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTdGF0ZUJpbmQgPSB0aGlzLmNoZWNrU3RhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd192aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9fdmlkZW8nKTtcbiAgICAgICAgICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3NjcmVlbicpO1xuICAgICAgICAgICAgdGhpcy5oaWRlX3ZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19zY3JlZW4tY2xvc2UnKTtcblxuICAgICAgICAgICAgbGV0IHBhZ2luYXRvcl9saW5rcyA9IHRoaXMucGFnaW5hdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdpbmF0b3JfX3NsaWRlJyk7XG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwocGFnaW5hdG9yX2xpbmtzLCAobGluaykgPT4ge1xuICAgICAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNjcm9sbFRvU2xpZGUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGFnaW5hdG9yX2xpbmtzWzBdLmNsaWNrKCk7XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5jaGVja1N0YXRlQmluZCk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmtleWJvYXJkQ29udHJvbGxlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2Nyb2xsLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5zaG93X3ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zaG93VmlkZW8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmhpZGVfdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGVWaWRlby5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3RvdWNoJykpIHtcbiAgICAgICAgICAgICAgICBsZXQgaGFtbWVydGltZSA9IG5ldyBIYW1tZXIodGhpcy5wYWdlKTtcbiAgICAgICAgICAgICAgICBoYW1tZXJ0aW1lLmdldCgnc3dpcGUnKS5zZXQoeyBkaXJlY3Rpb246IEhhbW1lci5ESVJFQ1RJT05fSE9SSVpPTlRBTCB9KTtcbiAgICAgICAgICAgICAgICBoYW1tZXJ0aW1lLm9uKCdzd2lwZWxlZnQnLCB0aGlzLm5leHQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgaGFtbWVydGltZS5vbignc3dpcGVyaWdodCcsIHRoaXMucHJldi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dWaWRlbyAoKSB7XG4gICAgICAgICAgICBsZXQgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnSUZSQU1FJyk7XG4gICAgICAgICAgICBpZnJhbWUuY2xhc3NOYW1lID0gXCJzbGlkZV9fc2NyZWVuLXR1YmVcIjtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCA1NjApO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCAzMTUpO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImZyYW1lYm9yZGVyXCIsIDApO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZShcImFsbG93ZnVsbHNjcmVlblwiLCB0cnVlKTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgdGhpcy52aWRlby5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpO1xuICAgICAgICAgICAgdGhpcy52aWRlby5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMudmlkZW8sIFwiZmFkZUluXCIsIHtkdXJhdGlvbjogNzUwfSk7XG4gICAgICAgICAgICB9LCAyNSk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlVmlkZW8gKCkge1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy52aWRlbywgXCJmYWRlT3V0XCIsIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNzUwXG4gICAgICAgICAgICAgICAgLCBjb21wbGV0ZTogKCk9PntcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19zY3JlZW4tdHViZScpO1xuICAgICAgICAgICAgICAgICAgICB2aWRlby5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHZpZGVvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGtleWJvYXJkQ29udHJvbGxlciAoZXZlbnQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJldigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJldiAoKSB7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5jdXJyZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQgKCkge1xuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuY3VycmVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2Nyb2xsICgpIHtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSB0aGlzLmN1cnJlbnQ7XG4gICAgICAgICAgICBpZiAoYnV0dG9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrU3RhdGUgKCkge1xuICAgICAgICAgICAgbGV0IHRvcCA9IE1hdGguYWJzKHBhcnNlSW50KHRoaXMucGFnZS5zdHlsZS50b3AsIDEwKSlcbiAgICAgICAgICAgICAgICAsIHZpZXdwb3J0X2hlaWdodCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICAgICAgICAgICAgICAgICwgc2Nyb2xsSGVpZ2h0ID0gTWF0aC5tYXgoODAwLCB2aWV3cG9ydF9oZWlnaHQpXG4gICAgICAgICAgICAgICAgLCBkaXN0YW5jZSA9IHRvcCAtICh0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0IC0gc2Nyb2xsSGVpZ2h0IC0gdGhpcy5mb290ZXIub2Zmc2V0SGVpZ2h0KVxuICAgICAgICAgICAgICAgICwgZGlzdGFuY2VfbG9uZyA9IHRvcCAtICh0aGlzLnBhZ2Uub2Zmc2V0SGVpZ2h0IC0gMipzY3JvbGxIZWlnaHQgLSB0aGlzLmZvb3Rlci5vZmZzZXRIZWlnaHQpO1xuXG4gICAgICAgICAgICBpZihkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2lhbC5jbGFzc0xpc3QudG9nZ2xlKCdzb2NpYWxfZml4ZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2lhbC5zdHlsZS5ib3R0b20gPSBkaXN0YW5jZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5zdHlsZS5tYXJnaW5Ub3AgPSAoLXRoaXMucGFnaW5hdG9yLm9mZnNldEhlaWdodC8yIC0gZGlzdGFuY2UpICsgXCJweFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2lhbC5jbGFzc0xpc3QudG9nZ2xlKCdzb2NpYWxfZml4ZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NpYWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmNoZWNrU3RhdGVCaW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjcm9sbFRvU2xpZGUgKGV2ZW50KSB7XG4gICAgICAgICAgICBsZXQgbGluayA9IGV2ZW50LmN1cnJlbnRUYXJnZXRcbiAgICAgICAgICAgICAgICAsIG9sZF9pZCA9IHBhcnNlSW50KHRoaXMuY3VycmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGUnKSwgMTApXG4gICAgICAgICAgICAgICAgLCBpZCA9IHBhcnNlSW50KGxpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlJyksIDEwKSAtIDFcbiAgICAgICAgICAgICAgICAsIGRpZmYgPSBNYXRoLmFicyhvbGRfaWQgLSAoaWQgKyAxKSlcbiAgICAgICAgICAgICAgICAsIHNsaWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlXycgKyAoaWQrMSkpXG4gICAgICAgICAgICAgICAgLCB2aWV3cG9ydF9oZWlnaHQgPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgICAgICAgICAgICAgICAsIHNjcm9sbEhlaWdodCA9IE1hdGgubWF4KDgwMCwgdmlld3BvcnRfaGVpZ2h0KVxuICAgICAgICAgICAgICAgICwgdGFyZ2V0ID0gTWF0aC5taW4oc2Nyb2xsSGVpZ2h0ICogaWQsIHRoaXMucGFnZS5vZmZzZXRIZWlnaHQgLSBzY3JvbGxIZWlnaHQpO1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuY2xhc3NMaXN0LnJlbW92ZSgncGFnaW5hdG9yX19zbGlkZV9jdXJyZW50Jyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBsaW5rO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50LmNsYXNzTGlzdC5hZGQoJ3BhZ2luYXRvcl9fc2xpZGVfY3VycmVudCcpO1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZV9nb2xkJylcbiAgICAgICAgICAgICAgICB8fCBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NsaWRlX2dyZWVuJylcbiAgICAgICAgICAgICAgICB8fCBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NsaWRlX2RhcmsnKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IuY2xhc3NMaXN0LnRvZ2dsZSgncGFnaW5hdG9yX2RhcmsnLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLmNsYXNzTGlzdC50b2dnbGUoJ3BhZ2luYXRvcl9kYXJrJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMucGFnZSwgXCJzdG9wXCIpO1xuICAgICAgICAgICAgVmVsb2NpdHkoXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlXG4gICAgICAgICAgICAgICAgLCB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogLXRhcmdldCtcInB4XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICwge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogZGlmZioyNTBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5ldyBTbGlkZXM7XG59KSgpO1xuIiwiIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9