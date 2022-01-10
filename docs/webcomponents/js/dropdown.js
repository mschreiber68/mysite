const template = document.createElement('template');
template.innerHTML = `
<style>
.trigger {
    cursor: pointer;
}
</style>
<div>
    <slot name="trigger" class="trigger"></slot>
    <slot class="content"></slot>
</div>
`;

class MikeDropdown extends HTMLElement {
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
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.triggerElement = this.shadowRoot.querySelector('.trigger');

        this.contentElement = this.shadowRoot.querySelector('.content');
        this.contentElement.style.display = this.show ? 'block' : 'none';

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
        this.contentElement.style.display = this.show ? 'block' : 'none';
    }
}

window.customElements.define('mike-dropdown', MikeDropdown);