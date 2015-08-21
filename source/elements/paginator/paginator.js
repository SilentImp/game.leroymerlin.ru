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

            this.rescroll();

            if (document.body.parentNode.classList.contains('touch')) {
                let hammertime = new Hammer(this.page);
                hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
                hammertime.on('swipeup', this.next.bind(this));
                hammertime.on('swipedown', this.prev.bind(this));
            }
        }

        wheelController (event) {
            if (this.wheeling == true){
                return;
            }
            this.wheeling = true;
            if (event.deltaY > 0){
                this.next();
            } else if (event.deltaY < 0) {
                this.prev();
            }
            setTimeout(()=>{this.wheeling = false;}, 1000);
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
            let button = this.current.previousElementSibling;
            if (button != null) {
                button.click();
            }
        }

        next () {
            let button = this.current.nextElementSibling;
            if (button != null) {
                button.click();
            }
        }

        rescroll () {

            document.body.parentNode.classList.toggle('limit-600', (Modernizr.mq('(max-height: 600px)')));
            document.body.parentNode.classList.toggle('limit-600-900', (Modernizr.mq('(min-height: 601px) and (max-height: 900)')));


            let button = this.current;
            if (button != null) {
                button.click();
            }
        }

        checkState () {
            let top = Math.abs(parseInt(this.page.style.top, 10))
                // , viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
                , viewport_height = document.querySelector('.slide').offsetHeight
                , distance = top - (this.page.offsetHeight - viewport_height - this.footer.offsetHeight)
                , distance_long = top - (this.page.offsetHeight - 2*viewport_height - this.footer.offsetHeight);

            if(distance > 0) {
                this.social.classList.toggle('social_fixed', true);
                this.social.style.bottom = distance + "px";
                if(viewport_height >= 900) {
                    this.paginator.style.marginTop = (-this.paginator.offsetHeight/2 - distance) + "px";
                }
            } else {
                this.social.classList.toggle('social_fixed', false);
                this.social.removeAttribute('style');
                if(viewport_height >= 900) {
                    this.paginator.removeAttribute('style');
                }
            }

            window.requestAnimationFrame(this.checkStateBind);
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
                // , viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
                , viewport_height = document.querySelector('.slide').offsetHeight
                , target = Math.min(viewport_height * id, this.page.offsetHeight - viewport_height);

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
