/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Meteor */

var Chats = new Meteor.Collection("chats");

// from http://stephenwalther.com/archive/2013/03/18/an-introduction-to-meteor.aspx
Meteor.methods({
    addChat: function (newChat) {
        // Perform form validation
        if (newChat.text.length === 0) {
            throw new Meteor.Error(413, "Missing text!");
        }

        newChat.when = new Date();

        // Insert movie (simulate on client, do it on server)
        return Chats.insert(newChat);
    }
});