/***********************************************
    ModalContent
 ***********************************************/

class ModalContent extends HTMLElement {
    connectedCallback() {
        this.setAttribute('aria-modal', 'true');
    }
}

window.customElements.define('x-modal-content', ModalContent);

/***********************************************
    ModalDismiss
 ***********************************************/

class ModalDismiss extends HTMLElement {

    connectedCallback() {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'button');
        }
        this.addEventListener('click', this.#onClick.bind(this));
    }

    #onClick(event) {
        this.dispatchEvent(new CustomEvent('modal-dismiss-click', {bubbles: true}));
    }
}

window.customElements.define('x-modal-dismiss', ModalDismiss);

/***********************************************
    Modal
 ***********************************************/

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

    connectedCallback() {
        this.addEventListener('click', this.#onClick.bind(this));
        this.addEventListener('modal-dismiss-click', this.#onModalDismissClick.bind(this));
        this.#upgradeProperty('active');
    }

    #upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    #onClick(event) {
         if (event.target === this) {
             this.active = false;
         }
    }

    #onModalDismissClick(event) {
        event.stopPropagation();
        this.active = false;
    }
}

window.customElements.define('x-modal', Modal);