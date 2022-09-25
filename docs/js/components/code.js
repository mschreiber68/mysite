class Code extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Split into lines, remove blank lines
        const lines = this.innerHTML
            .split(/\r?\n/)
            .filter(line => line.match(/\S/));

        // Determine overall indentation based on indentation of first line
        const indentation = lines[0].match(/^\s*/)[0];

        // Remove overall indentation, recombine into string
        const code = lines
            .map(line => line.substring(indentation.length))
            .join('\n');

        this.innerHTML = `<pre><code>${code}</code></pre>`;

        window.hljs.highlightElement(this.querySelector('code'));
    }
}

window.customElements.define('x-code', Code);