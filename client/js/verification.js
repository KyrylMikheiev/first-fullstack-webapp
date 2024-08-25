/* 
ToDos:
- get the verification code user typed after clicking submit
- send to backend
- there should be proved it, if it is right
- get the response and display the next page/say the code is wrong
*/
const input1 = document.getElementById("input1")
const input2 = document.getElementById("input2")
const input3 = document.getElementById("input3")
const input4 = document.getElementById("input4")
const input5 = document.getElementById("input5")
const input6 = document.getElementById("input6")

const inputElements = [input1, input2, input3, input4, input5, input6]

const inputs = document.getElementById("inputs");
 
inputs.addEventListener("input", function (e) {
    const target = e.target;
    const val = target.value;
 
    if (isNaN(val)) {
        target.value = "";
        return;
    }
 
    if (val != "") {
        const next = target.nextElementSibling;
        if (next) {
            next.focus();
        }
    }
});
 
inputs.addEventListener("keydown", function (e) {
    const target = e.target;
    const key = e.key.toLowerCase();
 
    if (key == "backspace" || key == "delete") {
        target.value = "";
        const prev = target.previousElementSibling;
        if (prev) {
            prev.focus();
        }
        return;
    }
});

inputs.addEventListener("paste", function (e) {
    const pasteData = e.clipboardData.getData('text');
    if (pasteData.length === 6 && !isNaN(pasteData)) {
        const inputElements = inputs.querySelectorAll("input");
        inputElements.forEach((input, index) => {
            input.value = pasteData[index] || '';
        });
        inputElements[5].focus();  // Move focus to the last input after pasting
    }
    e.preventDefault();  // Prevent the default paste behavior
});

const form = document.querySelector("form") 
form.action = "/api" + window.location.pathname + window.location.search 

// form.addEventListener("submit", async () => {
//     let userInputCode = ""
//     inputElements.forEach(input => {
//         userInputCode += input.value
//     })
//     console.log(userInputCode)

//     await fetch("", {
//         method: "POSt",
//         headers: {

//         }
//     })
// })


// function handleClick() {
// } 