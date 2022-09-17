import { applySoleModifier } from '../domutils.js'

/***************************************************************
 * HuntGame Square
 **************************************************************/

const SQUARE_PX = 28;
const SQUARE_FONT_PX = Math.round(SQUARE_PX * 0.66);

const squareTemplate = document.createElement('template');
squareTemplate.innerHTML = `
<style>
    .square {
        cursor: pointer;
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
        this.element.textContent = '😀';
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
    '#FF0000',
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
    .game {
        display: grid;
        grid-template-columns: auto 1fr;
    }
    .grid {
        display: grid;
        gap: 1px;
        grid-template-rows: repeat(${LENGTH}, ${SQUARE_PX}px);
        grid-template-columns: repeat(${LENGTH}, ${SQUARE_PX}px);
    }
    .info {
        display: grid;
        justify-items: center;
        align-items: center;
    }
    .textHint {
        font-size: 50px;
        line-height: 50px;
        min-height: 50px;
        font-weight: bold;
    }
    .textHint--hot {
        background-image: linear-gradient(0, lightsalmon, red);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .textHint--cold {
        background-image: linear-gradient(0, lightblue, blue);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .textHint--winner {
        background-image: linear-gradient(0, gold, darkgoldenrod);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .score {
        font-size: 50px;
        font-weight: bold;
    }
    .restartButton {
        cursor: pointer;
        background-color: var(--primary-color);
        color: #fff;
        border: none;
        padding: 12px;
        border-radius: 6px;
    }
</style>
<div class="game">
    <div class="grid"></div>
    <div class="info">
        <div class="textHint"></div>
        <div class="score"></div>
        <button class="restartButton">Restart</button>
    </div>
</div>
`;

class HuntGame extends HTMLElement {
    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
        this._restart = this._restart.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(gameTemplate.content.cloneNode(true));

        this.grid = this.shadowRoot.querySelector('.grid');
        this.textHint = this.shadowRoot.querySelector('.textHint');
        this.score = this.shadowRoot.querySelector('.score');
        this.restartButton = this.shadowRoot.querySelector('.restartButton');

        this.previousColorIndex = null;
        this.scoreCalculator = null;
        this.isGameOver = false;

        this._initGrid();
    }

    connectedCallback() {
        this.addEventListener('click', this._onClick);
        this.restartButton.addEventListener('click', this._restart)
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

    _restart() {
        this.previousColorIndex = null;
        const location = Math.floor(Math.random() * NUM_SQUARES);
        this.grid.querySelectorAll('x-huntgame-square').forEach((square, i) => {
            square.reset();
            if (location === i) {
                this.winner = square;
            }
        });
        this.textHint.textContent = '';
        this.score.textContent = '';
        this.scoreCalculator = null;
        this.isGameOver = false;
    }

    _onClick(event) {
        if (this.isGameOver) {
            return;
        }

        const square = event.composedPath().find(el => el.tagName === 'X-HUNTGAME-SQUARE');
        if (!square) {
            return;
        }

        if (!this.scoreCalculator) {
            this.scoreCalculator = new GameScoreCalculator();
        }

        if (square === this.winner) {
            this.textHint.textContent = 'Winner!';
            applySoleModifier(this.textHint, 'textHint--winner');
            this._revealAll();
            this._displayScore();
            this.isGameOver = true;
        } else {
            const colorIndex = this._computeColorIndex(square);
            square.revealColor(COLORS[colorIndex]);
            this._updateTextHint(colorIndex);
            this.scoreCalculator.incrementClicks();
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

    _displayScore() {
        this.scoreCalculator.end();
        this.score.textContent = `Score: ${this.scoreCalculator.calculateScore()}`;
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
        let text, modifier;
        if (this.previousColorIndex && this.previousColorIndex !== colorIndex) {
            if (this.previousColorIndex < colorIndex) {
                text = 'Colder';
                modifier = 'textHint--cold';
            } else {
                text = 'Warmer';
                modifier = 'textHint--hot';
            }
        } else {
            if (colorIndex < 3) {
                text = 'Hot!';
                modifier = 'textHint--hot';
            } else if (colorIndex < COLORS.length / 2) {
                text = 'Warm';
                modifier = 'textHint--hot';
            } else {
                text = 'Cold';
                modifier = 'textHint--cold';
            }
        }

        this.textHint.textContent = text;
        applySoleModifier(this.textHint, modifier);

        this.previousColorIndex = colorIndex;
    }
}

window.customElements.define('x-huntgame', HuntGame);

class GameScoreCalculator {
    constructor() {
        this.timeStarted = performance.now();
        this.timeEnded = null;
        this.clicks = 0;
    }

    incrementClicks() {
        this.clicks++;
    }

    end() {
        this.timeEnded = performance.now();
    }

    calculateScore() {
        const timeDiff = this.timeEnded - this.timeStarted;
        const calculated = Math.round(1000 - (timeDiff / 100) - (this.clicks * 20));
        return Math.max(calculated, 1);
    }
}