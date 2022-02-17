socket.emit('getOnlineFriends', myId);

socket.on('onlineFriends', friends => {
    let div = document.getElementById('onlineUserCard');
    if(friends.length === 0){
        div.innerHTML = 
        `
            <div class="alert alert-warning d-flex align-items-center py-2 justify-content-center"> No Online Friends </div>
        `
    } else {
        let html=``;

        for(let friend of friends){
            html += 
            `
            <div class="card rounded d-flex align-items-start my-3 mx-3 col-sm-8 col-md-6 col-lg-4 col-xl-4">
        
            <div class="card-body d-flex  align-items-center py-2 justify-content-center">
                
                <img src="/profile/${friend.image}" width="120px" height="120px" class="mr-3 rounded-circle" >
    
                <div>
                    <h4 class="card-title">
                        <a href="/profile/${friend.id}" class="text-decoration-none text-reset">
                        <span style="color: green">●</span>
                            ${friend.name}
                        </a>
                    </h4>

                    <p class="card-text">${friend.status}</p>
                    <a href="/chat/${friend.chatId}" class="btn btn-primary d-flex column justify-content-center w-75">Chat</a>
                </div>
            </div>
        </div>

            `
        }
        div.innerHTML = html;
    }
})

/*
    
            
            

*/