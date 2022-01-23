/***************************************************************
 * HuntGame Square
 **************************************************************/

const squareTemplate = document.createElement('template');
squareTemplate.innerHTML = `
<style>
    .square {
        background-color: #bbb;
        /*border: 1px solid black; */
        height: 100%;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    }
</style>

<div class="square">   
</div>
`;

class HuntGameSquare extends HTMLElement {
    static get observedAttributes() {
        return ['winner', 'color'];
    }

    get winner() {
        return this.hasAttribute('winner');
    }

    set winner(value) {
        if (value)
            this.setAttribute('winner', '');
        else
            this.removeAttribute('winner');
    }

    get color() {
        return this.getAttribute('color');
    }

    set color(value) {
        if (value)
            this.setAttribute('color', value);
        else
            this.removeAttribute('color');
    }

    attributeChangedCallback(name) {
        if (name === 'winner') {
            if (this.winner) {
                this.element.classList.add('winner');
            } else {
                this.element.classList.remove('winner');
            }
        }
        if (name === 'color') {
            if (this.color) {
                this.element.style.backgroundColor = this.color;
            } else {
                this.element.style.backgroundColor = '#bbb';
            }
        }
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(squareTemplate.content.cloneNode(true));
        this.element = this.shadowRoot.querySelector('.square');
    }
}

window.customElements.define('x-huntgame-square', HuntGameSquare);

/***************************************************************
 * HuntGame
 **************************************************************/

const gameTemplate = document.createElement('template')
gameTemplate.innerHTML = `
<style>
    .grid {
        display: grid;
        gap: 1px;
        grid-template-rows: repeat(16, 20px);
        grid-template-columns: repeat(16, 20px);
    }
</style>

<div class="grid">

</div>
`;

const SIZE = 256;

class HuntGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

        this.grid = this.shadowRoot.querySelector('.grid');

        const location = Math.floor(Math.random() * SIZE);

        for (let i=0; i<SIZE; i++) {
            const square = document.createElement('x-huntgame-square');
            if (i === location) {
                square.setAttribute('winner', '');
                square.color = 'red';
                this.winnerSquare = square;
            }
            this.grid.appendChild(square);
        }
    }

    connectedCallback() {

    }
}

window.customElements.define('x-huntgame', HuntGame);
