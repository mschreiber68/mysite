/***************************************************************
 * HuntGame Square
 **************************************************************/

const SQUARE_PX = 25;
const SQUARE_FONT_PX = Math.round(SQUARE_PX * 0.66);

const squareTemplate = document.createElement('template');
squareTemplate.innerHTML = `
<style>
    .square {
        background-color: #bbb;
        /*border: 1px solid black; */
        height: 100%;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: ${SQUARE_FONT_PX}px;
        line-height: ${SQUARE_FONT_PX}px;
    }
</style>

<div class="square">   
</div>
`;

class HuntGameSquare extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(squareTemplate.content.cloneNode(true));
        this.element = this.shadowRoot.querySelector('.square');
    }

    revealWinner() {
        this.element.style.backgroundColor = '#fff';
        this.element.textContent = '😄';
    }

    revealColor(color) {
        this.element.style.backgroundColor = color;
    }

    reset() {
        this.element.style.backgroundColor = '#bbb';
        this.element.textContent = '';
    }
}

window.customElements.define('x-huntgame-square', HuntGameSquare);

/***************************************************************
 * HuntGame
 **************************************************************/

const COLORS = [
    '#ff0000',
    '#FF1C00',
    '#FF3700',
    '#FF5300',
    '#FF6E00',
    '#FF8A00',
    '#FFA500',
    '#FFB400',
    '#FFC300',
    '#FFD200',
    '#FFE100',
    '#FFF000',
    '#FFFF00',
    '#D5EA00',
    '#AAD500',
    '#80C000',
    '#55AA00',
    '#2B9500',
    '#008000',
    '#006B2B',
    '#005555',
    '#004080',
    '#002BAA',
    '#0015D5',
    '#0000FF',
]

const LENGTH = 16;
const NUM_SQUARES = Math.pow(LENGTH, 2);
const COLOR_SCALE = SQUARE_PX * LENGTH * 0.75;

const gameTemplate = document.createElement('template')
gameTemplate.innerHTML = `
<style>
    .grid {
        display: grid;
        gap: 1px;
        grid-template-rows: repeat(16, ${SQUARE_PX}px);
        grid-template-columns: repeat(16, ${SQUARE_PX}px);
    }
</style>

<div class="grid">

</div>
`;

class HuntGame extends HTMLElement {
    constructor() {
        super();
        this._onClick = this._onClick.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

        this.grid = this.shadowRoot.querySelector('.grid');

        const location = Math.floor(Math.random() * NUM_SQUARES);

        for (let i=0; i<NUM_SQUARES; i++) {
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

    _onClick(event) {
        const square = event.composedPath().find(el => el.tagName === 'X-HUNTGAME-SQUARE');
        if (square) {
            if (square === this.winner) {
                this._revealAll();
            } else {
                square.revealColor(this._computeColor(square));
            }
        }

    }

    _revealAll() {
        [...this.grid.querySelectorAll('x-huntgame-square')].forEach(square => {
            if (square === this.winner) {
                square.revealWinner();
            } else {
                square.revealColor(this._computeColor(square));
            }
        })
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

        const colorIndex = Math.min(Math.floor(distance / COLOR_SCALE * COLORS.length), COLORS.length - 1);
        return COLORS[colorIndex];
    }
}

window.customElements.define('x-huntgame', HuntGame);
