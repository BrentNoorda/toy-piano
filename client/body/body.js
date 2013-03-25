/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Template, Session*/

Template.body.username = function () {
    return Session.get('username');
};
