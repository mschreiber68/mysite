const KEYCODE = {
    ENTER: 13,
}

class LinkLike extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.addEventListener('click', this.#onClick);
        this.addEventListener('keydown', this.#onKeyDown);
    }

    connectedCallback() {
        this.setAttribute('role', 'link');
        this.setAttribute('tabindex', '0')
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
}

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        display: contents;
        cursor: pointer;
    }
</style>
<slot></slot>
`

if (!window.customElements.get('link-like'))
    window.customElements.define('link-like', LinkLike);
