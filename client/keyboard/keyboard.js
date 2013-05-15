/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, Template, Session, Meteor, window, key_pressed:true, Audio, alert, Random, console, DEBUG*/

var keyboardWidth = 50;  // changed whenever screen size changes
var white_key_count;
Template.keyboard.keyboardHeight = 10;
var press_timeout = 333;
var runId = Random.id();   // meteor claims this is "likely to be unique"

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

function initialize_keyboard_keys_defaults()  // set .idx, .leftOffset, .width, .visual, .color, .audio, .keyboardCode
{
    var i, key, audio_file_extension;
    white_key_count = 0;

    audio_file_extension = ( -1 !== navigator.userAgent.indexOf('Firefox') ) ? '.wav' : '.mp3';

    for ( i = 0; i < Template.keyboard.keys.length; i++ )
    {
        key = Template.keyboard.keys[i];
        key.idx = i;
        key.leftOffset = 1;
        key.width = 1;
        key.visual = null;
        key.audio = new Audio('/' + key.audiofile + audio_file_extension);
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
            if ( key.visual !== null )
            {
                Meteor.clearTimeout(key.visual.timeout);
            }
            key.visual = null;
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
    change_keyboard_size();
    return '';
};

var prevSendKeyTime = 0; // used to "prime the pump" if it's been a while since we sent anything
var max_time_between_pump_priming = 50;

key_pressed = function(idx,fromServer) {
    var key, self_latency, curTime;

    key = Template.keyboard.keys[idx];
    self_latency = Session.get('self-latency');

    function tell_server_about_this_keystroke()
    {
        if ( Session.get('entering-username') )
        {
            $('#enter-username').blur();
        }
        if ( Session.get('new-chat-focus') )
        {
            $('#new-chat').blur();
        }

        curTime = (new Date()).getTime();
        if ( DEBUG )
        {
            console.log("time since sent last keystroke = " + (curTime - prevSendKeyTime));
        }
        if ( max_time_between_pump_priming < (curTime - prevSendKeyTime) )
        {
            Meteor.call(
                "addKeypoke",
                runId,
                -1,
                Session.get('username'),
                self_latency,
                function (err, result) {
                    if (err) {
                        alert("Could not add keypoke " + err.reason);
                    }
                }
            );
            if ( DEBUG )
            {
                console.log("PRIME THE PUMP!!!!!!!");
            }
        }
        prevSendKeyTime = curTime;

        Meteor.call(
            "addKeypoke",
            runId,
            idx,
            Session.get('username'),
            self_latency,
            function (err, result) {
                if (err) {
                    alert("Could not add keypoke " + err.reason);
                }
            }
        );
    }

    function show_keypress_visually()
    {
        var selector, newClass, nameDiv, keyEl;
        selector = '#key-' + idx;
        newClass = key.color + "-key-pressed";

        keyEl = $(selector);

        if ( key.visual !== null )
        {
            Meteor.clearTimeout(key.visual.timeout);
            key.visual.nameDiv.remove();
        }
        else
        {
            key.visual = { };
            keyEl.addClass(newClass);
        }

        key.visual.nameDiv = $('<div class="pokey-name"></div>').text(fromServer ? fromServer : Session.get('username'));
        keyEl.append(key.visual.nameDiv);

        key.visual.timeout = Meteor.setTimeout(function(){
            keyEl.removeClass(newClass);
            key.visual.nameDiv.remove();
            key.visual = null;
        },press_timeout);
    }

    function play_audio()
    {
        try {
            key.audio.pause();
        } catch(e1) { } // can be a problem on iphone
        try {
            key.audio.currentTime=0;
        } catch(e2) { } // can be a problem on iphone
        key.audio.play();
    }

    if ( !self_latency || fromServer )
    {
        Meteor.setTimeout(play_audio,0);
    }
    if ( !fromServer )
    {
        // if a local key, tell everyone else about this key being pressed
        Meteor.setTimeout(tell_server_about_this_keystroke,0);
    }
    if ( !self_latency || fromServer )
    {
        show_keypress_visually();
    }

    return false;
};

var gPreviousIdx;
var gPreviousUsername;

Meteor.startup(function() { // from http://stackoverflow.com/questions/14185248/rerendering-meteor-js-on-window-resize
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

    // subscribe to message about all keypokes from all other users
    Meteor.subscribe("keypokes",runId);

    Meteor.default_connection.registerStore('keypokes', {
        update: function (msg) {
            var idx, username;

            if ( msg.fields.idx !== undefined )
            {
                gPreviousIdx = msg.fields.idx;
            }
            if ( msg.fields.username !== undefined )
            {
                gPreviousUsername = msg.fields.username;
            }
            if ( DEBUG )
            {
                console.log(msg.id + " " + msg.fields.idx + " " + msg.fields.username);
                console.log("about to poke " + gPreviousIdx + " " + gPreviousUsername);
            }
            idx = gPreviousIdx;
            username = gPreviousUsername;
            if ( idx !== -1 ) // ignore these prime-the-pump key calls
            {
                key_pressed(idx,username);
            }

        }
  });
});