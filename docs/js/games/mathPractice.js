class MathRaceTrack extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRaceTrack.template.content.cloneNode(true));

        this._cpu1 = this.shadowRoot.querySelector('.cpu1');
        this._cpu2 = this.shadowRoot.querySelector('.cpu2');
        this._player = this.shadowRoot.querySelector('.player');
    }

    connectedCallback() {
        this.init();
    }

    init() {
        this._cpu1Pos = 0;
        this._cpu2Pos = 0;
        this._playerPos = 0;
        this._cpu1.style.right = '0';
        this._cpu2.style.right = '0';
        this._player.style.right = '0';
        this._done = false;
    }

    advanceCpu() {
        if (this._done) {
            return;
        }

        this.cpu1Pos = this.cpu1Pos + Math.floor(Math.random() * 4);
        if (this._cpu1.offsetLeft <= 0) {
            // Emit CPU 1 wins
            this._done = true;
            return;
        }

        this.cpu2Pos = this.cpu2Pos + Math.floor(Math.random() * 4);
        if (this._cpu2.offsetLeft <= 0) {
            // Emit CPU 2 wins
            this._done = true;
        }
    }

    advancePlayer() {
        if (this._done) {
            return;
        }

        this.playerPos = this.playerPos + 20;
        if (this._player.offsetLeft <= 0) {
            // Emit Player Wins
            this._done = true;
        }
    }

    get cpu1Pos() {
        return this._cpu1Pos;
    }

    set cpu1Pos(pos) {
        this._cpu1Pos = pos;
        this._cpu1.style.right = `${pos}px`;
    }

    get cpu2Pos() {
        return this._cpu2Pos;
    }

    set cpu2Pos(pos) {
        this._cpu2Pos = pos;
        this._cpu2.style.right = `${pos}px`;
    }

    get playerPos() {
        return this._playerPos;
    }

    set playerPos(pos) {
        this._playerPos = pos;
        this._player.style.right = `${pos}px`;
    }
}

MathRaceTrack.template = document.createElement('template');
MathRaceTrack.template.innerHTML = `
<style>
    :host {
        display: block;
        background-color: black;
    }
    .lane {
        position: relative;
        background-color: black;
        height: 50px;
    }
    .laneDivider {
        height: 2px;
        background: repeating-linear-gradient(to right, yellow 0, yellow 10px, transparent 10px, transparent 20px);
    }
    .car {
        position: absolute; 
        height: 50px;
        right: 0;
    }
    
</style>
<div class="lane">
    <img src="/images/car-green.svg" class="car cpu1">
</div>
<div class="laneDivider"></div>
<div class="lane">
    <img src="/images/car-blue.svg" class="car cpu2">
</div>
<div class="laneDivider"></div>
<div class="lane">
    <img src="/images/car-red.svg" class="car player">
</div>
`;



window.customElements.define('x-mathrace-track', MathRaceTrack);

class MathRaceProblem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRaceProblem.template.content.cloneNode(true));

        this._operand1 = this.shadowRoot.querySelector('.operand1');
        this._operator = this.shadowRoot.querySelector('.operator');
        this._operand2 = this.shadowRoot.querySelector('.operand2');
        this._form = this.shadowRoot.querySelector('form');
        this._answerInput = this.shadowRoot.querySelector('.answerInput');
    }

    connectedCallback() {
        this.createNewProblem();
        this._form.addEventListener('submit', this.onFormSubmit.bind(this))
    }

    onFormSubmit(event) {
        event.preventDefault();

        if (this.isAnswerCorrect()) {
            this.dispatchEvent(new CustomEvent('answered_correctly'));
            this.createNewProblem();
        } else {
        }
    }

    createNewProblem() {
        if (this.generateRandomNumber(2) === 1) {
            this.createNewMultiplicationProblem();
        } else {
            this.createNewDivisionProblem();
        }

        this.answer = '';
    }

    createNewMultiplicationProblem() {
        this.op1 = this.generateRandomNumber(12);
        this.op2 = this.generateRandomNumber(12);
        this.operator = MathRaceProblem.OP_MULT;
    }

    createNewDivisionProblem() {
        const divisor = this.generateRandomNumber(10);
        const quotient = this.generateRandomNumber(10);
        this.op1 = divisor * quotient;
        this.op2 = divisor;
        this.operator = MathRaceProblem.OP_DIV;
    }

    generateRandomNumber(max) {
        return Math.floor(Math.random() * max + 1);
    }

    get op1() {
        return parseInt(this._operand1.textContent, 10);
    }

    set op1(value) {
        this._operand1.textContent = value;
    }

    get operator() {
        return this._operator.textContent;
    }

    set operator(value) {
        this._operator.textContent = value;
    }

    get op2() {
        return parseInt(this._operand2.textContent, 10);
    }

    set op2(value) {
        this._operand2.textContent = value;
    }

    get answer() {
        return parseInt(this._answerInput.value, 10);
    }

    set answer(value) {
        this._answerInput.value = value;
    }

    isAnswerCorrect() {
        if (this.operator === MathRaceProblem.OP_MULT)
        {
            return this.op1 * this.op2 === this.answer;
        }

        return this.op1 / this.op2 === this.answer;
    }
}

MathRaceProblem.OP_MULT = 'x';
MathRaceProblem.OP_DIV = '÷';

MathRaceProblem.template = document.createElement('template');
MathRaceProblem.template.innerHTML = `
<style>
    :host {
        display: flex;
        gap: 8px;
        font-size: 36px;
    }
    .answerInput {
        font-size: 36px;
        width: 3em;
    }
</style>
<span class="operand1"></span>
<span class="operator">x</span>
<span class="operand2"></span>
<span class="equalsSign">=</span>
<form>
    <input type="text" class="answerInput">
</form>
`;

window.customElements.define('x-mathrace-problem', MathRaceProblem);

///////

class MathRace extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRace.template.content.cloneNode(true));

        /** @type MathRaceTrack */
        this.track = this.shadowRoot.querySelector('x-mathrace-track');

        /** @type MathRaceProblem **/
        this.problem = this.shadowRoot.querySelector('x-mathrace-problem');

        this.animationInterval = null;
    }

    connectedCallback() {
        this.problem.addEventListener('answered_correctly', () => this.track.advancePlayer());

        this.animationInterval = setInterval(() => this.track.advanceCpu(), 250);
    }


}

MathRace.template = document.createElement('template');
MathRace.template.innerHTML = `
<style>
    :host {
        display: block;
        background-color: lawngreen;
        padding-top: 50px;
    }
    .playArea { 
        display: grid;
        grid: auto / 200px 1fr 200px;
    }
    .middleContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 75px;
    }
    .tvScreen {
        border: 15px solid grey;
        border-radius: 15px;
        background-color: white;
        padding: 20px;
    }
    .tvStand {
        background-color: #555;
        width: 20px;
        height: 80px;
    }
</style>
<x-mathrace-track></x-mathrace-track>
<div class="playArea">
    <div class="leftContainer"></div>
    <div class="middleContainer">
        <div class="tvScreen">
            <x-mathrace-problem></x-mathrace-problem>
        </div>
        <div class="tvStand"></div>
    </div>
    <div class="rightContainer"></div>
</div>
`;

window.customElements.define('x-mathrace', MathRace);

/////////////////


///////////////////////////////////////////////////////////////

