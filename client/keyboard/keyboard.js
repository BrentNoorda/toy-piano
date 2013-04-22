/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, Template, console, Session, Meteor, window*/

var keyboardWidth = 50;  // changed whenever screen size changes

Template.keyboard.whiteKeys = [
    { name: 'c', leftOffset:20, width:20 },
    { name: 'd', leftOffset:30, width:30 },
    { name: 'e', leftOffset:40, width:40 },
    { name: 'f', leftOffset:50, width:50 },
    { name: 'g', leftOffset:60, width:60 },
    { name: 'a', leftOffset:70, width:70 },
    { name: 'b', leftOffset:80, width:80 },
    { name: 'c', leftOffset:90, width:90 }
];

function change_keyboard_width()
{
    var new_width, white_key_width, i;
    new_width = $('#keyboard-case').width();
    if ( new_width !== keyboardWidth )
    {
        keyboardWidth = new_width;
        white_key_width = Math.floor(new_width / Template.keyboard.whiteKeys.length);
        for ( i = 0; i < Template.keyboard.whiteKeys.length; i++ )
        {
            Template.keyboard.whiteKeys[i].width = white_key_width;
            Template.keyboard.whiteKeys[i].leftOffset = (white_key_width) * i;
        }
        Session.set('keyboardWidth',new_width);
    }
}

Template.keyboard.events({
    'click input' : function () {
        // template data, if any, is available in 'this'
        if (typeof console !== 'undefined')
        {
            console.log("You pressed the button");
        }
    }
});

Template.keyboard.rendered = function() {
     change_keyboard_width();
};

Template.keyboard.render_on_resize = function() {
    Session.get('keyboardWidth');
    return '';
};

Meteor.startup = function() { // from http://stackoverflow.com/questions/14185248/rerendering-meteor-js-on-window-resize
  $(window).resize(function(evt) {
    change_keyboard_width();
  });
};