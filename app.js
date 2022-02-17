const DB_URL = 'mongodb://localhost:27017/B-Chat';
const express = require('express');
const app = express();
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);

//Socket
const socketIO = require('socket.io');
const server = require('http').createServer(app);
const io = socketIO(server);

//Routers
const authRouter = require('./routes/auth-router');
const profileRouter = require('./routes/profile-router');
const friendRouter = require('./routes/friend-router');
const homeRouter = require('./routes/home-router');
const chatRouter = require('./routes/chat-router');
const searchRouter = require('./routes/search-router');

//Controllers
const friendReqs = require('./controllers/friend-controller').getFirst3FriendRequest;

const STORE = new SessionStore({
    uri: DB_URL,
    collection: 'sessions'
});


app.use(session({
    secret: 'tb tb tb tb sh7t m7t 5od fo2 w t7t __ D',
    resave: true,
    saveUninitialized: false,
    cookie: {
        //maxAge: 1*60*60*100
        expires: new Date(253402300000000)
    },
    store: STORE
}));


io.onlineUsers = {};
io.on("connection", socket => {
    require('./sockets/init-socket')(io, socket);
    require('./sockets/friend-socket')(io, socket);
    require('./sockets/chat-socket')(io, socket);
});

app.use(flash());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static('images'));
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(friendReqs); // Add friend reqs to req body
app.use(authRouter);
app.use('/', homeRouter);
app.use('/profile', profileRouter);
app.use('/friend', friendRouter);
app.use('/chat', chatRouter);
app.get('/search', searchRouter);

app.get('/error', (req, res, next) => {
    res.render('error', {
        userName: req.session.userName,
        userId: req.session.userId,
        userImage: req.session.userImage,
        pageTitle: 'Error',
        friendRequests: req.friendRequests
    });
});

app.use((req, res, next) => {

    res.render('page-not-found', {
        userName: req.session.userName,
        userId: req.session.userId,
        userImage: req.session.userImage,
        friendRequests: req.friendRequests,
        pageTitle: 'Page Not Found',
    });
});

server.listen(3000, () => {
    console.log('server started')
})