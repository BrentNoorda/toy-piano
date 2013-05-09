/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Session, Template, Meteor, Chats, $, alert, tidy_spaces*/

var hide_chat_time; /* initialized from chat.less in the  Meteor.startup method */

Template.chat.chatter_row_count = 4;
Template.chat.chatter_full_height = null;   // will be calculated first time this is run

Session.set('new-chat','');
Session.set('new-chat-focus',false);


Template.chat.fade_in = function(_id) {
    //if ( -1 !== this.text.indexOf('alert') )
    //{
    //    alert ( 'render message "' + this.text + '"' );
    //}
    if ( this.localVersion )
    {
        return 'style="display:none;"';
    }
    else
    {
        Meteor.setTimeout(function() {
            $('#chat-'+_id).show(hide_chat_time,function(){
                $(this).animate({opacity:1},{duration:'slow',complete:function(){
                    $(this).removeClass('old-old-chat').addClass('new-old-chat');
                }});
            });
        },0);
        return '';
    }
};

Template.chat.submit_chat = function(tmpl)
{
	var newChat = { localVersion:true, text: Session.get('new-chat'), username: Session.get('username') };
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
    //return ( !Session.get('new-chat-focus') && (Session.get('new-chat').length === 0) ) ? 'class="hidden"' : '';
    if ( !Session.get('new-chat-focus') && Session.get('new-chat').length === 0 )
    {
        Meteor.setTimeout(function(){
            $('#new-chat-submit-div').animate({height:0},{duration:hide_chat_time});
        },0);
        return '';
    }
    else
    {
        return '';
    }
};
Template.chat.newchat = function () {
    return Session.get('new-chat');
};
Template.chat.new_chat_class = function () {
    if ( Template.chat.chatter_full_height === null )
    {
        // have not figure out full height yet, so do nothing special
        return '';
    }
    var full_size = true;
    if ( !Session.get('new-chat-focus') )
    {
        if ( Session.get('new-chat').length === 0 )
        {
            full_size = false;
        }
    }
    if ( full_size )
    {
        Meteor.setTimeout(function(){$('#new-chat').height( Template.chat.chatter_full_height );},0);
        return '';
    }
    else
    {
        Meteor.setTimeout(function(){$('#new-chat').height( Template.chat.chatter_full_height / Template.chat.chatter_row_count );},0);
        //$('#new-chat').height( Template.chat.chatter_full_height / Template.chat.chatter_row_count );
        return 'edit-chat-shrinker';
    }
};

Template.chat.events({
    'focus #new-chat': function (e,tmpl) {
        tmpl.submit_mousedown_clicked = false;
        Session.set('new-chat-focus',true);
        tmpl.find('#new-chat').value = Session.get('new-chat');
    },
    'blur #new-chat': function (e,tmpl) {
        Session.set('new-chat',tidy_spaces(tmpl.find('#new-chat').value));
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
        Session.set('new-chat',tidy_spaces(tmpl.find('#new-chat').value));
    },
    'mousedown #new-chat-submit': function(e, tmpl) { // hack to prevent blur from preventing submit
        //e.stopPropagation();
        tmpl.submit_mousedown_clicked = true;
    },
    'submit #chat-form': function (e, tmpl) {
        tmpl.submit_mousedown_clicked = false; // reset in case it was set
        // Don't postback
        e.preventDefault();
        if ( Session.get('new-chat').length !== 0 )
        {
            Template.chat.submit_chat(tmpl);
        }
    }
});

Template.chat.chats = function () {
    return Chats.find({}, {sort: {when:-1} } );
};

Meteor.startup(function () {
    var el, elObj;
    Template.chat.chatter_full_height = $('#new-chat').height();
    $('#new-chat').height( Template.chat.chatter_full_height / Template.chat.chatter_row_count );
    $('#new-chat-submit-div').height(0);

    // load globals from chat.less
    hide_chat_time = $('#hide-chat-time-global').width();
});
