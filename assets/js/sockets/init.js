const socket = io();
let friendRequestMenuButton = document.getElementById('friendRequestMenuBtn');
let myId = document.getElementById('userID').value;

socket.on('connect', ()=> {
    socket.emit('joinNotificationRoom', myId);
    socket.emit('goOnline', myId);
});

socket.on('newFriendRequest', data => {
    let friendRequestMenu = document.getElementById('friendRequestDDM');
    let newNotification = friendRequestMenuButton.querySelector('span');

    let menu = friendRequestMenu.innerHTML;
    friendRequestMenu.innerHTML =
    `
        <a class="dropdown-item" href="/profile/${data.id}">
             ${data.name}
        </a>
    `
    + menu;

    newNotification.innerText = "new";
});

friendRequestMenuButton.onclick = () => {
    let newNotification = friendRequestMenuButton.querySelector('span');
    newNotification.innerText = "";
}