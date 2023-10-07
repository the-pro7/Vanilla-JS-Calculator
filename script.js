"use strict";
const calculatorElement = document.querySelector("[data-calculator]")
const numbers = calculatorElement.querySelectorAll("[data-number]")
const operations = calculatorElement.querySelectorAll("[data-operation]")
const allClearButton = calculatorElement.querySelector("[data-all-clear]")
const deleteButton = calculatorElement.querySelector("[data-delete]")
const equalsButton = calculatorElement.querySelector("[data-equals]")
const output = calculatorElement.querySelector("[data-output]")
const previousOperandText = calculatorElement.querySelector("[data-previous]")
const currentOperandText = calculatorElement.querySelector("[data-current]")

class Calculator {
    constructor(currentOperandText, previousOperandText) {
        this.currentOperandText = currentOperandText
        this.previousOperandText = previousOperandText
        // Clear values when ever an instance of the calculator class is called
        this.clear()
    }

    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.previousOperandText.textContent = ''
        this.operation = null
    }

    // Delete current operand by removing the last character using the slice string method
    delete() {
        if (this.currentOperand === "") {
            return
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    // Method to append a number onto the calculator's updateDisplay
    // making sure that as many numbers as possible can be typed
    appendNumber(number) {
        // if there's already a decimal poin and the user is still clicking a point then just do nothing
        if (number === "." && this.currentOperand.includes("."))
            return
        if (this.overwrite) {
            this.currentOperand = number
            this.overwrite = false

        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString()
        }
    }

    // Method to select an operation to carry out the required mathematical calculation
    chooseOpertion(operation) {
        // When user mistakenly chooses the wrong operation and wants to overwrite it or change it
        if (this.previousOperand !== "" && this.operation) {
            this.operation = operation
        }
        // If there's no current operand then do nothing
        if (this.currentOperand === "")
            return
        // If there's already a previous value then calculate for the result
        if (this.previousOperand !== '') {
            this.evaluate()
        }
        

        // Set the operation to the operation chosen by the user
        this.operation = operation
        // Set the previous operand to the current operand since the user is going to add a new current operand
        this.previousOperand = this.currentOperand
        // Set the current operand to something falsy
        this.currentOperand = ''

    }

    // Method to include commas if  number if greater than 3 digits e.g 1000 => 1,000
    formatNumber(number) {
        // Turn the number into a string
        let stringNumber = number.toString()
        // to be able to split at where the decimal point is
        // the integerPart is the part that comes first in the array i.e. "44.2323" => ["44", "2323"], => 44
        let integerPart = parseFloat(stringNumber.split(".")[0])
        let decimalPart = stringNumber.split(".")[1]
        // Create a display for the integerPart
        let integerDisplay = '';
        // Check if the integerPart is not a number
        if (isNaN(integerPart)) {
            integerDisplay = ''
        } else {
            // Set the integerDisplay to a locale, in this case "en"
            integerDisplay = integerPart.toLocaleString("en", {
                maximumFractionDigits: 0
            })
        }

        // If there's a decimalPart then add a decimal point between the integerDisplay and the decimalPart
        if (decimalPart) {
            return `${integerDisplay}.${decimalPart}`

        } else {
            // If there's no d.p then return the integerDisplay as it is
            return integerDisplay
        }

    }

    // Method to compute values
    evaluate() {
        // Turn the "string" numbers into actual  numbers
        let integerCurrent = parseFloat(this.currentOperand)
        let integerPrevious = parseFloat(this.previousOperand)
        // Intialize a computedValue
        let computedValue = 0
        // If the current and previous operands are not numbers then do nothing
        if (isNaN(integerCurrent) || isNaN(integerPrevious))
            return

        // Perform the operation based on the mathematical symbol
        switch (this.operation) {
        case "+":
            computedValue = integerPrevious + integerCurrent
            break;
        case "-":
            computedValue = integerPrevious - integerCurrent
            break;
        case "*":
            computedValue = integerCurrent * integerPrevious
            break;
        case "/":
            computedValue = integerPrevious / integerCurrent
            break;
        default:
            return
        }

        // If the computedValue dies not contain decimals then return is as a whole number else round it to 3 d.p
        if (!computedValue.toString().includes(".")) {
            this.currentOperand = computedValue
        } else {
            this.currentOperand = computedValue.toFixed(3)
        }
        // set the previous operand to nothing and also the operation
        this.previousOperand = ''
        this.operation = ''
        this.overwrite = true
    }

    // This is the method that shows the user what they're doing
    updateDisplay() {
        this.currentOperandText.textContent = this.formatNumber(this.currentOperand)
        // While updating the display, if there is an operation, then concatenate it with the previous operand
        if (this.operation != null) {
            this.previousOperandText.textContent = `${this.formatNumber(this.previousOperand)} ${this.operation}`

        }
    }

}

// Call an instance of the calculator class and pass in the previous and current text elements
const calculator = new Calculator(currentOperandText,previousOperandText)

// Get the number elements and use their text contents as the argument to the appendNumber() method
// then update the display
numbers.forEach(number=>{
    number.addEventListener("click", ()=>{
        calculator.appendNumber(number.innerText)
        calculator.updateDisplay()
    }
    )
}
)

operations.forEach(operation=>{
    operation.addEventListener("click", ()=>{
        calculator.chooseOpertion(operation.innerText)
        calculator.updateDisplay()
    }
    )
}
)

allClearButton.addEventListener("click", ()=>{
    calculator.clear()
    calculator.updateDisplay()
    output.classList.add("animate")

    output.addEventListener("animationend", ()=>{
        console.log("animation ended")
        output.classList.remove("animate")
    }
    )
}
)

deleteButton.addEventListener("click", ()=>{
    calculator.delete()
    calculator.updateDisplay()
}
)

equalsButton.addEventListener("click", ()=>{
    calculator.evaluate()
    calculator.updateDisplay()
}
)

// Code to allow number appending via keyboard
document.addEventListener("keydown", (e)=>{
    let keyPressed = e.key
    let alphabetRegex = /[a-zA-Z]/
    if (keyPressed.match(alphabetRegex)) {
        console.log("yeah it's an alphabet")
        return
    } else {
        if (isNaN(keyPressed)) {
            return
        } else {
            calculator.appendNumber(keyPressed)
            calculator.updateDisplay()
        }
    }

}
)
