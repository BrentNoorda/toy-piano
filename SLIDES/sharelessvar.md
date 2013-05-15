passing a variable from css/less to javascript <span style="float:right;"> [&#x25B2;](../README.md#interesting-bits)</span>
===============

One of the standard Meteor packages is for the [less dynamic stylesheet language](http://lesscss.org/). It's very nice during development to alter a .less file, have the Meteor system automatically detect the changes and compile to .css, and then automatically force the browser to redraw the screen with the new stylesheet applied.

That's terrific, but I wanted more. There is a part in the chat animations where I wanted to coincide my timings with some of the timings in the css transitions. I didn't want to change parameters in two places, only one.

I've suggested that [Meteor should solve this problem](mdgadvice.md#combineevenmoreandless), but until they do...

### a kludge for passing less/css variables into javascript

[client/chat/chat.less](https://github.com/BrentNoorda/toy-piano/blob/master/client/chat/chat.less) has this code:

    @hide-chat-time: 450;  /* this is shared with chat.less via hide-chat-time-global */

    #hide-chat-time-global {
        display:none;
        width: unit(@hide-chat-time,px)
    }

[client/chat/chat.html](https://github.com/BrentNoorda/toy-piano/blob/master/client/chat/chat.html) has this:

    <div id="hide-chat-time-global"></div>

and [client/chat/chat.js]() retrieves the `hide-chat-time` value at startup with this code:

    var hide_chat_time; /* initialized from chat.less in the  Meteor.startup method */
    ...
    Meteor.startup(function () {
        ...
        // load globals from chat.less
        hide_chat_time = $('#hide-chat-time-global').width();
    });

It's totally ridiculous, but it works. __Do you have a better solution?__

------

&nbsp;&nbsp;&nbsp;&nbsp; [&lt;&lt; back](../README.md#interesting-bits)