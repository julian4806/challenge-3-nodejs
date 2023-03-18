
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
// const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const usernameDisplay = document.getElementById('display-username')

const socket = io();
// Get username and room from URL

const paramUsername = getURLparam('username')
const paramRoom = getURLparam('room')
getURLparam(null)
if (!paramUsername) {
  window.location.href = '/'
}

if (paramUsername) {
  usernameDisplay.innerText = paramUsername || `${localStorage.getItem('username')}`
  socket.emit('joinRoom', paramUsername);
}


// Message from server
socket.on('message', message => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('user-count', (obj) => {
  console.log('')
  for (const [key, value] of Object.entries(obj)) {
    console.log(`${key}: ${value}`);
  }
  console.log('')
})

let previousSelectedRoom = ''
socket.on('join-room-change-color', (room) => {
  const joinedRoom = document.querySelector(`[data-room='${room}']`)
  if (previousSelectedRoom === '') previousSelectedRoom = joinedRoom
  if (joinedRoom !== previousSelectedRoom) {
    previousSelectedRoom.classList.remove("bg-selected-group")
    previousSelectedRoom = document.querySelector(`[data-room='${room}']`)
  }
  joinedRoom.classList.add("bg-selected-group")
})

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  if (paramUsername === message.username) {
    // YOU
    chatMessages.innerHTML +=
      `
      <div class="message self-end bg-nickname-button w-[70%] p-6 rounded-t-2xl rounded-bl-2xl">
      <div>
          <span class="text-lg text-white">You</span>&nbsp;<span class="text-sm text-background-light">said @ ${message.time}</span>
      </div>
      <span class="text-white">${message.text}</span>
  </div>
  `
  } else {
    chatMessages.innerHTML +=
      `
      <div class="message h-auto bg-rooms-button-dark w-[70%] p-6 rounded-t-2xl rounded-br-2xl">
      <div>
          <span class="text-lg text-white">${message.username}</span>&nbsp;<span class="text-sm text-background-light">said @ ${message.time}</span>
      </div>
      <span class="text-white">${message.text}</span>
  </div>
  `
  }
}

document.addEventListener('click', (e) => {
  const room = e.target.id
  if (room === "room") {
    const roomName = e.target.dataset.room
    socket.emit('joinRoom', paramUsername, roomName);
    localStorage.setItem('username', paramUsername)
    localStorage.setItem('current-room', roomName)
    window.history.pushState({}, document.title, "/" + "chat.html");
  }
})


// Add room name to DOM
// function outputRoomName(room) {
//   roomName.innerText = room;
// }



// helper functions
function getURLparam(parameter) {
  if (parameter === null) {
    console.log(true)
  }


  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const param = urlParams.get(parameter)
  return param
}

function signOut() {
  localStorage.clear()
  window.location.href = "/";
}

socket.on('available-rooms', (rooms) => {
  const availableRoomsList = document.getElementById('available-rooms')
  availableRoomsList.innerHTML = ''
  rooms.forEach(room => {
    availableRoomsList.innerHTML +=
      `
    <div class="item flex justify-between px-5 py-2 rounded-l-xl rounded-tr-xl w-[80%]
    hover:bg-hover-group
    " id="room" data-room="${room}">
      <div class="w-full flex flex-col pointer-events-none">
        <span class="text-lg text-white">${room}</span>
        <span class="text-xs text-rooms-button-dark">Hay! What you looking at?</span>
      </div>
      <div class="w-1/4 flex">
        <span>13</span>
        <i>@</i>
      </div>
    </div>
    `
  });
})