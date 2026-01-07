import Plugin from 'src/plugin-system/plugin.class';

export default class FilterSortingPlugin extends Plugin {
    init() {
        this.list = this.el.querySelector('[data-bohem-sorting-radios]');
        this.tpl = this.el.querySelector('[data-bohem-sorting-radio-tpl]');

        if (!this.list || !this.tpl) return;

        this.renderFromSelect();
        this.bindChange();
    }

    getSelect() {
        const root = document.querySelector('[data-listing-sorting="true"]');
        return root ? root.querySelector('select') : null;
    }

    renderFromSelect() {
        const select = this.getSelect();
        if (!select) return;

        this.list.innerHTML = '';

        const current = select.value;
        const options = Array.from(select.querySelectorAll('option'));

        options.forEach((opt, idx) => {
            const node = this.tpl.content.firstElementChild.cloneNode(true);

            const input = node.querySelector('input[type="radio"]');
            const label = node.querySelector('label');

            const id = `bohem-sorting-${idx}`;

            input.name = 'bohem-sorting';
            input.value = opt.value;
            input.id = id;
            input.checked = (opt.value === current);

            label.setAttribute('for', id);
            label.textContent = opt.textContent.trim();

            this.list.appendChild(node);
        });
    }

    bindChange() {
        this.list.addEventListener('change', (e) => {
            const target = e.target;
            if (!target || target.type !== 'radio') return;

            const select = this.getSelect();
            if (!select) return;

            select.value = target.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));

            // re-sync after Shopware reloads/updates things
            // (safe, and keeps UI correct after ajax updates)
            window.setTimeout(() => this.renderFromSelect(), 0);
        });
    }
}
