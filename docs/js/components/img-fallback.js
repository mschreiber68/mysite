class ImgFallback extends HTMLElement {
    connectedCallback() {
        this.style.display = 'contents';

        this.querySelectorAll('img').forEach((img) => {
            if (img.complete) this.#loadFallback(img);
            else img.addEventListener('error', (event) => this.#loadFallback(event.target));
        })
    }

    #loadFallback(img) {
        const fallbackSrc = this.getAttribute('src');
        if (!fallbackSrc) return;

        if (img.src === fallbackSrc) return;

        img.src = fallbackSrc;
    }
}

window.customElements.define('img-fallback', ImgFallback);