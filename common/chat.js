/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Meteor*/

var Chats = new Meteor.Collection("chats");

// from http://stephenwalther.com/archive/2013/03/18/an-introduction-to-meteor.aspx
Meteor.methods({
    addChat: function (newChat) {
        // Perform form validation
        if (newChat.text.length === 0) {
            throw new Meteor.Error(413, "Missing text!");
        }
        if (newChat.username.length === 0) {
            throw new Meteor.Error(413, "Missing username!");
        }

        newChat.when = new Date();

        if (Meteor.isServer) {
            // only keep a limited number of chats, and delete anything older
            // code borrowed from http://stackoverflow.com/questions/6383638/mongodb-delete-old-chat
            var oldestChats = Chats.find({},{
                skip: 10,
                sort: {when:-1}
            });
            oldestChats.forEach(function (chat) {
                Chats.remove(chat._id);
            });
            //Chats.remove({when : {$lt : oldest.time }});
        }

        // Insert movie (simulate on client, do it on server)
        return Chats.insert(newChat);
    }
});