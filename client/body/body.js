/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Template, Session, set_username*/

Template.body.username = function () {
    return Session.get('username');
};

Template.body.events({
    'blur #enter-username': function (e,tmpl) {
        set_username(tmpl.find('#enter-username').value);
        tmpl.find('#enter-username').value = Session.get('username');
    }
});

