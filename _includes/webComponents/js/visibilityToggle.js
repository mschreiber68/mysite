class MikeVisibilityToggle extends HTMLElement {
    static get observedAttributes() {
        return ['show'];
    }

    get show() {
        return this.hasAttribute('show');
    }

    set show(value) {
        if (value) {
            this.setAttribute('show', '');
        } else {
            this.removeAttribute('show');
        }
    }

    constructor() {
        super();

        this.triggerElement = this.querySelector('[data-trigger]');

        this.contentElement = this.querySelector('[data-content]');

        this._toggle = this.toggle.bind(this);
    }

    connectedCallback() {
        this.triggerElement.addEventListener('click', this._toggle);
    }

    disconnectedCallback() {
        this.triggerElement.removeEventListener('click', this._toggle);
    }

    toggle() {
        this.show = !this.show;
    }
}

window.customElements.define('mike-visibility-toggle', MikeVisibilityToggle);