import SearchWidgetPlugin from 'src/plugin/header/search-widget.plugin';
import DomAccess from 'src/helper/dom-access.helper';
import Iterator from 'src/helper/iterator.helper';
import ButtonLoadingIndicator from 'src/utility/loading-indicator/button-loading-indicator.util';

export default class CustomSearchWidgetPlugin extends SearchWidgetPlugin {
    static options = {
        ...SearchWidgetPlugin.options,

        containerSelector: '.js-search-content-container',
        defaultSelector: '.js-search-dynamic-default',
        resultsSelector: '.js-search-dynamic-results',

        hasResultsClass: 'is-has-results',
    };

    init() {
        super.init();

        /**
         * this.el === <form data-search-widget="true" ...>
         * Our container is inside the form (because we injected it in layout_header_search_input_group),
         * but we still use a broader root to be safe.
         */
        this._root = this.el.closest('.header-search') || this.el.parentElement || this.el;

        this._container = DomAccess.querySelector(this._root, this.options.containerSelector, false);
        this._defaultEl = DomAccess.querySelector(this._root, this.options.defaultSelector, false);
        this._resultsEl = DomAccess.querySelector(this._root, this.options.resultsSelector, false);

        // Ensure initial state
        this._setHasResults(false);
        this._clearResultsSlotOnly();
    }

    _setHasResults(hasResults) {
        if (!this._container) return;
        this._container.classList.toggle(this.options.hasResultsClass, !!hasResults);
    }

    _clearResultsSlotOnly() {
        if (this._resultsEl) {
            this._resultsEl.innerHTML = '';
        }
    }

    /**
     * Override: clear injected results AND show default
     */
    _clearSuggestResults() {
        // reset arrow navigation helper to enable form submit on enter
        this._navigationHelper.resetIterator();

        // Remove any .js-search-result that Shopware might have injected anywhere
        const results = document.querySelectorAll(this.options.searchWidgetResultSelector);
        Iterator.iterate(results, (result) => result.remove());

        // Clear our slot
        this._clearResultsSlotOnly();

        // Show default state
        this._setHasResults(false);

        this.$emitter.publish('clearSuggestResults');
    }

    /**
     * Override: inject suggest response into results slot + hide default
     */
    _suggest(value) {
        const url = this._url + encodeURIComponent(value);
        this._client.abort();

        const indicator = new ButtonLoadingIndicator(this._submitButton);
        indicator.create();

        this.$emitter.publish('beforeSearch');

        this._client.get(url, (response) => {
            // remove any existing suggest popovers
            const old = document.querySelectorAll(this.options.searchWidgetResultSelector);
            Iterator.iterate(old, (result) => result.remove());

            indicator.remove();

            // If we don't have a slot, DON'T fallback to core injection (prevents "wrong place" issue)
            if (!this._resultsEl) {
                // keep default visible
                this._setHasResults(false);
                return;
            }

            // Inject suggest markup into our results slot
            this._resultsEl.innerHTML = response;

            // Decide if we should hide default: show results mode when suggest block exists
            const hasSuggest = !!this._resultsEl.querySelector(this.options.searchWidgetResultSelector);
            this._setHasResults(hasSuggest);

            this.$emitter.publish('afterSuggest');
        });
    }
}
