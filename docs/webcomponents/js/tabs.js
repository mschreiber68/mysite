let tabCounter = 0;

class Tab extends HTMLElement {
    static get observedAttributes() {
        return ['selected'];
    }

    get selected() {
        return this.hasAttribute('selected');
    }

    set selected(value) {
        if (value)
            this.setAttribute('selected', '');
        else
            this.removeAttribute('selected');
    }

    attributeChangedCallback() {
        const value = this.hasAttribute('selected');
        this.setAttribute('aria-selected', value);
        this.setAttribute('tabindex', value ? 0 : -1);
    }

    connectedCallback() {
        if (!this.id) {
            this.id = `tab-${++tabCounter}`;
        }

        this.setAttribute('role', 'tab');
        this.setAttribute('aria-selected', 'false');
        this.setAttribute('tabindex', -1);
        this._upgradeProperty('selected');
    }

    _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }
}

window.customElements.define('x-tab', Tab);

let panelCounter = 0;

class TabPanel extends HTMLElement {
    connectedCallback() {
        if (!this.id) {
            this.id = `tab-panel-${++panelCounter}`;
        }
        this.setAttribute('role', 'tabpanel');
    }
}

window.customElements.define('x-tab-panel', TabPanel);

class Tabs extends HTMLElement {
    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }

    connectedCallback() {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'tablist');
        }

        this.addEventListener('click', this._onClick);

        this._linkPanels();
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
    }

    _getTabs() {
        return [...this.querySelectorAll('x-tab')];
    }

    _getPanels() {
        return [...this.querySelectorAll('x-tab-panel')];
    }

    _linkPanels() {
        const tabs = this._getTabs();
        const panels = this._getPanels();

        for (let i = 0; i < tabs.length; i++) {
            if (i >= panels.length) {
                break;
            }
            tabs[i].setAttribute('aria-controls', panels[i].id);
            panels[i].setAttribute('aria-labelledby', tabs[i].id);
        }

        const selectedTab = tabs.find(tab => tab.selected) || tabs[0];

        this._selectTab(selectedTab);
    }

    _selectTab(tab) {
        if (tab.selected) {
            return;
        }

        this._reset();

        tab.selected = true;

        const panel = this._getPanelForTab(tab);
        panel.hidden = false;

        this.dispatchEvent(new CustomEvent('tab-select', { detail: { tab } }))
    }

    _getPanelForTab(tab) {
        const panelId = tab.getAttribute('aria-controls');
        return this.querySelector(`#${panelId}`);
    }

    _reset() {
        const tabs = this._getTabs();
        const panels = this._getPanels();

        tabs.forEach(tab => tab.selected = false);
        panels.forEach(panel => panel.hidden = true);
    }

    _onClick(event) {
        if (event.target.getAttribute('role') === 'tab') {
            this._selectTab(event.target);
        }
    }
}

window.customElements.define('x-tabs', Tabs);