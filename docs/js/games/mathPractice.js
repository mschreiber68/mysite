
class MathPractice extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(MathPractice.template.content.cloneNode(true));

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
            this.createNewProblem();
        } else {
            alert('Wrong!');
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
        this.operator = MathPractice.OP_MULT;
    }
    
    createNewDivisionProblem() {
        const divisor = this.generateRandomNumber(10);
        const quotient = this.generateRandomNumber(10);
        this.op1 = divisor * quotient;
        this.op2 = divisor;
        this.operator = MathPractice.OP_DIV;
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
        if (this.operator === MathPractice.OP_MULT)
        {
            return this.op1 * this.op2 === this.answer;
        }
        
        return this.op1 / this.op2 === this.answer;
    }
}

MathPractice.OP_MULT = 'x';
MathPractice.OP_DIV = '÷';

MathPractice.template = document.createElement('template');
MathPractice.template.innerHTML = `
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

window.customElements.define('x-math-practice', MathPractice);