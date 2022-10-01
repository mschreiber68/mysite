const KEYCODE = {
    ENTER: 13,
}

class LinkLike extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', this.#onClick.bind(this));
        this.addEventListener('keydown', this.#onKeyDown.bind(this));
    }

    connectedCallback() {
        this.setAttribute('role', 'link');
        this.setAttribute('tabindex', '0')
    }

    #onClick() {
        this.#doLinkAction();
    }

    #onKeyDown(event) {
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
}

window.customElements.define('link-like', LinkLike);
