const socket = io()
let username = ''
let userList = []
let loginPage = document.querySelector("#loginPage")
let chatPage = document.querySelector("#chatPage")

let loginInput = document.querySelector('#loginInput')
let textInput = document.querySelector('#chatInput')


loginPage.style.display = 'flex'
loginPage.style.chatPage = 'none'

loginInput.addEventListener('keyup', (e) => {

    console.log(loginInput.value)
    console.log(e.keyCode)
    if (e.keyCode === 13) {
        let nome = loginInput.value.trim()
        if (nome) {
            username = nome
            document.title = `Chat ${nome}`
            socket.emit('join-request', username)
        }
        loginPage.style.display = 'none'
        loginPage.style.chatPage = 'flex'

    }
}
)
textInput.addEventListener('keyup', (e) => {

    if (e.keyCode === 13) {
        let text = textInput.value.trim()
        textInput.value = ''
        if (text) {
            socket.emit('send-msg', text)
        }
    }
}
)
socket.on('user-ok', (list) => {
    textInput.focus()
    userList = list
    remderUSerList()
    addMsg('status', null, 'Connectado')
})

function remderUSerList() {
    let ul = document.querySelector('.userList')
    ul.innerHTML = ``
    userList.forEach(element => {
        ul.innerHTML += `
        <li>${element}</li>
        `
    });

}

socket.on('list-update', (data) => {
    if (data.joinend) addMsg('status', null, `${data.joinend} entrou no chat`)
    if (data.left) addMsg('status', null, `${data.left}  saiu do chat`)

    userList = data.list
    remderUSerList()
})


function addMsg(type, user, msg) {
    let ul = document.querySelector('.chatList')
    if (type == 'status') {
        ul.innerHTML += `<li class="m-tatus">${msg}</li>`
    }
    if (type == 'msg') {
        ul.innerHTML += `<li class="mi">
            <span>${user}</span> 
            ${msg}
        </li>`
    }
}


socket.on('show-msg', (data) => {
    addMsg('msg', data.userName, data.msg)
})