const socket = io();
const inboxPeople = document.querySelector(".inbox__people");


let userName = "";
let id;
const newUserConnected = function (data) {
    

    //give the user a random unique id
    id = Math.floor(Math.random() * 1000000);
    userName = 'user-' +id;
    //console.log(typeof(userName));   
    

    //emit an event with the user id
    socket.emit("new user", userName);
    //call
    addToUsersBox(userName);
};

const addToUsersBox = function (userName) {
    if (!!document.querySelector(`.${userName}-userlist`)) {
        return;
    
    }
    const userBox = `
    <div class="chat_id ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
    inboxPeople.innerHTML += userBox;
};

newUserConnected();

socket.on("new user", function (data) {
  data.map(function (user) {
          return addToUsersBox(user);
      });
});

socket.on("user disconnected", function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();
});


const inputField = document.querySelector(".form-control");
const messageForm = document.querySelector(".chat-message");
const messageBox = document.querySelector(".chat-history");

const addNewMessage = ({ user, message }) => {
  const time = new Date();
  const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

  const receivedMsg = `
  <div class="incoming__message">
    <div class="received__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="message__author">${user}</span>
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

  const myMsg = `
  <div class="outgoing__message">
    <div class="sent__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

  //is the message sent or received
  messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
};

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputField.value) {
    return;
  }

  socket.emit("chat message", {
    message: inputField.value,
    nick: userName,
  });

  inputField.value = "";
});

socket.on("chat message", function (data) {
  addNewMessage({ user: data.nick, message: data.message });
});