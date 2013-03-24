/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Session, Template, Meteor, Chats, $, alert */

Session.set('new-chat','');
Session.set('new-chat-focus',false);

Template.chat.fade_in = function(_id) {
    Meteor.setTimeout(function() {
        /*$('#chat-'+_id).show('fast');*/
        $('#chat-'+_id).removeClass('old-old-chat').addClass('new-old-chat');
    },750);
    return '';
};

Template.chat.submit_chat = function(tmpl)
{
	var newChat = { text: Session.get('new-chat') };
    Session.set('new-chat','');

	Meteor.call(
	            "addChat",
	            newChat,
	            function (err, result) {
	                if (err) {
	                    alert("Could not add chat " + err.reason);
	                }
	            }
	       );
};

Template.chat.created = function() {
    this.submit_mousedown_clicked = false; // kludge to get new-chat blur to stop losing focus
};

Template.chat.button_state = function () {
    return ( Session.get('new-chat').length === 0 ) ? 'disabled="disabled"' : '';
};
Template.chat.button_visibility = function () {
    return ( !Session.get('new-chat-focus') && (Session.get('new-chat').length === 0) ) ? 'class="hidden"' : '';
};
Template.chat.newchat = function () {
    return Session.get('new-chat');
};
Template.chat.rowcount = function () {
    var ret = 4;
    if ( !Session.get('new-chat-focus') )
    {
        if ( Session.get('new-chat').length === 0 )
        {
            ret = 1;
        }
    }
    return ret;
};

Template.chat.events({
    'focus #new-chat': function (e,tmpl) {
        Session.set('new-chat-focus',true);
        tmpl.find('#new-chat').value = Session.get('new-chat');
    },
    'blur #new-chat': function (e,tmpl) {
        Session.set('new-chat',tmpl.find('#new-chat').value.replace(/^\s+|\s+$/g, ''));
        tmpl.find('#new-chat').value = Session.get('new-chat');
        Session.set('new-chat-focus',false);
        if ( tmpl.submit_mousedown_clicked )
        {
            // if there's something to submit, then submit it
            if ( Session.get('new-chat').length !== 0 )
            {
                Template.chat.submit_chat(tmpl);
            }
        }
    },
    'keyup #new-chat': function (e,tmpl) {
        Session.set('new-chat',tmpl.find('#new-chat').value.replace(/^\s+|\s+$/g, ''));
    },
    'mousedown #new-chat-submit': function(e, tmpl) { // hack to prevent blur from preventing submit
        //e.stopPropagation();
        tmpl.submit_mousedown_clicked = true;
    },
    'submit #chat-form': function (e, tmpl) {
        tmpl.submit_mousedown_clicked = false; // reset in case it was set
        // Don't postback
        e.preventDefault();
        Template.chat.submit_chat(tmpl);
    }
});

Template.chat.chats = function () {
    return Chats.find({}, {sort: {when:-1} } );
};
