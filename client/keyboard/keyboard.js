/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, Template, console, Session, Meteor, window*/

var keyboardWidth = 50;  // changed whenever screen size changes
Template.keyboard.keyboardHeight = 10;

Template.keyboard.whiteKeys = [
    { name: 'c', leftOffset:1, width:1 },
    { name: 'd', leftOffset:2, width:1 },
    { name: 'e', leftOffset:3, width:1 },
    { name: 'f', leftOffset:4, width:1 },
    { name: 'g', leftOffset:5, width:1 },
    { name: 'a', leftOffset:6, width:1 },
    { name: 'b', leftOffset:7, width:1 },
    { name: 'c', leftOffset:8, width:1 }
];

Template.keyboard.blackKeys = [
    { name: 'c#', leftOffset:1, width:1 },
    { name: 'd#', leftOffset:2, width:1 },
    { name: 'f#', leftOffset:2, width:1 },
    { name: 'g#', leftOffset:2, width:1 },
    { name: 'a#', leftOffset:2, width:1 }
];

function change_keyboard_size()
{
    var new_width, screen_height, new_height, white_key_width, black_key_width, i, j, keyName;
    new_width = $('#keyboard-case').width();
    if ( new_width !== keyboardWidth )
    {
        keyboardWidth = new_width;
        white_key_width = Math.floor(new_width / Template.keyboard.whiteKeys.length);
        black_key_width = Math.floor(white_key_width * 2 / 3);
        for ( i = 0; i < Template.keyboard.whiteKeys.length; i++ )
        {
            Template.keyboard.whiteKeys[i].width = white_key_width;
            Template.keyboard.whiteKeys[i].leftOffset = (white_key_width) * i;
        }
        for ( j = 0; j < Template.keyboard.blackKeys.length; j++ )
        {
            keyName = Template.keyboard.blackKeys[j].name.substring(0,1);
            for ( i = 0; i < Template.keyboard.whiteKeys.length; i++ )
            {
                if ( Template.keyboard.whiteKeys[i].name === keyName ) {
                    Template.keyboard.blackKeys[j].width = black_key_width;
                    Template.keyboard.blackKeys[j].leftOffset = Math.floor(
                        Template.keyboard.whiteKeys[i+1].leftOffset - (black_key_width/2)
                    );
                    break;
                }
            }
        }
        Session.set('keyboardWidth',new_width);
    }
    screen_height = $(window).height();
    new_height = Math.min(screen_height * 2 / 3,300);
    if ( new_height !== Template.keyboard.keyboardHeight )
    {
        Template.keyboard.keyboardHeight = new_height;
        Session.set('keyboardHeight',new_height);
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
    change_keyboard_size();
};

Template.keyboard.render_on_resize = function() {
    Session.get('keyboardWidth');
    Session.get('keyboardHeight');
    return '';
};

Meteor.startup = function() { // from http://stackoverflow.com/questions/14185248/rerendering-meteor-js-on-window-resize
    $(window).resize(function(evt) {
        change_keyboard_size();
    });
    change_keyboard_size();
};