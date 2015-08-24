(function () {
    "use strict";

    /**
    * @classdesc Class representing title
    * @class
    */
     class Slides {

        /**
         * @description Start initialization on domload
         * @constructor
         */
        constructor () {
            let ready = new Promise((resolve, reject)=>{
                if (document.readyState != "loading") return resolve();
                document.addEventListener("DOMContentLoaded", ()=> resolve());
            });
            ready.then(this.init.bind(this));
        }

        /**
         * @description Add events and initialize slider
         */
        init () {
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

            let burger = document.querySelector('.header__burger');
            burger.addEventListener('click', this.openNavigation.bind(this));

            let close = document.querySelector('.header__close');
            close.addEventListener('click', this.closeNavigation.bind(this));

            let close_location = document.querySelector('.header__close-location');
            close_location.addEventListener('click', this.closeLocation.bind(this));

            let open_location = document.querySelector('.header__open-location');
            open_location.addEventListener('click', this.openLocation.bind(this));

            let buttons = document.querySelectorAll('.slide__play');
            [].forEach.call(buttons, (button) => {
                button.addEventListener('click', this.scrollToLinks.bind(this));
            });

            let paginator_links = this.paginator.querySelectorAll('.paginator__slide');
            [].forEach.call(paginator_links, (link) => {
                link.addEventListener('click', this.scrollToSlide.bind(this));
            });

            paginator_links[0].click();

            window.requestAnimationFrame(this.checkStateBind);
            window.addEventListener('keyup', this.keyboardController.bind(this));
            window.addEventListener('resize', this.rescroll.bind(this));
            window.addEventListener('wheel', this.wheelController.bind(this));
            this.show_video.addEventListener('click', this.showVideo.bind(this));
            this.hide_video.addEventListener('click', this.hideVideo.bind(this));

            if (document.body.parentNode.classList.contains('touch')) {
                let hammertime = new Hammer(this.page);
                hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
                hammertime.on('swipeup', this.next.bind(this));
                hammertime.on('swipedown', this.prev.bind(this));
            }
        }

        resizeAll () {

            let slides = document.querySelectorAll('.slide')
                , scenes = document.querySelectorAll('.scene')
                , delta;

            [].forEach.call(slides, (slide) => {
                slide.style.height = this.vh.offsetHeight+'px';
                slide.style.lineHeight = this.vh.offsetHeight+'px';
            });

            [].forEach.call(scenes, (scene) => {
                scene.style.top = 2*this.vh.offsetHeight+'px';
                scene.style.height = 3*this.vh.offsetHeight+'px';
            });

            document.querySelector('.slide_1 .slide__wrapper').style.height = this.vh.offsetHeight+'px';

            if (this.vh.offsetHeight>=900) {
                delta = 335;
            }

            if (this.vh.offsetHeight<900) {
                delta = 435;
            }

            document.querySelector('.slide__devices').style.maxHeight = (this.vh.offsetHeight - delta)+'px';

            document.querySelector('.stars-from-bag').style.top = 2.75*this.vh.offsetHeight+'px';
            document.querySelector('.bag').style.top = 2.75*this.vh.offsetHeight+'px';
            document.querySelector('.clock').style.top = 2*this.vh.offsetHeight+'px';
            document.querySelector('.clock__arrow-1').style.top = 2*this.vh.offsetHeight+'px';
            document.querySelector('.clock__arrow-2').style.top = 2*this.vh.offsetHeight+'px';


            this.rescroll();
        }


        closeLocation () {
            Velocity(this.loca, "stop");
            Velocity(this.loca, {
                top: -this.vh.offsetHeight*2+'px'
            }, {
                duration: 500
            });
        }

        openLocation () {
            Velocity(this.loca, "stop");
            Velocity(this.loca, {
                top: 0
            }, {
                duration: 500
            });
        }


        closeNavigation () {
            Velocity(this.navigation, "stop");
            Velocity(this.navigation, {
                top: -this.vh.offsetHeight*2+'px'
            }, {
                duration: 500
            });
        }

        openNavigation () {
            Velocity(this.navigation, "stop");
            Velocity(this.navigation, {
                top: 0
            }, {
                duration: 500
            });
        }

        wheelController (event) {
            if (this.wheeling == true){
                return;
            }
            this.wheeling = true;
            if (event.deltaY > 1){
                this.next();
            } else if (event.deltaY < -1) {
                this.prev();
            }
            setTimeout(()=>{this.wheeling = false;}, 750);
        }

        showVideo () {
            let iframe = document.createElement('IFRAME');
            iframe.className = "slide__screen-tube";
            iframe.setAttribute("width", 560);
            iframe.setAttribute("height", 315);
            iframe.setAttribute("frameborder", 0);
            iframe.setAttribute("allowfullscreen", true);
            iframe.setAttribute("src", this.video.getAttribute('data-src'));
            this.video.appendChild(iframe);
            setTimeout(()=>{
                Velocity(this.video, "fadeIn", {duration: 750});
            }, 25);
        }

        hideVideo () {
            Velocity(this.video, "fadeOut", {
                duration: 750
                , complete: ()=>{
                    let video = document.querySelector('.slide__screen-tube');
                    video.parentNode.removeChild(video);
                }
            });
        }

        keyboardController (event) {
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

        prev () {
            if (
                document.body.parentNode.classList.contains('landscape')
                && document.body.parentNode.classList.contains('limit-500')
            ) {
                return;
            }
            let button = this.current.previousElementSibling;
            if (button != null) {
                button.click();
            }
        }

        next () {
            if (
                document.body.parentNode.classList.contains('landscape')
                && document.body.parentNode.classList.contains('limit-500')
            ) {
                return;
            }
            let button = this.current.nextElementSibling;
            if (button != null) {
                button.click();
            }
        }

        rescroll () {
            document.body.parentNode.classList.toggle('landscape', ( this.vh.offsetWidth > this.vh.offsetHeight));
            document.body.parentNode.classList.toggle('limit-500', (this.vh.offsetHeight <= 500));
            document.body.parentNode.classList.toggle('limit-600', (this.vh.offsetHeight <= 600 ));
            document.body.parentNode.classList.toggle('limit-600-900', (this.vh.offsetHeight > 600)&&(this.vh.offsetHeight<=900));

            let button = this.current;
            if (button != null) {
                button.click();
            }
        }

        checkState () {
            let top = Math.abs(parseInt(this.page.style.top, 10))
                , distance = top - (this.page.offsetHeight - this.vh.offsetHeight - this.footer.offsetHeight)
                , distance_long = top - (this.page.offsetHeight - 2*this.vh.offsetHeight - this.footer.offsetHeight);

            if(distance > 0) {
                this.social.style.bottom = distance + "px";
                if(this.vh.offsetHeight >= 900) {
                    this.paginator.style.marginTop = (-this.paginator.offsetHeight/2 - distance) + "px";
                }
            } else {
                this.social.removeAttribute('style');
                if(this.vh.offsetHeight >= 900) {
                    this.paginator.removeAttribute('style');
                }
            }

            window.requestAnimationFrame(this.checkStateBind);
        }

        scrollToLinks (event) {
            event.preventDefault();
            document.querySelector('[data-slide="6"]').click();
        }

        scrollToSlide (event) {

            if (this.scrolling == true) {
                return;
            }
            this.scrolling = true;

            let link = event.currentTarget
                , old_id = parseInt(this.current.getAttribute('data-slide'), 10)
                , id = parseInt(link.getAttribute('data-slide'), 10) - 1
                , diff = Math.abs(old_id - (id + 1))
                , slide = document.querySelector('.slide_' + (id+1))
                , target = Math.min(this.vh.offsetHeight * id, this.page.offsetHeight - this.vh.offsetHeight);

            this.current.classList.remove('paginator__slide_current');
            this.current = link;
            this.current.classList.add('paginator__slide_current');

            if (
                slide.classList.contains('slide_gold')
                || slide.classList.contains('slide_green')
                || slide.classList.contains('slide_dark')
            ) {
                this.paginator.classList.toggle('paginator_dark', false);
            } else {
                this.paginator.classList.toggle('paginator_dark', true);
            }

            Velocity(this.page, "stop");
            Velocity(
                this.page
                , {
                    top: -target+"px"
                    }
                , {
                    duration: diff*250
                    , complete: () => {
                        setTimeout(() => {
                            this.scrolling = false;
                        }, 250);
                    }
                });
        }
    }

    new Slides;
})();
