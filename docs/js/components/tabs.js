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

const KEYCODE = {
    TAB: 9,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
}

class Tabs extends HTMLElement {
    connectedCallback() {
        this.#linkPanelsAria();
        this.addEventListener('click', this.#onClick);
        this.addEventListener('keydown', this.#onKeyDown);
    }

    get #tabs() {
        return [...this.#tabList.querySelectorAll('x-tab')];
    }

    get #panels() {
        return [...this.querySelectorAll('x-tab-panel')];
    }

    get #tabList() {
        return this.querySelector('x-tab-list');
    }

    get #selectedTab() {
        return this.#tabs.find(tab => tab.selected);
    }

    get #selectedTabPanel() {
        return this.#getPanelForTab(this.#selectedTab);
    }

    get #orientation() {
        return this.#tabList.getAttribute('aria-orientation') || 'horizontal';
    }

    #linkPanelsAria() {
        const tabs = this.#tabs;
        const panels = this.#panels;

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

    #selectFirstTab() {
        const tabs = this.#tabs;
        this.#selectTab(tabs[0]);
    }

    #selectPreviousTab() {
        const tabs = this.#tabs;
        const previousIndex = tabs.findIndex(tab => tab.selected) - 1;
        const previousTab = tabs[(previousIndex + tabs.length) % tabs.length];
        this.#selectTab(previousTab);
    }

    #selectNextTab() {
        const tabs = this.#tabs;
        const nextIndex = tabs.findIndex(tab => tab.selected) + 1;
        const nextTab = tabs[nextIndex % tabs.length];
        this.#selectTab(nextTab);
    }

    #selectLastTab() {
        const tabs = this.#tabs;
        this.#selectTab(tabs.length - 1);
    }

    #getPanelForTab(tab) {
        const panelId = tab.getAttribute('aria-controls');
        return this.querySelector(`#${panelId}`);
    }

    #reset() {
        const tabs = this.#tabs;
        tabs.forEach(tab => tab.selected = false);

        const panels = this.#panels;
        panels.forEach(panel => panel.hidden = true);
    }

    #onClick = (event) => {
        if (event.target.getAttribute('role') === 'tab') {
            this.#selectTab(event.target);
        }
    }

    #onKeyDown = (event) => {
        if (event.altKey) return;

        let isHandled = false;

        if (['tab', 'tablist'].includes(event.target.getAttribute('role'))) {
            switch (event.keyCode) {
                case KEYCODE.TAB:
                    if (!event.shiftKey) {
                        this.#selectedTabPanel.focus();
                        isHandled = true;
                    }
                    break;
                case KEYCODE.HOME:
                    this.#selectFirstTab();
                    isHandled = true;
                    break;
                case KEYCODE.LEFT:
                    if (this.#orientation === 'horizontal') {
                        this.#selectPreviousTab();
                        isHandled = true;
                    }
                    break;
                case KEYCODE.UP:
                    if (this.#orientation === 'vertical') {
                        this.#selectPreviousTab();
                        isHandled = true;
                    }
                    break;
                case KEYCODE.RIGHT:
                    if (this.#orientation === 'horizontal') {
                        this.#selectNextTab();
                        isHandled = true;
                    }
                    break;
                case KEYCODE.DOWN:
                    if (this.#orientation === 'vertical') {
                        this.#selectNextTab();
                        isHandled = true;
                    } else if (this.#tabList.compareDocumentPosition(this.#selectedTabPanel) === Node.DOCUMENT_POSITION_FOLLOWING) {
                        // For Horizontal tabs, if the panel is after the tablist, the DOWN key should focus the panel.
                        // Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tabpanel_role
                        this.#selectedTabPanel.focus();
                        isHandled = true;
                    }
                    break;
                case KEYCODE.END:
                    this.#selectLastTab();
                    isHandled = true;
                    break;
            }
        }

        if (isHandled) {
            event.preventDefault();
        }
    }
}

window.customElements.define('x-tabs', Tabs);