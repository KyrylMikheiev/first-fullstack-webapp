/* ToDOs: 
- user stops typing the username, wait 1 second, find in database if the user with this nick already exists, response if it is unique
- as the client starts typing username, add "@" before the line. 
    - If he deletes everything delete the sign as well. 
    - And make is impossibel to erase
- password should contain all different chars and be at least length of 10 (password validation)

*/

const form = document.querySelector("form")
form.action = "/api" + window.location.pathname + window.location.search
const usernameElement = document.getElementById("username")

usernameElement.addEventListener("keydown", (e) => {
    if (e.key === "backspace" || e.key == "del") return
    if (e.target.value == 0) {
        e.target.value += "@"
    }
})