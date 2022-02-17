const chatId = document.getElementById('chatId').value;
const senderName = document.getElementById('senderName').value;
const senderImage = document.getElementById('senderImage').value;
const messageField = document.getElementById('messageInputField');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const div = document.getElementById('chatContainer');
document.getElementById('attachImage').addEventListener("change", uploadImage, false);


socket.emit('joinChat', chatId);

function sendMessage() {
    let message = messageField.value;
    if (message.length === 0)
        return;
    socket.emit('sendMessage', {
        chatId: chatId,
        content: message,
        contentType: 'text',
        sender: myId,
        senderName: senderName,
        senderImage: senderImage,
    }, () => {
        messageField.value = '';
    })
}

sendMessageBtn.onclick = () => {
    sendMessage();
}

messageField.addEventListener('keyup', (event) => {
    event.preventDefault();
    if (event.keyCode == 13) {
        sendMessage();
    }
})

function uploadImage() {
    const file = this.files[0];
    const formData = new FormData();

    formData.append('chatId', chatId);
    formData.append('content', file);
    formData.append('contentType', 'file');
    formData.append('sender', myId);
    formData.append('senderName', senderName);
    formData.append('senderImage', senderImage);

    fetch('/chat/sendImage', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            socket.emit('sendMessage', data);
        })
}

socket.on('newMessage', data => {
    let sender = data.sender;
    let msg = data.content;
    let html = '';
    if (sender === myId) {

        html =
            `
        <div class="d-flex justify-content-between">
                <p class="small mb-1 text-muted">23 Jan 2:05 pm</p>
                <p class="small mb-1">${data.senderName}</p>
        </div>

        <div class="d-flex flex-row justify-content-end mb-4 pt-1">
                <div>
            `
        if (data.contentType === 'text') {
            console.log(data.contentType)
            html += `<p class="small p-2 me-3 mb-3 text-white rounded-3 bg-primary">${msg}</p>`
        } else {
            html += `<embed class="small p-2 me-3 mb-3 text-white rounded-3 " height="200" width="auto" src="/chat/${msg}">`
        }
        html += `
                </div>
                <img src="/profile/${data.senderImage}" alt="${data.senderName}"
                class="rounded-circle" style="width: 45px; height: 45px; object-fit: cover; object-position: 0 25%;">
        </div>
        `;
    } else {
        html =
            `
        <div class="d-flex justify-content-between">
            <p class="small mb-1">${data.senderName}</p>
            <p class="small mb-1 text-muted">23 Jan 2:00 pm</p>
        </div>

        <div class="d-flex flex-row justify-content-start">
            <img src="/profile/${data.senderImage}" alt="${data.senderName}"
            class="rounded-circle" style="width: 45px; height: 45px; object-fit: cover; object-position: 0 25%;">
            <div>
            `
        if (data.contentType === 'text') {
            html += `<p class="small p-2 me-3 mb-3 text-white rounded-3 bg-primary">${msg}</p>`
        } else {
            html += `<embed class="small p-2 me-3 mb-3 text-white rounded-3 " height="200" width="auto" src="/chat/${msg}">`
        }
        html +=
            `
            </div>
        </div>
        `
    }
    div.innerHTML += html;
    div.scrollTop = div.scrollHeight;
})