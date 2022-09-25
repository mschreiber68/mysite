/***********************************************
    Tab 
 ***********************************************/

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
        this.#updateAriaAttrs();
    }

    connectedCallback() {
        this.id ||= `tab-${++tabCounter}`;

        this.setAttribute('role', 'tab');
        this.#updateAriaAttrs();
        this.#upgradeProperty('selected');
    }

    #updateAriaAttrs() {
        this.setAttribute('aria-selected', this.selected.toString());
        this.setAttribute('tabindex', this.selected ? '0' : '-1');
    }

    #upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }
}

window.customElements.define('x-tab', Tab);

/***********************************************
    TabList
 ***********************************************/

class TabList extends HTMLElement {
    connectedCallback() {
        this.setAttribute('role', 'tablist');
    }
}

window.customElements.define('x-tab-list', TabList);

/***********************************************
    TabPanel
 ***********************************************/

let panelCounter = 0;

class TabPanel extends HTMLElement {
    connectedCallback() {
        this.id ||= `tab-panel-${++panelCounter}`;

        this.setAttribute('role', 'tabpanel');
        this.setAttribute('tabindex', '0');
    }
}

window.customElements.define('x-tab-panel', TabPanel);

/***********************************************
    Tabs
 ***********************************************/

class Tabs extends HTMLElement {

    connectedCallback() {
        this.addEventListener('click', this.#onClick.bind(this));
        this.#linkPanelsAria();
    }

    #getTabs() {
        return [...this.querySelector('x-tab-list').querySelectorAll('x-tab')];
    }

    #getPanels() {
        return [...this.querySelectorAll('x-tab-panel')];
    }

    #linkPanelsAria() {
        const tabs = this.#getTabs();
        const panels = this.#getPanels();

        tabs.forEach((tab, i) => {
            if (i < panels.length) {
                tabs[i].setAttribute('aria-controls', panels[i].id);
                panels[i].setAttribute('aria-labelledby', tabs[i].id);
            }
        })
    }

    #selectTab(tab) {
        if (tab.selected) return;

        this.#reset();

        tab.selected = true;
        this.#getPanelForTab(tab).hidden = false;
        tab.focus();

        this.dispatchEvent(new CustomEvent('tab-select', { detail: { tab } }))
    }

    #getPanelForTab(tab) {
        const panelId = tab.getAttribute('aria-controls');
        return this.querySelector(`#${panelId}`);
    }

    #reset() {
        const tabs = this.#getTabs();
        tabs.forEach(tab => tab.selected = false);

        const panels = this.#getPanels();
        panels.forEach(panel => panel.hidden = true);
    }

    #onClick(event) {
        if (event.target.getAttribute('role') === 'tab') {
            this.#selectTab(event.target);
        }
    }
}

window.customElements.define('x-tabs', Tabs);