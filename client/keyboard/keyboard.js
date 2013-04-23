/*jslint white:false plusplus:false browser:true nomen:false */
/*globals $, Template, Session, Meteor, window, white_keypress:true, black_keypress:true, Audio*/

var keyboardWidth = 50;  // changed whenever screen size changes
Template.keyboard.keyboardHeight = 10;
var press_timeout = 250;

Template.keyboard.whiteKeys = [
    { name: 'c', idx:0, leftOffset:1, width:1, timeout:null },
    { name: 'd', idx:1, leftOffset:2, width:1, timeout:null },
    { name: 'e', idx:2, leftOffset:3, width:1, timeout:null },
    { name: 'f', idx:3, leftOffset:4, width:1, timeout:null },
    { name: 'g', idx:4, leftOffset:5, width:1, timeout:null },
    { name: 'a', idx:5, leftOffset:6, width:1, timeout:null },
    { name: 'b', idx:6, leftOffset:7, width:1, timeout:null },
    { name: 'c2', idx:7, leftOffset:8, width:1, timeout:null }
];

Template.keyboard.blackKeys = [
    { name: 'cs', idx:0, leftOffset:1, width:1, timeout:null },
    { name: 'ds', idx:1, leftOffset:2, width:1, timeout:null },
    { name: 'fs', idx:2, leftOffset:2, width:1, timeout:null },
    { name: 'gs', idx:3, leftOffset:2, width:1, timeout:null },
    { name: 'as', idx:4, leftOffset:2, width:1, timeout:null }
];

function change_keyboard_size()
{
    var new_width, screen_height, new_height, white_key_width, black_key_width, i, j, keyName, wKey, bKey;
    new_width = $('#keyboard-case').width();
    if ( new_width !== keyboardWidth )
    {
        keyboardWidth = new_width;
        white_key_width = Math.floor(new_width / Template.keyboard.whiteKeys.length);
        black_key_width = Math.floor(white_key_width * 2 / 3);
        for ( i = 0; i < Template.keyboard.whiteKeys.length; i++ )
        {
            wKey = Template.keyboard.whiteKeys[i];
            wKey.width = white_key_width;
            wKey.leftOffset = (white_key_width) * i;
            Meteor.clearTimeout(wKey.timeout);
            wKey.timeout = null;
        }
        for ( j = 0; j < Template.keyboard.blackKeys.length; j++ )
        {
            bKey = Template.keyboard.blackKeys[j];
            keyName = bKey.name.substring(0,1);
            for ( i = 0; i < Template.keyboard.whiteKeys.length; i++ )
            {
                wKey = Template.keyboard.whiteKeys[i];
                if ( wKey.name === keyName ) {
                    bKey.width = black_key_width;
                    bKey.leftOffset = Math.floor(
                        Template.keyboard.whiteKeys[i+1].leftOffset - (black_key_width/2)
                    );
                    break;
                }
            }
            Meteor.clearTimeout(bKey.timeout);
            bKey.timeout = null;
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

function key_pressed(selector,key,newClass)
{
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
}

white_keypress = function(idx) {
    key_pressed("#whitekey-" + idx,Template.keyboard.whiteKeys[idx],"white-key-pressed");
    return false;
};
black_keypress = function(idx) {
    key_pressed("#blackkey-" + idx,Template.keyboard.blackKeys[idx],"black-key-pressed");
    return false;
};

Meteor.startup = function() { // from http://stackoverflow.com/questions/14185248/rerendering-meteor-js-on-window-resize
    var i, key;
    $(window).resize(function(evt) {
        change_keyboard_size();
    });
    change_keyboard_size();

    // prime the pump by getting all the key sounds loaded
    for ( i = 0; i < Template.keyboard.whiteKeys.length; i++ )
    {
        key = Template.keyboard.whiteKeys[i];
        key.audio = new Audio(key.name + ".mp3");
    }
    for ( i = 0; i < Template.keyboard.blackKeys.length; i++ )
    {
        key = Template.keyboard.blackKeys[i];
        key.audio = new Audio(key.name + ".mp3");
    }
};