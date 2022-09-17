
const mathPracticeTemplate = document.createElement('template');
mathPracticeTemplate.innerHTML = `
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

class MathPractice extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(mathPracticeTemplate.content.cloneNode(true));

        this.operand1 = this.shadowRoot.querySelector('.operand1');
        this.operand2 = this.shadowRoot.querySelector('.operand2');
        this.form = this.shadowRoot.querySelector('form');
        this.answerInput = this.shadowRoot.querySelector('.answerInput');
    }

    connectedCallback() {
        this.createNewProblem();
        this.form.addEventListener('submit', this.onFormSubmit.bind(this))
    }

    onFormSubmit(event) {
        event.preventDefault();

        if (this.isAnswerCorrect()) {
            alert('Correct!');
            this.createNewProblem();
        } else {
            alert('Wrong!');
        }
    }

    createNewProblem() {
        this.op1 = this.generateRandomOperand();
        this.op2 = this.generateRandomOperand();
        this.answer = '';
    }

    generateRandomOperand() {
        return Math.floor(Math.random() * 12 + 1);
    }

    get op1() {
        return parseInt(this.operand1.textContent, 10);
    }

    set op1(value) {
        this.operand1.textContent = value;
    }

    get op2() {
        return parseInt(this.operand2.textContent, 10);
    }

    set op2(value) {
        this.operand2.textContent = value;
    }

    get answer() {
        return parseInt(this.answerInput.value, 10);
    }

    set answer(value) {
        this.answerInput.value = value;
    }

    isAnswerCorrect() {
        return this.op1 * this.op2 === this.answer;
    }
}

window.customElements.define('x-math-practice', MathPractice);