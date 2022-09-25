class Code extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<pre><code>${this.innerHTML}</code></pre>`;

        window.hljs.highlightElement(this.querySelector('code'));
    }
}

window.customElements.define('x-code', Code);