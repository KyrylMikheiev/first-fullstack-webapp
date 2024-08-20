const firstForm = document.getElementById("firstForm");
const submit = document.getElementById("submit");

const nameElement = document.getElementById("name");
const emailElement = document.getElementById("email");
// const passwordElement = document.getElementById("password");

const nameErrorElement = document.getElementById("name-error")
const emailErrorElement = document.getElementById("email-error")
// const passwordErrorElement = document.getElementById("password-error")

// const verificationForm = document.getElementById("verificationForm")
// verificationForm.style.display = "none"

firstForm.addEventListener("submit", (e) => {

    const name = nameElement.value;
    const email = emailElement.value;
    // const password = passwordElement.value;

    if (name == '') {
        nameErrorElement.innerText= "Type your name"
        nameElement.style.border = "5px solid red"
        e.preventDefault();
    } else {
        nameElement.style.border = "5px solid green"
        nameErrorElement.innerText= ""
    }
    if (email == '') {
        emailElement.style.border = "5px solid red"
        emailErrorElement.innerText= "Type your Email"
        e.preventDefault();
    }  else {
        emailErrorElement.innerText= ""
        emailElement.style.border = "5px solid green"
    }
    // if (password.length < 10) {
    //     passwordErrorElement.innerText= "The password should be longer than 10 characters"
    //     passwordElement.style.border = "5px solid red"
    //     e.preventDefault();
    // } else {
    //     passwordErrorElement.innerText= ""
    //     passwordElement.style.border = "5px solid green"
    // }
})


// const example = () => {
//     fetch("http://localhost:4000/api/dashboard", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             name: nameElement.value,
//             email: emailElement.value,
//             password: passwordElement.value
//         })
//     })
// }
// firstForm.addEventListener("submit", example)
// async function get(e) {
//     // e.preventDefault()

//     const response = await fetch("http://localhost:4000/verification", {
//         method: "POST",
//     })
//     responseElement.innerText = await response.text()
// }