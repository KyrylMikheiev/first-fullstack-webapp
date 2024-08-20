const id = document.getElementById("id")
const userName = document.getElementById("name")
const email = document.getElementById("email")
const dialogElement = document.querySelector("dialog")
const openDeleteMenu = document.getElementById("openDeleteMenu")
const deleteButton = document.getElementById("deleteButton") 
const cancelButton = document.getElementById("cancelButton")
const url = `http://localhost:4000/api${window.location.pathname}`

fetch(url)
    .then(response => response.json())
    .then(data => {
        id.innerHTML = data._id
        userName.innerText = data.name
        email.innerHTML = data.email
    })
    .catch(error => console.log(error))

openDeleteMenu.addEventListener("click", () => {
    dialogElement.showModal()
})

cancelButton.addEventListener("click", () => {
    dialogElement.close()
})

// deleteButton.addEventListener("click", async (e) => {
//     await fetch(url, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//         .then(res => console.log(res))
//     // window.location.href = "http://localhost:4000/dashboard"
// })

function deleteUser() {

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Successfully deleted") {
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            alert('Failed to delete user.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the user.');
    });
}