/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Session, Template, Meteor, Chats, $, alert */

Template.body.username = function () {
    return Session.get('new-chat');
};
