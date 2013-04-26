/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Meteor, Keypokes:true*/

GET RID OF THIS COLLECTION AND DO WHAT'S IN ~/not_my_projects/meteor/packages/tinytest/tinytest_server.js

Keypokes = new Meteor.Collection("keypokes");

Meteor.methods({
    addKeypoke: function (newKeypoke) {
        // Perform form validation
        /*
        if (newChat.text.length === 0) {
            throw new Meteor.Error(413, "Missing text!");
        }
        if (newChat.username.length === 0) {
            throw new Meteor.Error(413, "Missing username!");
        }
        */

        newKeypoke.when = new Date();

        if (Meteor.isServer) {
            // only keep a limited number of keypokes, since they fade out in a few seconds anyway
            // so if it's more than 10 seconds old then remove it
            var too_old = new Date( newKeypoke.when.getTime() - 10000 );
            Keypokes.remove({when : {$lt : too_old }});
        }

        // Insert keypke (simulate on client, do it on server)
        return Keypokes.insert(newKeypoke);
    }
});