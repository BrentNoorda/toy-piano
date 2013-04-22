/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Template, console*/

var keyboardWidth = -1;  // changed whenever screen size changes

function change_keyboard_width()
{
    var new_width = $('#keyboard-case').width();
    if ( new_width !== keyboardWidth )
    {
        keyboardWidth = new_width;
        alert( keyboardWidth );
    }
}

Template.keyboard.whiteKeys = [
    { name: 'c' },
    { name: 'd' },
    { name: 'e' },
    { name: 'f' },
    { name: 'g' },
    { name: 'a' },
    { name: 'b' },
    { name: 'c' }
];

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
}

Meteor.startup = function() { // from http://stackoverflow.com/questions/14185248/rerendering-meteor-js-on-window-resize
  $(window).resize(function(evt) {
    change_keyboard_width();
  });
}