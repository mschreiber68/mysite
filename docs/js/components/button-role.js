const KEYCODE = {
    ENTER: 13,
    SPACE: 32,
}


class ButtonRole extends HTMLElement {
    #wrappedElement
    #mutationObserver

    constructor() {
        super();
        this.style.display = 'contents';
    }

    connectedCallback() {
        if (this.firstElementChild) {
            this.#wrapElement(this.firstElementChild);
        }

        this.#mutationObserver = new MutationObserver(this.#onMutation);
        this.#mutationObserver.observe(this, {childList: true})
    }

    disconnectedCallback() {
        this.#mutationObserver.disconnect();
    }

    #wrapElement(el) {
        el.setAttribute('role', 'button');
        if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }

        el.addEventListener('click', this.#onClick);
        el.addEventListener('keydown', this.#onKeyDown);

        this.#wrappedElement = el;
    }

    #unwrapElement() {
        this.#wrappedElement.removeEventListener('click', this.#onClick);
        this.#wrappedElement.removeEventListener('keydown', this.#onKeyDown);

        this.#wrappedElement = null;
    }

    #onMutation = () => {
        if (this.firstElementChild !== this.#wrappedElement) {
            this.#unwrapElement(this.#wrappedElement);

            if (this.firstElementChild) {
                this.#wrapElement(this.firstElementChild);
            }
        }
    }

    #onClick = () => {
        this.#toggleAriaPressed();
    }

    #onKeyDown = (event) => {
        switch (event.keyCode) {
            case KEYCODE.ENTER:
            case KEYCODE.SPACE:
                event.target.click();
                break;
        }
    }

    #toggleAriaPressed() {
        const pressed = this.firstElementChild.getAttribute('aria-pressed');
        if (pressed) {
            if (pressed === 'true') {
                this.firstElementChild.setAttribute('aria-pressed', 'false')
            }
            if (pressed === 'false') {
                this.firstElementChild.setAttribute('aria-pressed', 'true')
            }
        }
    }
}

if (!window.customElements.get('button-role'))
    window.customElements.define('button-role', ButtonRole);