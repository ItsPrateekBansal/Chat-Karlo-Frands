// const { userleave } = require("../../utils/users");

const socket = io();
const chatMessages = document.querySelector('.chat-messages');

const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById("room-name");
const userList = document.getElementById('users');
//
const { username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
})


//Message from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//get room and users
socket.on('roomUsers',({room, users}) => {
    roomName.innerText = room;
    outputUsers(users);
})

function outputUsers(users){
    userList.innerHTML=`
        ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}




socket.emit('joinRoom',{username,room})

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
		<p class="text">${message.text}</p>
    `;
    document.querySelector(`.chat-messages`).appendChild(div);
}

//Message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg = e.target.msg.value;
    socket.emit('chatMessage',msg);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})