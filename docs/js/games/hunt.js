/***************************************************************
 * HuntGame Square
 **************************************************************/

const SQUARE_PX = 28;
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

const LENGTH = 20;
const NUM_SQUARES = Math.pow(LENGTH, 2);
const COLOR_SCALE = SQUARE_PX * LENGTH * 0.75;

const gameTemplate = document.createElement('template')
gameTemplate.innerHTML = `
<style>
    .grid {
        display: grid;
        gap: 1px;
        grid-template-rows: repeat(${LENGTH}, ${SQUARE_PX}px);
        grid-template-columns: repeat(${LENGTH}, ${SQUARE_PX}px);
    }
</style>
<div class="game">
    <div class="grid"></div>
    <div class="info">
        <div class="textHint"></div>
    </div>
</div>
`;

class HuntGame extends HTMLElement {
    constructor() {
        super();
        this._onClick = this._onClick.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

        this.grid = this.shadowRoot.querySelector('.grid');
        this.textHint = this.shadowRoot.querySelector('.textHint');
        this.previousColorIndex = null;

        this._initGrid();
    }

    connectedCallback() {
        this.addEventListener('click', this._onClick);
    }

    _initGrid() {
        const location = Math.floor(Math.random() * NUM_SQUARES);
        for (let i=0; i<NUM_SQUARES; i++) {
            const square = document.createElement('x-huntgame-square');
            if (i === location) {
                this.winner = square;

            }
            this.grid.appendChild(square);
        }
    }

    _onClick(event) {
        const square = event.composedPath().find(el => el.tagName === 'X-HUNTGAME-SQUARE');
        if (square) {
            if (square === this.winner) {
                this.textHint.textContent = '';
                this._revealAll();
            } else {
                const colorIndex = this._computeColorIndex(square);
                square.revealColor(COLORS[colorIndex]);
                this._updateTextHint(colorIndex);
            }
        }

    }

    _revealAll() {
        [...this.grid.querySelectorAll('x-huntgame-square')].forEach(square => {
            if (square === this.winner) {
                square.revealWinner();
            } else {
                square.revealColor(COLORS[this._computeColorIndex(square)]);
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

    _computeColorIndex(square) {
        const winnerPos = this._getElementCenter(this.winner);
        const currentPos = this._getElementCenter(square);
        const distance = Math.hypot(winnerPos.x - currentPos.x, winnerPos.y - currentPos.y);
        const computedIndex = Math.floor(distance / COLOR_SCALE * COLORS.length);
        return Math.min(computedIndex, COLORS.length - 1);
    }

    _updateTextHint(colorIndex) {
        let text;
        if (this.previousColorIndex) {
            if (this.previousColorIndex < colorIndex) {
                text = 'Colder';
            } else if (this.previousColorIndex > colorIndex) {
                text = 'Warmer';
            } else {
                text = this._getAbsoluteTemp(colorIndex);
            }
        } else {
            text = this._getAbsoluteTemp(colorIndex);
        }
        this.textHint.textContent = text;
        this.previousColorIndex = colorIndex;
    }

    _getAbsoluteTemp(colorIndex) {
        if (colorIndex < 3) {
            return 'Hot!';
        }
        if (colorIndex < COLORS.length / 2) {
            return 'Warm';
        }
        return 'Cold';
    }
}

window.customElements.define('x-huntgame', HuntGame);
