const addBtn = document.getElementById('addBtn');
//const myId = document.getElementById('myId').value;
const myName = document.getElementById('myUsername').value;
const myImage = document.getElementById('myImage').value;
const myStatus = document.getElementById('myStatus').value;

const friendId = document.getElementById('friendId').value;
const friendName = document.getElementById('friendUsername').value;
const friendImage = document.getElementById('friendImage').value;
const friendStatus = document.getElementById('friendStatus').value;

addBtn.onclick = (e) => {
    e.preventDefault();
    socket.emit('sendFriendRequest', {
        myId, myName, myImage, myStatus, friendId, friendName, friendImage, friendStatus
    });
}

socket.on('requestSent', () => {
    addBtn.remove();
    document.getElementById('friendRequestForm').innerHTML += 
     `
     <div class="d-flex flex-column align-items-center py-2">
            <button type="submit" class="btn btn-danger btn-circle btn-xl d-flex justify-content-center" formaction="/friend/cancel"> 
                 <img src="/icons/cross.png" width="35px" height="35px">
            </button>

            <strong class="text-primary font-weight-bold">Cancel Request</strong>
    </div>
     `;
})