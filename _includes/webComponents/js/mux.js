class MikeMux extends HTMLElement {
    static get observedAttributes() {
        return ['selected'];
    }

    get selected() {
        return this.getAttribute('selected');
    }

    set selected(value) {
        this.setAttribute('selected', value);
    }

    constructor() {
        super();

        const id = this.id || null;

        let selector = '[data-select]';
        if (id) {
            selector += `[data-for="${id}"]`;
        }

        this.selectElements = this.querySelectorAll(selector);

        this._onSelectActivated = (event) => {
            this.selected = event.currentTarget.getAttribute('data-select');
            this.dispatchEvent(new CustomEvent('select', {
                detail: {
                    selected: this.selected
                }
            }))
        }
    }

    connectedCallback() {
        for (let i = 0; i < this.selectElements.length; i++) {
            this.selectElements[i].addEventListener('click', this._onSelectActivated);
        }
    }

    disconnectedCallback() {
        for (let i = 0; i < this.selectElements.length; i++) {
            this.selectElements[i].removeEventListener('click', this._onSelectActivated);
        }
    }
}

window.customElements.define('mike-mux', MikeMux);