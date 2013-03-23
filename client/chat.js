Session.set('new-chat','');
Session.set('new-chat-focus',false);

Template.chat.greeting = function () {
    return "hello from chat";
}
Template.chat.buttonstate = function () {
    return ( Session.get('new-chat').length == 0 ) ? 'disabled="disabled"' : '';
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
    }
});
