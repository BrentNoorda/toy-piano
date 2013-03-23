Session.set('new-chat','');
Session.set('new-chat-focus',false);

Template.chat.button_state = function () {
    return ( Session.get('new-chat').length == 0 ) ? 'disabled="disabled"' : '';
}
Template.chat.button_visibility = function () {
    return ( !Session.get('new-chat-focus') && (Session.get('new-chat').length == 0) ) ? 'class="hidden"' : '';
}
Template.chat.newchat = function () {
    return Session.get('new-chat');
}
Template.chat.rowcount = function () {
    var ret = 4;
    if ( !Session.get('new-chat-focus') )
    {
        if ( Session.get('new-chat').length == 0 )
            ret = 1;
    }
    return ret;
}

Template.chat.events({
    'focus #new-chat': function () {
        Session.set('new-chat-focus',true);
        document.getElementById('new-chat').value = Session.get('new-chat');
    },
    'blur #new-chat': function () {
        Session.set('new-chat',document.getElementById('new-chat').value.replace(/^\s+|\s+$/g, ''));
        document.getElementById('new-chat').value = Session.get('new-chat');
        Session.set('new-chat-focus',false);
    },
    'keyup #new-chat': function () {
        Session.set('new-chat',document.getElementById('new-chat').value.replace(/^\s+|\s+$/g, ''));
    },
	'click #new-chat-submit': function(e) {
		e.stopPropagation();
        alert('clicked');
    },
    'submit #chat-form': function (e, tmpl) {
        // Don't postback
        e.preventDefault();
 		alert("no submit for you")
        return;

        // create the new movie
        var newMovie = {
            title: tmpl.find("#title").value,
            director: tmpl.find("#director").value
        };
 
        // add the movie to the db
        Movies.insert(newMovie);
    }
});
