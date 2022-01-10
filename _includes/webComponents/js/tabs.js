class MikeTabs extends HTMLElement {
    constructor() {
        super();

        this.tabListElement = this.firstElementChild;
        this.contentListElement = this.lastElementChild;

        this._onTabListClick_ = this._onTabListClick.bind(this);
    }

    connectedCallback() {
        this.tabListElement.addEventListener('click', this._onTabListClick_);
    }

    disconnectedCallback() {
        this.tabListElement.removeEventListener('click', this._onTabListClick_);
    }

    activateTabAt(index) {
        this._setActiveListItem(this.tabListElement.children, index);
        this._setActiveListItem(this.contentListElement.children, index);
    }

    _onTabListClick(ev) {
        let tabIndexClicked = null;
        const tabs = this.tabListElement.children;
        for (let i=0; i<tabs.length; i++) {
            if (tabs.item(i).contains(ev.target) || tabs.item(i) === ev.target) {
                tabIndexClicked = i;
                break;
            }
        }

        this.activateTabAt(tabIndexClicked)
    }

    _setActiveListItem(htmlCollection, index) {
        for (let i=0; i<htmlCollection.length; i++) {
            if (i === index) {
                htmlCollection.item(i).classList.add('active');
            } else {
                htmlCollection.item(i).classList.remove('active');
            }
        }
    }
}

window.customElements.define('mike-tabs', MikeTabs);