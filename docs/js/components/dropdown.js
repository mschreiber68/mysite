
class DropdownContent extends HTMLElement {

}

window.customElements.define('x-dropdown-content', DropdownContent);

class DropdownToggle extends HTMLElement {

}

window.customElements.define('x-dropdown-toggle', DropdownToggle);

class Dropdown extends HTMLElement {
    static get observedAttributes() {
        return ['active'];
    }

    get active() {
        return this.hasAttribute('active');
    }

    set active(value) {
        if (value)
            this.setAttribute('active', '');
        else
            this.removeAttribute('active');
    }

    attributeChangedCallback(name) {
        if (name === 'active') {
            const eventName = this.active ? 'show' : 'hide';
            this.dispatchEvent(new CustomEvent(eventName));
        }
    }

    constructor() {
        super();
        this._onDocumentClick = this._onDocumentClick.bind(this);
    }

    connectedCallback() {
        this._upgradeProperty('active');

        this.toggleElement = this.querySelector('x-dropdown-toggle');
        this.contentElement = this.querySelector('x-dropdown-content');

        document.addEventListener('click', this._onDocumentClick);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._onDocumentClick);
    }

    _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    _onDocumentClick(event) {
        if (this._wasToggleClicked(event)) {
            this.active = !this.active;
        } else if (this._wasClickOutsideContent(event)) {
            this.active = false;
        }
    }

    _wasToggleClicked(event) {
        return this.toggleElement.contains(event.target);
    }

    _wasClickOutsideContent(event) {
        return event.target !== this.contentElement && event.target.contains(this.contentElement);
    }
}

window.customElements.define('x-dropdown', Dropdown);
