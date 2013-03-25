/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Session, Template */

Template.body.username = function () {
    return Session.get('new-chat');
};
