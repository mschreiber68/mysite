class MathRaceTrack extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRaceTrack.template.content.cloneNode(true));

        this._cpu1 = this.shadowRoot.querySelector('.cpu1');
        this._cpu2 = this.shadowRoot.querySelector('.cpu2');
        this._player = this.shadowRoot.querySelector('.player');

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

        this.cpu1Pos = this.cpu1Pos + Math.min(Math.floor(Math.random() * 4), this._cpu1.offsetLeft);
        if (this._cpu1.offsetLeft <= 0) {
            this.dispatchEvent(new CustomEvent('game_over', {detail: {winner: 'Green'}}))
            this._done = true;
            return;
        }

        this.cpu2Pos = this.cpu2Pos + Math.min(Math.floor(Math.random() * 4), this._cpu2.offsetLeft);
        if (this._cpu2.offsetLeft <= 0) {
            this.dispatchEvent(new CustomEvent('game_over', {detail: {winner: 'Blue'}}))
            this._done = true;
        }
    }

    advancePlayer() {
        if (this._done) {
            return;
        }

        this.playerPos = this.playerPos + Math.min(30, this._player.offsetLeft);
        if (this._player.offsetLeft <= 0) {
            this.dispatchEvent(new CustomEvent('game_over', {detail: {winner: 'Red'}}))
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
        } else {
            this.dispatchEvent(new CustomEvent('answered_incorrectly'));
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
        width: 2em;
        padding: 5px;
        text-align: center;
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

class MathRaceProblemTimer extends HTMLElement {
    #timerInterval;
    #seconds;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRaceProblemTimer.template.content.cloneNode(true));
        this.#seconds = this.shadowRoot.querySelector('.seconds');
    }

    restart() {
        this.stop();
        this.seconds = 10;
        this.#timerInterval = setInterval(this.decrement.bind(this), 1000);
    }

    stop() {
        clearInterval(this.#timerInterval);
    }

    decrement() {
        if (this.seconds > 0) {
            this.seconds--;
        } else {
            this.stop();
            this.dispatchEvent(new CustomEvent('times_up'));
        }
    }

    get seconds() {
        return parseInt(this.#seconds.textContent, 10);
    }

    set seconds(value) {
        if (value < 10) {
            value = `0${value}`;
        }
        this.#seconds.textContent = value;
    }
}

MathRaceProblemTimer.template = document.createElement('template');
MathRaceProblemTimer.template.innerHTML = `
<style>
    :host {
        font-size: 12px;
    }
</style>
<span>
    :<span class="seconds"></span>
</span>
`;

window.customElements.define('x-mathrace-problemtimer', MathRaceProblemTimer);

class MathRace extends HTMLElement {
    #incorrectCount = 0;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRace.template.content.cloneNode(true));
        this.brokeDownContainer = this.shadowRoot.querySelector('.brokeDownContainer');

        /** @type HTMLDialogElement */
        this.dialog = this.shadowRoot.querySelector('dialog');
        this.dialog.addEventListener('close', this.onDialogClose.bind(this));

        /** @type MathRaceTrack */
        this.track = this.shadowRoot.querySelector('x-mathrace-track');

        /** @type MathRaceProblem **/
        this.problem = this.shadowRoot.querySelector('x-mathrace-problem');

        /** @type MathRaceProblemTimer */
        this.problemTimer = this.shadowRoot.querySelector('x-mathrace-problemtimer');

        this.animationInterval = null;
        this.isBrokenDown = false;
    }

    connectedCallback() {
        this.track.addEventListener('game_over', this.onGameOver.bind(this));
        this.problem.addEventListener('answered_correctly', () => this.onCorrectAnswer());
        this.problem.addEventListener('answered_incorrectly', () => this.onIncorrectAnswer());
        this.problemTimer.addEventListener('times_up', this.onTimesUp.bind(this))

        this.animationInterval = setInterval(() => this.track.advanceCpu(), 250);
        this.problemTimer.restart();
    }

    disconnectedCallback() {
        clearInterval(this.animationInterval);
    }

    onGameOver(event) {
        this.dialog.querySelector('.dialogMessage').textContent = `${event.detail.winner} Wins!`;
        this.dialog.showModal();
        this.problemTimer.stop();
    }

    onCorrectAnswer(event) {
        if (this.isBrokenDown) {
            return;
        }

        this.track.advancePlayer();
        this.problem.createNewProblem();
        this.problemTimer.restart();
    }

    onIncorrectAnswer(event) {
        if (this.isBrokenDown) {
            return;
        }

        this.problem.answer = '';

        this.#incorrectCount++;
        if (this.#incorrectCount === 3) {
            this.breakDown();
            this.#incorrectCount = 0;
        }
    }

    onTimesUp() {
        this.problem.answer = '';
        this.problem.createNewProblem();
        this.problemTimer.restart();
    }

    breakDown() {
        this.isBrokenDown = true;
        this.brokeDownContainer.style.visibility = 'visible';
        this.problemTimer.stop();
        setTimeout(() => {
            this.brokeDownContainer.style.visibility = 'hidden';
            this.isBrokenDown = false;
            this.problem.createNewProblem();
            this.problemTimer.restart();
        }, 3000);
    }

    onDialogClose() {
        this.track.init();
        this.problem.createNewProblem();
        this.problemTimer.restart();
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
    .brokeDownContainer {
        position: relative;
        margin: 60px 0 0 40px;
        background: white;
        border-radius: 50%;
        height: 90px;
        width: 90px;
        box-shadow: 
            white 97.5px -22.5px 0 -7.5px,
            white 37.5px -37.5px,
            white 45px 15px,
            white 90px 22.5px 0 -15px,
            white 127.5px 7.5px 0 -7.5px;
    }
    .brokeDownText {
        position: absolute;
        left: 60px;
        width: 120px;
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
        padding: 20px 20px 10px;
    }
    .tvStand {
        background-color: #555;
        width: 20px;
        height: 80px;
    }
    .brokeDownContainer {
        visibility: hidden;
    }
</style>
<x-mathrace-track></x-mathrace-track>
<div class="playArea">
    <div class="leftContainer">
        <div class="brokeDownContainer">
            <span class="brokeDownText">Oh no...<br>Red broke down</span>
        </div>
    </div>
    <div class="middleContainer">
        <div class="tvScreen">
            <x-mathrace-problem></x-mathrace-problem>
            <x-mathrace-problemtimer></x-mathrace-problemtimer>
        </div>
        <div class="tvStand"></div>
    </div>
    <div class="rightContainer"></div>
</div>
<dialog>
    <div class="dialogMessage"></div>
</dialog>
`;

window.customElements.define('x-mathrace', MathRace);


