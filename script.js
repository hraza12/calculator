// Get the display element
const display = document.getElementById('display');

// Variables to store values and operations
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;

// Function to update the display
function updateDisplay() {
    display.textContent = currentInput;
}

// Initialize current input
let currentInput = '0';
updateDisplay();

// Function to input digits
function inputDigit(digit) {
    if (waitingForSecondOperand) {
        currentInput = digit;
        waitingForSecondOperand = false;
    } else {
        // If current input is '0', replace it, otherwise append
        currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
    updateDisplay();
}

// Function to input decimal
function inputDecimal() {
    // If we're waiting for the second operand, start with '0.'
    if (waitingForSecondOperand) {
        currentInput = '0.';
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }
    
    // Only add decimal if there isn't one already
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

// Function to handle operators
function handleOperator(nextOperator) {
    // Convert current input string to number
    const inputValue = parseFloat(currentInput);
    
    // If there's a pending operation and we're waiting for a second operand
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }
    
    // If this is the first operand
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        // Perform the calculation with the existing operator
        const result = performCalculation();
        currentInput = String(result);
        firstOperand = result;
    }
    
    waitingForSecondOperand = true;
    operator = nextOperator;
    updateDisplay();
}

// Function to perform the actual calculation
function performCalculation() {
    const secondOperand = parseFloat(currentInput);
    
    if (isNaN(secondOperand)) return;
    
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '×':
            return firstOperand * secondOperand;
        case '÷':
            if (secondOperand === 0) {
                alert('Cannot divide by zero');
                resetCalculator();
                return 0;
            }
            return firstOperand / secondOperand;
        case '%':
            return firstOperand % secondOperand;
        default:
            return secondOperand;
    }
}

// Function to reset the calculator
function resetCalculator() {
    currentInput = '0';
    firstOperand = null;
    waitingForSecondOperand = false;
    operator = null;
    updateDisplay();
}

// Function to handle backspace
function handleBackspace() {
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Add event listeners for number buttons
document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        if (button.id === 'decimal') {
            inputDecimal();
        } else {
            const digit = button.textContent;
            inputDigit(digit);
        }
    });
});

// Add event listeners for operator buttons
document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        if (button.id === 'backspace') {
            handleBackspace();
        } else if (button.id === 'percent') {
            handleOperator('%');
        } else {
            handleOperator(button.textContent);
        }
    });
});

// Add event listener for equals button
document.getElementById('equals').addEventListener('click', () => {
    if (!operator || waitingForSecondOperand) return;
    
    const result = performCalculation();
    currentInput = String(result);
    firstOperand = result;
    waitingForSecondOperand = false;
    operator = null;
    updateDisplay();
});

// Add event listener for clear button
document.getElementById('clear').addEventListener('click', resetCalculator);

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Handle numbers
    if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        inputDigit(key);
    }
    
    // Handle operators
    switch (key) {
        case '+':
        case '-':
            event.preventDefault();
            handleOperator(key);
            break;
        case '*':
            event.preventDefault();
            handleOperator('×');
            break;
        case '/':
            event.preventDefault();
            handleOperator('÷');
            break;
        case '.':
        case ',':
            event.preventDefault();
            inputDecimal();
            break;
        case '=':
        case 'Enter':
            event.preventDefault();
            if (operator && !waitingForSecondOperand) {
                const result = performCalculation();
                currentInput = String(result);
                firstOperand = result;
                waitingForSecondOperand = false;
                operator = null;
                updateDisplay();
            }
            break;
        case 'Backspace':
            event.preventDefault();
            handleBackspace();
            break;
        case 'Escape':
            event.preventDefault();
            resetCalculator();
            break;
    }
});