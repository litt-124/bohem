import BaseSliderPlugin from 'src/plugin/slider/base-slider.plugin';
import ViewportHelper from '../../helper/view-port.helper.js';
import Swiper from 'swiper';
import { Navigation, FreeMode, Pagination } from 'swiper/modules';

/**
 * SwiperSliderPlugin
 */
export default class SwiperSlider extends BaseSliderPlugin {

    static options = {
        initializedCls: 'js-slider-initialized',
        containerSelector: '[data-swiper-slider-container=true]',
        controlsSelector: '[data-swiper-slider-controls=true]',
        slider: {
            enabled: true,
            responsive: {
                xs: {},
                sm: {},
                md: {},
                lg: {},
                xl: {},
            },
        },
    };

    initialized = false;

    init() {
        this.checkVisibleAndInit();
        this.setLazyLoadInit();
    }

    checkVisibleAndInit() {
        if (!this.el.classList.contains(this.options.initializedCls) && ViewportHelper.visible(this.el, 400)) {
            super.init();

            this.initialized = true;
        }
    }

    setLazyLoadInit() {
        if (!this.el.classList.contains(this.options.initializedCls)) {
            document.addEventListener('scroll', () => {
                if (this.initialized) {
                    return;
                }

                this.checkVisibleAndInit();
            }, {passive: true});
        }
    }

    /**
     * initialize the slider
     *
     * @private
     */
    _initSlider() {
        let randomUid = this.getRandomId();
        let swiperParentEl = this.el;
        swiperParentEl.classList.add('js--swiper-slider-' + randomUid);
        swiperParentEl.classList.add(this.options.initializedCls);

        const container = swiperParentEl.querySelector(this.options.containerSelector);
        if (container) {
            if (this._sliderSettings.enabled) {
                container.style.display = '';
                container.classList.add('swiper-slider-container-' + randomUid);

                if (this._sliderSettings.navigation && this._sliderSettings.navigation.nextEl) {
                    this._sliderSettings.navigation.nextEl = '.js--swiper-slider-' + randomUid + ' ' + this._sliderSettings.navigation.nextEl;
                }
                if (this._sliderSettings.navigation && this._sliderSettings.navigation.prevEl) {
                    this._sliderSettings.navigation.prevEl = '.js--swiper-slider-' + randomUid + ' ' + this._sliderSettings.navigation.prevEl;
                }

                const config = JSON.parse(this.el.getAttribute('data-swiper-slider-options'));
                config.modules = [Navigation, FreeMode, Pagination];
                const swiper = new Swiper('.swiper-slider-container-' + randomUid, config);

                this.addNewFunctionsAfterLoad(swiper, config);
                this.initUpdateLazyLoadOnSwipe(swiper);
                this.$emitter.publish('initSlider');

                if(this.el.getAttribute('data-default-index')) {
                    swiper.slideTo(+this.el.getAttribute('data-default-index'));
                }
            } else {
                container.style.display = 'none';
            }
        }

        this.$emitter.publish('afterInitSlider');

    }

    addNewFunctionsAfterLoad(swiper, config) {

    }

    initUpdateLazyLoadOnSwipe(swiper) {
        swiper.on('slideChange', function () {
            if (window.lazyLoadInstance) {
                window.lazyLoadInstance.update();
            }
        });
    }

    getRandomId() {
        let S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}