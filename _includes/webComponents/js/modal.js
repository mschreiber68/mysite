class ModalContent extends HTMLElement {
    connectedCallback() {
        this.setAttribute('aria-modal', 'true');
    }
}

window.customElements.define('x-modal-content', ModalContent);

class ModalDismiss extends HTMLElement {
    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }

    connectedCallback() {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'button');
        }
        this.addEventListener('click', this._onClick);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
    }

    _onClick(event) {
        this.dispatchEvent(new CustomEvent('modal-dismiss-click', {
            bubbles: true,
        }));
    }
}

window.customElements.define('x-modal-dismiss', ModalDismiss);

class Modal extends HTMLElement {
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
        this._onClick = this._onClick.bind(this);
        this._onModalDismissClick = this._onModalDismissClick.bind(this);
    }

    connectedCallback() {
        this.addEventListener('click', this._onClick);
        this.addEventListener('modal-dismiss-click', this._onModalDismissClick);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
        this.removeEventListener('modal-dismiss-click', this._onModalDismissClick);
    }

    _onClick(event) {
         if (event.target === this) {
             this.active = false;
         }
    }

    _onModalDismissClick(event) {
        event.stopPropagation();
        this.active = false;
    }
}

window.customElements.define('x-modal', Modal);