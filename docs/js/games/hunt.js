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
        return ['state'];
    }

    get state() {
        return this.getAttribute('state')
    }

    set state(value) {
        this.setAttribute('state', value);
    }

    get colorVal() {
        return this.getAttribute('color-val')
    }

    set colorVal(value) {
        this.setAttribute('color-val', value);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'state') {
            if (newValue === HuntGameSquare.REVEAL_COLOR) {
                this.element.style.backgroundColor = this.colorVal;
            } else if (newValue === HuntGameSquare.REVEAL_WINNER) {
                this.element.style.backgroundColor = '#fff';
                this.element.textContent = '☘'
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

HuntGameSquare.REVEAL_COLOR = 'reveal_color';
HuntGameSquare.REVEAL_WINNER = 'reveal_winner;'

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
        this._onClick = this._onClick.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

        this.grid = this.shadowRoot.querySelector('.grid');

        const location = Math.floor(Math.random() * SIZE);

        for (let i=0; i<SIZE; i++) {
            const square = document.createElement('x-huntgame-square');
            if (i === location) {
                this.winner = square;

            }
            this.grid.appendChild(square);
        }
    }

    connectedCallback() {
        this.addEventListener('click', this._onClick);
    }

    disconnectedCallback() {
        // TODO
    }

    _onClick(event) {
        const square = event.composedPath().find(el => el.tagName === 'X-HUNTGAME-SQUARE');
        if (square === this.winner) {
            square.state = HuntGameSquare.REVEAL_WINNER;
        } else {
            square.colorVal = this._computeColor(square);
            square.state = HuntGameSquare.REVEAL_COLOR;
        }
    }

    _getElementCenter(element) {
        const {top, left, width, height} = element.getBoundingClientRect();
        return {
            x: left + width / 2,
            y: top + height / 2
        };
    }

    _computeColor(square) {
        const winnerPos = this._getElementCenter(this.winner);
        const currentPos = this._getElementCenter(square);

        const distance = Math.hypot(winnerPos.x - currentPos.x, winnerPos.y - currentPos.y);

        const alpha = 1 - distance / 320;
        return `rgba(255, 0, 0, ${alpha})`;
    }
}

window.customElements.define('x-huntgame', HuntGame);
