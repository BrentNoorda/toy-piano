/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Template, Session, $, Meteor, set_username*/

Session.set('entering-username',false);
Session.set('self-latency',false);

Template.body.username = function () {
    return Session.get('username');
};

Template.body.display_username_visibility = function () {
    return ( Session.get('entering-username') ) ? 'class="hidden"' : '';
};

Template.body.enter_username_visibility = function () {
    return ( !Session.get('entering-username') ) ? 'class="hidden"' : '';
};

Template.body.self_latency = function () {
    return ( Session.get('self-latency') ) ? 'checked="checked"' : '';
};

Template.body.events({
    'blur #enter-username': function (e,tmpl) {
        set_username(tmpl.find('#enter-username').value);
        tmpl.find('#enter-username').value = Session.get('username');
        Session.set('entering-username',false);
    },
    'click #display-username': function (e,tmpl) {
        Session.set('entering-username',true);
        Meteor.setTimeout(function(){$('#enter-username').focus();},0);
    },
    'click #self-latency': function (e,tmpl) {
        Session.set('self-latency',!Session.get('self-latency'));
    }
});

