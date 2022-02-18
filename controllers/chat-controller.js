const messageModel = require('../models/message-model');
const chatModel = require('../models/chat-model');
const groupModel = require('../models/group-model');
const friendModel = require('../models/friend-model');
const userModel = require('../models/user-model');
const defaultGroupImg = 'group-chat.png';
const validatorResult = require('express-validator').validationResult;

exports.getChat = (req, res, next) => {
    let chatId = req.params.id;

    messageModel.get_messages(chatId, 'chat')
        .then(messages => {
            let membersData;
            return new Promise((resolve, reject) => {
                if (messages.length === 0) {
                    chatModel.get_chat_info(chatId)
                        .then(chat_info => {
                            membersData = chat_info.members;
                            resolve({ membersData, messages });
                        });
                } else {
                    membersData = messages[0].chatId.members;
                    resolve({ membersData, messages });
                }
            })
        })
        .then(data => {
            let messages = data.messages;
            let membersData = data.membersData;
            let chatData = membersData.find(member => String(member._id) !== req.session.userId);

            res.render('chat', {
                chatType: 'private',
                friendRequests: req.friendRequests,
                membersData: membersData,
                chatName: chatData.username,
                chatImage: chatData.image,
                messages: messages,
                chatId: chatId,
                userName: req.session.userName,
                userEmail: req.session.userEmail,
                userImage: req.session.userImage,
                userId: req.session.userId,
                pageTitle: chatData.username,
            });
        })
        .catch(err => {
            console.log('chat controller - getchat : ', err);
            res.redirect('/error');
        });
}

exports.saveMessage = (req, res, next) => {
    let data = req.body;
    if (req.body.contentType === 'file')
        data.content = req.file.filename;

    messageModel.save_message(data)
        .then(() => {
            res.json(data);
        })
        .catch(err => {
            console.log('chat model - sabe message: ', err);
        })
}

exports.getCreateGroup = (req, res, next) => {
    friendModel.get_friends(req.session.userId)
        .then(friends => {
            res.render('create-group', {
                friendRequests: req.friendRequests,
                friends: friends,
                userName: req.session.userName,
                userEmail: req.session.userEmail,
                userImage: req.session.userImage,
                userId: req.session.userId,
                pageTitle: 'Create Group',
                validateInput: req.flash('createGroupError')[0]
            })
        });
}

exports.createGroup = (req, res, next) => {
    if (validatorResult(req).isEmpty()) {
        let image = defaultGroupImg;
        if (req.file !== undefined)
            image = req.file.filename;

        groupModel.create_new_group(req.body, image)
            .then(groupID => {
                userModel.update_user_group_list(req.body.IDs, groupID);
            })
            .then(() => {
                res.redirect('/');
            })
            .catch(err => console.log('chat controller create group: ', err));
    }else{
        req.flash('createGroupError', validatorResult(req).array());
        console.log(validatorResult(req).array())
        res.redirect(req.originalUrl);
    }
}

exports.getGroupList = (req, res, next) => {
    let myId = req.session.userId;
    userModel.get_group_list(myId)
        .then(IDsList => {
            groupModel.get_groups(IDsList)
                .then(groups => {
                    res.render('group', {
                        groups: groups,
                        friendRequests: req.friendRequests,
                        userName: req.session.userName,
                        userEmail: req.session.userEmail,
                        userImage: req.session.userImage,
                        userId: req.session.userId,
                        pageTitle: 'Groups',

                    })
                });
        })
}

exports.getGroupMessages = (req, res, next) => {
    let groupID = req.params.id;
    messageModel.get_messages(groupID, 'group')
        .then(messages => {
            return new Promise((resolve, reject) => {
                if (messages.length === 0) {
                    groupModel.get_group_info(groupID)
                        .then(info => {
                            let group_info = info;
                            resolve({ group_info, messages });
                        });
                } else {
                    console.log(messages)
                    let group_info = {
                        members: messages[0].chatId.members,
                        name: messages[0].chatId.name,
                        image: messages[0].chatId.image
                    }
                    resolve({ group_info, messages });
                }
            })
        })
        .then(data => {
            let group_info = data.group_info;
            let messages = data.messages;
            res.render('chat', {
                chatType: 'group',
                friendRequests: req.friendRequests,
                membersData: group_info.members,
                chatName: group_info.name,
                chatImage: group_info.image,
                messages: messages,
                chatId: groupID,
                userName: req.session.userName,
                userEmail: req.session.userEmail,
                userImage: req.session.userImage,
                userId: req.session.userId,
                pageTitle: group_info.name,
            })
        })
}