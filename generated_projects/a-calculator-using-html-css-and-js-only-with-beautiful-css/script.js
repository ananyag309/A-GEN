/**
 * Simple Calculator Logic
 * ----------------------
 * This script provides the interactive behaviour for the calculator UI
 * defined in index.html. It implements basic arithmetic operations and
 * manages user input via button click events.
 */

// ----- Arithmetic Functions -----
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    // Guard against division by zero – return Infinity (JS default) or a custom message.
    if (b === 0) {
        alert('Error: Division by zero');
        return NaN;
    }
    return a / b;
}

/**
 * Perform a calculation based on the supplied operator.
 * @param {number} a
 * @param {number} b
 * @param {string} op One of '+', '-', '*', '/'
 * @returns {number}
 */
function calculate(a, b, op) {
    switch (op) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            return b; // If no operator, just return the second operand.
    }
}

// ----- State Variables -----
let displayElement = document.querySelector('.display');
let firstOperand = null;   // Stores the first number entered before an operator.
let secondOperand = null;  // Stores the second number (current display value).
let currentOperator = null; // Stores the operator button that was pressed.
let shouldResetDisplay = false; // Flag to clear display on next numeric input.

/**
 * Update the calculator display.
 * @param {string} value
 */
function updateDisplay(value) {
    displayElement.value = value;
}

/**
 * Reset the calculator to its initial state.
 */
function clearAll() {
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    shouldResetDisplay = false;
    updateDisplay('');
}

/**
 * Handle numeric and decimal button clicks.
 * @param {string} value
 */
function handleNumber(value) {
    if (shouldResetDisplay) {
        // Start a new number after an operator or after a result.
        updateDisplay('');
        shouldResetDisplay = false;
    }
    // Prevent multiple leading zeros.
    if (displayElement.value === '0' && value === '0') return;
    // Prevent multiple decimal points.
    if (value === '.' && displayElement.value.includes('.')) return;
    updateDisplay(displayElement.value + value);
}

/**
 * Handle operator button clicks.
 * @param {string} op
 */
function handleOperator(op) {
    if (displayElement.value === '' && firstOperand === null) {
        // No number entered yet – ignore.
        return;
    }
    if (firstOperand === null) {
        firstOperand = parseFloat(displayElement.value);
    } else if (!shouldResetDisplay) {
        // Chain calculations: compute previous pending operation first.
        secondOperand = parseFloat(displayElement.value);
        const result = calculate(firstOperand, secondOperand, currentOperator);
        firstOperand = result;
        updateDisplay(String(result));
    }
    currentOperator = op;
    shouldResetDisplay = true;
}

/**
 * Handle the equals button click.
 */
function handleEquals() {
    if (currentOperator === null || firstOperand === null) return;
    secondOperand = parseFloat(displayElement.value);
    const result = calculate(firstOperand, secondOperand, currentOperator);
    updateDisplay(String(result));
    // Reset state so a new calculation can start.
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    shouldResetDisplay = true;
}

/**
 * Initialise event listeners for all calculator buttons.
 */
function initCalculator() {
    const buttons = document.querySelectorAll('.calc-button');
    buttons.forEach(button => {
        const value = button.dataset.value;
        button.addEventListener('click', () => {
            if (button.classList.contains('operator')) {
                handleOperator(value);
            } else if (button.classList.contains('equals')) {
                handleEquals();
            } else if (button.classList.contains('clear')) {
                clearAll();
            } else {
                // Numeric or decimal button
                handleNumber(value);
            }
        });
    });
}

// Initialise the calculator once the DOM is fully loaded.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
} else {
    initCalculator();
}
