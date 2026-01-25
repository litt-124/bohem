PluginManager.register('SwiperSlider', () => import('./plugin/slider/swiper-slider.plugin'), '[data-swiper-slider]');

PluginManager.register('FilterSorting', () => import('./plugin/listing/filter-sorting.plugin'), '[data-bohem-sorting-panel]');

PluginManager.override('SearchWidget', () => import('./plugin/search/custom-search-widget.plugin'), '[data-search-widget]');
