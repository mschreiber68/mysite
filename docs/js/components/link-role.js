const KEYCODE = {
    ENTER: 13,
}

class LinkRole extends HTMLElement {
    #wrappedElement
    #mutationObserver

    constructor() {
        super();
        this.style.display = 'contents';
    }

    connectedCallback() {
        if (this.firstElementChild) {
            this.#wrapElement(this.firstElementChild);
        } else if (this.textContent) {
            this.#convertTextContentToSpan();
            this.#wrapElement(this.firstElementChild);
        }

        this.#mutationObserver = new MutationObserver(this.#onMutation);
        this.#mutationObserver.observe(this, {childList: true})
    }

    disconnectedCallback() {
        this.#mutationObserver.disconnect();
    }

    #wrapElement(el) {
        el.setAttribute('role', 'link');
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
            this.#unwrapElement();

            if (this.firstElementChild) {
                this.#wrapElement(this.firstElementChild);
            }
        }
    }

    #onClick = () => {
        this.#doLinkAction();
    }

    #onKeyDown = (event) => {
        switch (event.keyCode) {
            case KEYCODE.ENTER:
                this.#doLinkAction();
                break;
        }
    }

    #doLinkAction() {
        const attrs = this
            .getAttributeNames()
            .reduce((attrs, attrName) => {
                attrs[attrName] = this.getAttribute(attrName);
                return attrs;
            }, {});

        const a = document.createElement('a');
        for (const attrName in attrs) {
            a.setAttribute(attrName, attrs[attrName]);
        }
        a.click();
    }

    #convertTextContentToSpan() {
        const text = this.textContent;
        this.textContent = '';
        const span = document.createElement('span');
        span.textContent = text;
        this.appendChild(span);
    }
}

if (!window.customElements.get('link-role'))
    window.customElements.define('link-role', LinkRole);
