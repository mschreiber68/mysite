class ImgFallback extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(ImgFallback.template.content.cloneNode(true));
    }

    connectedCallback() {
        this.querySelectorAll('img').forEach((img) => {
            if (img.complete) {
                if (img.naturalWidth === 0) {
                    this.#loadFallback(img);
                }
            } else {
                img.addEventListener('error', (event) => this.#loadFallback(event.target));
            }
        })
    }

    #loadFallback(img) {
        const fallbackSrc = this.getAttribute('src');
        if (!fallbackSrc) return;

        if (img.src === fallbackSrc) return;

        img.src = fallbackSrc;
    }
}

ImgFallback.template = document.createElement('template')
ImgFallback.template.innerHTML = `
<style>
    :host {
        display: contents;
    }
</style>
<slot></slot>
`;

window.customElements.define('img-fallback', ImgFallback);