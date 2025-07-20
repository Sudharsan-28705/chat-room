const chat = document.querySelector('.message-field')
const socket = io();
const roomname = document.getElementById('room-name')
const users = document.getElementById('users')

const { username, room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true,
})

console.log( username, room)
socket.emit('joinRoom',{ username,room })

//room and user
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room),
    outputUsers(users)
})

//this catches every message 
socket.on('message', message => {
    printMessage(message);

    //Auto Scroll down
    chat.scrollTop = chat.scrollHeight
});

const chatmsg = document.getElementById('chat-form');

//used to get the message from forms
chatmsg.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('user-message', msg); //sending message to the server
    //to clear the input field
    e.target.elements.msg.value = '';
});

function printMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<div class='meta'>${message.username}  ${message.time}</div>
    <div class='text'> ${message.text} </div>`
    document.querySelector('.message-field').appendChild(div);
}

//function for displaying room name 
function outputRoomName(room){
    roomname.innerText = room;
}

function outputUsers(userList) {
    users.innerHTML = `<ul>${userList.map(user => `<li>${user.username}</li>`).join('')}</ul>`;
}

let darkmode = localStorage.getItem('darkmode');
const modeswitch = document.getElementById('toggle');
const body = document.body;

const enabledarkmode = () => {
  body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');
};

const disabledarkmode = () => {
  body.classList.remove('darkmode');
  localStorage.setItem('darkmode', 'inactive');
};

modeswitch.addEventListener('click', () => {
  darkmode = localStorage.getItem('darkmode');
  if (darkmode !== 'active') {
    enabledarkmode();
  } else {
    disabledarkmode();
  }
});
