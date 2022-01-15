class MikeToggle extends HTMLElement {
    static get observedAttributes() {
        return ['active', 'toggle-event'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (name) {
                case 'toggle-event':
                    this.toggleElement.removeEventListener(oldValue, this.toggle);
                    this.toggleElement.addEventListener(newValue, this.toggle);
                    break;
            }
        }
    }

    get active() {
        return this.hasAttribute('active');
    }

    set active(value) {
        if (value) {
            this.setAttribute('active', '');
        } else {
            this.removeAttribute('active');
        }
    }

    get toggleEvent() {
        return this.getAttribute('toggle-event') || 'click';
    }

    set toggleEvent(value) {
        this.setAttribute('toggle-event', value);
    }

    constructor() {
        super();

        const id = this.id || null;

        let selector = '[data-toggle]';
        if (id) {
            selector += `[data-for="${id}"]`;
        }
        this.toggleElement = this.querySelector(selector);

        this.toggle = () => {
            this.active = !this.active;
            this.dispatchEvent(new CustomEvent('toggle', {
                detail: {
                    active: this.active
                }
            }));
        };
    }

    connectedCallback() {
        this.toggleElement.addEventListener(this.toggleEvent, this.toggle);
    }

    disconnectedCallback() {
        this.toggleElement.removeEventListener(this.toggleEvent, this.toggle);
    }
}

window.customElements.define('mike-toggle', MikeToggle);
