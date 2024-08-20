const usersTableElement = document.getElementById("usersTable");
const userInfoElement = document.getElementById("userInfo");
const head = document.querySelector("thead");
const error = document.querySelector(".error");
const getUsersButton = document.getElementById("getUsers");
const hideUsers = document.getElementById("hideUsers");
const dialogElement = document.querySelector("dialog")
const deleteButtonDashboard = document.getElementById("deleteButtonDashboard")
const closeDialog = document.getElementById("closeDialog")
const userIdInput = document.getElementById("userIdInput")
const deleteButton = document.querySelector(".deleteButton")
const deleteForm = document.querySelector(".deleteForm")
const userIdError = document.getElementById("userIdError")

usersTableElement.style.display = "none"

hideUsers.addEventListener("click", (e) => {
    usersTableElement.style.display = "none"
    userInfoElement.innerHTML = ""

})

//ToDO: Dont show head of the table and say there are no users
getUsersButton.addEventListener("click", async () => {
    if (userInfoElement.innerHTML == "") {

        const users = await getUsers()
        // console.log(users)
        if (users) {
            
            console.log("No users lol")
            usersTableElement.innerHTML = "No Users"
            return;
        } 
        // console.log("there are some users?")
        usersTableElement.style.display = "block"
        const tableRows = document.querySelectorAll("[data-href]")
        tableRows.forEach(row => {
            row.addEventListener("click", () => {
                window.location.href += row.dataset.href
                console.log("clicked")
            })
        })
    } else {
        error.classList.add("show")
        error.innerHTML = "You already have users!"
        setTimeout(() => {
            error.classList.remove("show")
        }, 1500)	
    }
})
async function getUsers() {
    await fetch("http://localhost:4000/api/dashboard")
        .then((res) => res.json())
        .then((data) => {
            if (data.length !== 0) {
                data.map((user) => {
                    if (user._id) {
                        userInfoElement.innerHTML += `
                                <tr data-href="/@${user.name}">
                                    <td>${user._id}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                </tr>
                        `
                    } 
                })
            } else {
                // console.log("get users false")
                return false
            }
        })
}
   