/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, Template, Session, Meteor, Keypokes, window, key_pressed:true, Audio, alert*/

var keyboardWidth = 50;  // changed whenever screen size changes
var white_key_count;
Template.keyboard.keyboardHeight = 10;
var press_timeout = 250;

Template.keyboard.keys = [
    // list the white keys first (so display will put the black ones on top)
    { note: 'c', audiofile: 'c',  keyboardKey: 'S' },
    { note: 'd', audiofile: 'd',  keyboardKey: 'D' },
    { note: 'e', audiofile: 'e',  keyboardKey: 'F' },
    { note: 'f', audiofile: 'f',  keyboardKey: 'G' },
    { note: 'g', audiofile: 'g',  keyboardKey: 'H' },
    { note: 'a', audiofile: 'a',  keyboardKey: 'J' },
    { note: 'b', audiofile: 'b',  keyboardKey: 'K' },
    { note: 'c', audiofile: 'c2', keyboardKey: 'L' },

    // list the black keys second so they are on top
    { note: 'c#', audiofile: 'cs', keyboardKey: 'E' },
    { note: 'd#', audiofile: 'ds', keyboardKey: 'R' },
    { note: 'f#', audiofile: 'fs', keyboardKey: 'Y' },
    { note: 'g#', audiofile: 'gs', keyboardKey: 'U' },
    { note: 'a#', audiofile: 'as', keyboardKey: 'I' }
];

function initialize_keyboard_keys_defaults()  // set .idx, .leftOffset, .width, .timeout, .color, .audio, .keyboardCode
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
        key.audio = new Audio(key.audiofile + ".mp3");
        key.keyboardCode = key.keyboardKey.charCodeAt(0);
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

key_pressed = function(idx,fromServer) {
    var selector, key, newClass, newKeypoke;
    selector = '#key-' + idx;
    key = Template.keyboard.keys[idx];
    newClass = key.color + "-key-pressed";

    // if a local key, tell everyone else about this key being pressed
    if ( !fromServer )
    {
        if ( Session.get('entering-username') )
        {
            $('#enter-username').blur();
        }
        if ( Session.get('new-chat-focus') )
        {
            $('#new-chat').blur();
        }

        newKeypoke = { idx: idx, username: Session.get('username') };
        Meteor.call(
                    "addKeypoke",
                    newKeypoke,
                    function (err, result) {
                        if (err) {
                            alert("Could not add keypokechat " + err.reason);
                        }
                    }
               );
    }

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

Template.keyboard.keypokes = function () {
    return Keypokes.find( {}, {sort: {when:-1} } );
};

Template.keyboard.updateWhen = function () {
    return new Date();
};

Template.keyboard.goober = function (idx,username) {
    if ( username !== Session.get('username') )
    {
        key_pressed(idx,true);
    }
};


Meteor.startup = function() { // from http://stackoverflow.com/questions/14185248/rerendering-meteor-js-on-window-resize
    $(window).resize(function(evt) {
        change_keyboard_size();
    });
    change_keyboard_size();

    $(document).keydown(function(e) {
        if ( !Session.get('new-chat-focus')  && !Session.get('entering-username') )
        {
            var idx, key;
            for ( idx = 0; idx < Template.keyboard.keys.length; idx++ )
            {
                key = Template.keyboard.keys[idx];
                if ( key.keyboardCode === e.which )
                {
                    key_pressed(idx);
                    break;
                }
            }
        }
    });


};