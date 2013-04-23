/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, Template, Session, Meteor, window, key_pressed:true, Audio*/

var keyboardWidth = 50;  // changed whenever screen size changes
var white_key_count;
Template.keyboard.keyboardHeight = 10;
var press_timeout = 250;

Template.keyboard.keys = [
    // list the white keys first (so display will put the black ones on top)
    { note: 'c', audiofile: 'c' },
    { note: 'd', audiofile: 'd' },
    { note: 'e', audiofile: 'e' },
    { note: 'f', audiofile: 'f' },
    { note: 'g', audiofile: 'g' },
    { note: 'a', audiofile: 'a' },
    { note: 'b', audiofile: 'b' },
    { note: 'c', audiofile: 'c2' },

    // list the black keys second so they are on top
    { note: 'c#', audiofile: 'cs' },
    { note: 'd#', audiofile: 'ds' },
    { note: 'f#', audiofile: 'fs' },
    { note: 'g#', audiofile: 'gs' },
    { note: 'a#', audiofile: 'as' }
];

function initialize_keyboard_keys_defaults()  // set .idx, .leftOffset, .width, .timeout, .color
{
    var i, key;
    white_key_count = 0;
    for ( i = 0; i < Template.keyboard.keys.length; i++ )
    {
        key = Template.keyboard.keys[i];
        key.idx = i;
        key.leftOffset = 1;
        key.width = 1;
        key.timeout = null;
        if ( key.note.length === 1 )
        {
            white_key_count += 1;
            key.color = 'white';
        }
        else
        {
            key.color = 'black';
        }
    }
}
initialize_keyboard_keys_defaults();

function change_keyboard_size()
{
    var new_width, screen_height, new_height, white_key_width, black_key_width, i, j, wKeyNote, key, wKey;
    new_width = $('#keyboard-case').width();
    if ( new_width !== keyboardWidth )
    {
        keyboardWidth = new_width;
        white_key_width = Math.floor(new_width / white_key_count);
        black_key_width = Math.floor(white_key_width * 2 / 3);
        for ( i = 0; i < Template.keyboard.keys.length; i++ )
        {
            key = Template.keyboard.keys[i];
            Meteor.clearTimeout(key.timeout);
            key.timeout = null;
            if ( key.color === "white" )
            {
                // white key
                key.width = white_key_width;
                key.leftOffset = (white_key_width) * i;
            }
            else
            {
                // black key
                key.width = black_key_width;
                wKeyNote = key.note.substring(0,1);
                for ( j = 0; j < Template.keyboard.keys.length; j++ )
                {
                    wKey = Template.keyboard.keys[j];
                    if ( wKey.note === wKeyNote ) {
                        key.leftOffset = Math.floor(
                            Template.keyboard.keys[j+1].leftOffset - (black_key_width/2)
                        );
                        break;
                    }
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

Template.keyboard.rendered = function() {
    change_keyboard_size();
};

Template.keyboard.render_on_resize = function() {
    Session.get('keyboardWidth');
    Session.get('keyboardHeight');
    return '';
};

key_pressed = function(idx) {
    var selector, key, newClass;
    selector = '#key-' + idx;
    key = Template.keyboard.keys[idx];
    newClass = key.color + "-key-pressed";

    try {
        key.audio.pause();
    } catch(e1) { } // can be a problem on iphone
    try {
        key.audio.currentTime=0;
    } catch(e2) { } // can be a problem on iphone
    key.audio.play();
    if ( key.timeout !== null )
    {
        Meteor.clearTimeout(key.timeout);
    }
    else
    {
        $(selector).addClass(newClass);
    }
    Meteor.setTimeout(function(){
        $(selector).removeClass(newClass);
    },press_timeout);
    return false;
};

Meteor.startup = function() { // from http://stackoverflow.com/questions/14185248/rerendering-meteor-js-on-window-resize
    var i, key;
    $(window).resize(function(evt) {
        change_keyboard_size();
    });
    change_keyboard_size();

    // prime the pump by getting all the key sounds loaded
    for ( i = 0; i < Template.keyboard.keys.length; i++ )
    {
        key = Template.keyboard.keys[i];
        key.audio = new Audio(key.audiofile + ".mp3");
    }
};