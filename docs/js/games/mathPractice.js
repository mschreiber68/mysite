/***********************************************
    MathRaceTrack
 ***********************************************/

class MathRaceTrack extends HTMLElement {
    #cpu1Car;
    #cpu2Car;
    #playerCar;
    #isDone = false;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRaceTrack.template.content.cloneNode(true));

        this.#cpu1Car = this.shadowRoot.querySelector('.cpu1');
        this.#cpu2Car = this.shadowRoot.querySelector('.cpu2');
        this.#playerCar = this.shadowRoot.querySelector('.player');
        this.#cpu1Car.playerName = 'Green';
        this.#cpu2Car.playerName = 'Blue';
        this.#playerCar.playerName = 'Red';

        this.init();
    }

    init() {
        this.#cpu1Pos = this.#cpu2Pos = this.#playerPos = 0;
        this.#isDone = false;
    }

    advanceCpu() {
        if (this.#isDone) {
            return;
        }

        this.#cpu1Pos += MathRaceTrack.#calcCpuMove(this.#cpu1Car);
        if (this.#checkForWin(this.#cpu1Car)) {
            return;
        }

        this.#cpu2Pos += MathRaceTrack.#calcCpuMove(this.#cpu2Car);
        this.#checkForWin(this.#cpu2Car)
    }

    advancePlayer() {
        if (this.#isDone) {
            return;
        }

        this.#playerPos += this.#calcPlayerMove();
        this.#checkForWin(this.#playerCar);
    }

    static #calcCpuMove(car) {
        const randomDistance = Math.floor(Math.random() * 4);
        return Math.min(randomDistance, car.offsetLeft);
    }

    #calcPlayerMove() {
        return Math.min(35, this.#playerCar.offsetLeft);
    }

    #checkForWin(car) {
        if (car.offsetLeft <= 0) {
            this.dispatchEvent(new CustomEvent('game_over', {detail: {winner: car.playerName}}))
            this.#isDone = true;
            return true;
        }

        return false;
    }

    get #cpu1Pos() {
        return MathRaceTrack.#getCarPos(this.#cpu1Car);
    }

    set #cpu1Pos(pos) {
        MathRaceTrack.#setCarPos(this.#cpu1Car, pos);
    }

    get #cpu2Pos() {
        return MathRaceTrack.#getCarPos(this.#cpu2Car);
    }

    set #cpu2Pos(pos) {
        MathRaceTrack.#setCarPos(this.#cpu2Car, pos);
    }

    get #playerPos() {
        return MathRaceTrack.#getCarPos(this.#playerCar);
    }

    set #playerPos(pos) {
        MathRaceTrack.#setCarPos(this.#playerCar, pos);
    }

    static #getCarPos(car) {
        return parseInt(getComputedStyle(car).right, 10);
    }

    static #setCarPos(car, pos) {
        car.style.right = `${pos}px`;
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

/***********************************************
    MathRaceProblem
 ***********************************************/

class MathRaceProblem extends HTMLElement {
    #op1El;
    #operatorEl;
    #op2El;
    #form;
    #answerInput;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRaceProblem.template.content.cloneNode(true));

        this.#op1El = this.shadowRoot.querySelector('.operand1');
        this.#operatorEl = this.shadowRoot.querySelector('.operator');
        this.#op2El = this.shadowRoot.querySelector('.operand2');
        this.#form = this.shadowRoot.querySelector('form');
        this.#answerInput = this.shadowRoot.querySelector('.answerInput');

        this.#form.addEventListener('submit', this.#onFormSubmit.bind(this));

        this.createNewProblem();
    }

    createNewProblem() {
        const coinFlip = Math.random() > 0.5;
        if (coinFlip) {
            this.#createNewMultiplicationProblem();
        } else {
            this.#createNewDivisionProblem();
        }

        this.clearAnswer();
    }

    clearAnswer() {
        this.#answer = '';
    }

    #onFormSubmit(event) {
        event.preventDefault();

        if (this.#isAnswerCorrect()) {
            this.dispatchEvent(new CustomEvent('answered_correctly'));
        } else {
            this.dispatchEvent(new CustomEvent('answered_incorrectly'));
        }
    }

    #createNewMultiplicationProblem() {
        this.#op1 = MathRaceProblem.#getRandomInt(12);
        this.#op2 = MathRaceProblem.#getRandomInt(12);
        this.#operator = MathRaceProblem.OP_MULT;
    }

    #createNewDivisionProblem() {
        const divisor = MathRaceProblem.#getRandomInt(10);
        const quotient = MathRaceProblem.#getRandomInt(10);
        this.#op1 = divisor * quotient;
        this.#op2 = divisor;
        this.#operator = MathRaceProblem.OP_DIV;
    }

    static #getRandomInt(max) {
        return Math.ceil(Math.random() * max);
    }

    get #op1() {
        return parseInt(this.#op1El.textContent, 10);
    }

    set #op1(value) {
        this.#op1El.textContent = value;
    }

    get #operator() {
        return this.#operatorEl.textContent;
    }

    set #operator(value) {
        this.#operatorEl.textContent = value;
    }

    get #op2() {
        return parseInt(this.#op2El.textContent, 10);
    }

    set #op2(value) {
        this.#op2El.textContent = value;
    }

    get #answer() {
        return parseInt(this.#answerInput.value, 10);
    }

    set #answer(value) {
        this.#answerInput.value = value;
    }

    #isAnswerCorrect() {
        if (this.#operator === MathRaceProblem.OP_MULT)
        {
            return this.#op1 * this.#op2 === this.#answer;
        }

        return this.#op1 / this.#op2 === this.#answer;
    }
}

MathRaceProblem.OP_MULT = '×';
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

/***********************************************
    MathRaceProblemTimer
 ***********************************************/

class MathRaceProblemTimer extends HTMLElement {
    #secondsEl;
    #timerInterval;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRaceProblemTimer.template.content.cloneNode(true));
        this.#secondsEl = this.shadowRoot.querySelector('.seconds');
    }

    restart() {
        this.stop();
        this.#seconds = 10;
        this.#timerInterval = setInterval(this.#decrement.bind(this), 1000);
    }

    stop() {
        if (this.#timerInterval) {
            clearInterval(this.#timerInterval);
            this.#timerInterval = null;
        }
    }

    #decrement() {
        if (this.#seconds > 0) {
            this.#seconds--;
        } else {
            this.stop();
            this.dispatchEvent(new CustomEvent('times_up'));
        }
    }

    get #seconds() {
        return parseInt(this.#secondsEl.textContent, 10);
    }

    set #seconds(value) {
        if (value < 10) {
            value = `0${value}`;
        }
        this.#secondsEl.textContent = value;
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

/***********************************************
    MathRaceScore
 ***********************************************/

class MathRaceScore extends HTMLElement {
    #rightCount;
    #wrongCount;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRaceScore.template.content.cloneNode(true));
        this.#rightCount = this.shadowRoot.querySelector('.rightCount');
        this.#wrongCount = this.shadowRoot.querySelector('.wrongCount');
    }

    get numRight() {
        return parseInt(this.#rightCount.textContent, 10);
    }

    set numRight(value) {
        this.#rightCount.textContent = value;
    }

    get numWrong() {
        return parseInt(this.#wrongCount.textContent, 10);
    }

    set numWrong(value) {
        this.#wrongCount.textContent = value;
    }

    reset() {
        this.numRight = this.numWrong = 0;
    }
}
MathRaceScore.template = document.createElement('template');
MathRaceScore.template.innerHTML = `
<style>
    :host {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
    }
</style>
<div>
    <span class="rightCount">0</span> Right
</div>
<div>
    <span class="wrongCount">0</span> Wrong
</div>
`;

window.customElements.define('x-mathrace-score', MathRaceScore);

/***********************************************
    MathRace
 ***********************************************/

class MathRace extends HTMLElement {
    /** @type MathRaceTrack */
    #track;
    /** @type MathRaceProblem **/
    #problem;
    /** @type MathRaceProblemTimer */
    #problemTimer;
    /** @type MathRaceScore */
    #score;
    /** @type HTMLDialogElement */
    #dialog;
    #brokeDownContainer;
    #breakDownCounter = 0;
    #answeredWrong = false;
    #animationInterval;
    #isBrokenDown = false;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathRace.template.content.cloneNode(true));

        this.#track = this.shadowRoot.querySelector('x-mathrace-track');
        this.#problem = this.shadowRoot.querySelector('x-mathrace-problem');
        this.#problemTimer = this.shadowRoot.querySelector('x-mathrace-problemtimer');
        this.#score = this.shadowRoot.querySelector('x-mathrace-score');
        this.#dialog = this.shadowRoot.querySelector('dialog');
        this.#brokeDownContainer = this.shadowRoot.querySelector('.brokeDownContainer');

        this.#track.addEventListener('game_over', this.#onGameOver.bind(this));
        this.#problem.addEventListener('answered_correctly', this.#onCorrectAnswer.bind(this));
        this.#problem.addEventListener('answered_incorrectly', this.#onIncorrectAnswer.bind(this));
        this.#problemTimer.addEventListener('times_up', this.#onTimesUp.bind(this))
        this.#dialog.addEventListener('close', this.#onDialogClose.bind(this));
    }

    connectedCallback() {
        this.#startNewGame();
    }

    #startNewGame() {
        this.#startNewProblem();
        this.#track.init();
        this.#score.reset();
        this.#animationInterval = setInterval(() => this.#track.advanceCpu(), 250);
    }

    #startNewProblem() {
        this.#problem.createNewProblem();
        this.#problemTimer.restart();
        this.#answeredWrong = false;
    }

    #onGameOver(event) {
        if (this.#animationInterval) {
            clearInterval(this.#animationInterval);
            this.#animationInterval = null;
        }
        this.#problemTimer.stop();
        this.#dialog.querySelector('.dialogMessage').textContent = `${event.detail.winner} Wins!`;
        this.#dialog.showModal();
    }

    #onCorrectAnswer() {
        if (this.#isBrokenDown) {
            return;
        }

        if (this.#answeredWrong) {
            this.#answeredWrong = false;
        } else {
            this.#score.numRight++;
        }

        this.#startNewProblem();
        this.#track.advancePlayer();
    }

    #onIncorrectAnswer() {
        if (this.#isBrokenDown) {
            return;
        }

        this.#problem.clearAnswer();

        if (!this.#answeredWrong) {
            this.#answeredWrong = true;
            this.#score.numWrong++;
        }

        this.#breakDownCounter++;
        if (this.#breakDownCounter === 3) {
            this.#breakDown();
            this.#breakDownCounter = 0;
        }
    }

    #onTimesUp() {
        this.#startNewProblem();
    }

    #breakDown() {
        this.#isBrokenDown = true;
        this.#brokeDownContainer.style.visibility = 'visible';
        this.#problemTimer.stop();
        setTimeout(() => {
            this.#brokeDownContainer.style.visibility = 'hidden';
            this.#isBrokenDown = false;
            this.#startNewProblem();
        }, 3000);
    }

    #onDialogClose() {
        this.#startNewGame();
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
        padding: 10px 20px;
    }
    .tvStand {
        background-color: #555;
        width: 20px;
        height: 80px;
    }
    x-mathrace-score {
        margin-bottom: 15px;
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
            <x-mathrace-score></x-mathrace-score>
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


