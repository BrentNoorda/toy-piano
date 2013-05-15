kludging animations on Meteor for toy-piano <span style="float:right;"> [&#x25B2;](../README.md#interesting-bits)</span>
===============

In the chat window portion of toy-piano I wanted animation to show new chat elements (rather than to have them just suddenly exist). But Meteor doesn't yet help with the concept of animations, such as when a new item appears in the DOM.

### the goal: simple animations on new chat messages

For instance, the standard Meteor chat examples simply change the state of the display output when a user enters a chat message, as in this [Basic chat app](http://brh-chat.meteor.com/) example from the top of [Made With Meteor](http://madewith.meteor.com/) (*click on image to watch video*)

[![](http://img.youtube.com/vi/oub20Iw7hiA/0.jpg)](http://www.youtube.com/watch?v=oub20Iw7hiA)

The user enters a new message and, boom, the message is there.

But for toy-piano I wanted a little more finesse, a little more style, so I ended up with this (*click on image to watch video*):

[![](http://img.youtube.com/vi/iTM4ClNh7_I/0.jpg)](http://www.youtube.com/watch?v=iTM4ClNh7_I)

### how I added simple animations

All of the code for these chat animations is in the [client/chat folder on github](https://github.com/BrentNoorda/toy-piano/tree/master/client/chat).

The simplest part is in the fade-in of new messages. In [chat.html](https://github.com/BrentNoorda/toy-piano/blob/master/client/chat/chat.html) each individual chat item is represented by this div:

    <div class="old-chat old-old-chat" id="chat-{{_id}}" {{{fade_in _id}}}>
        <span class="chat-username">{{username}}:</span> {{text}}
    </div>

Notice the `id` added to each item based on the `id` in the mongo database, and the reference to `fade_in`, which is implemented in this bit of template code in [chat.js](https://github.com/BrentNoorda/toy-piano/blob/master/client/chat/chat.js), a simplified version of which is here:

    Template.chat.fade_in = function(_id) {
        Meteor.setTimeout(function() {
            $('#chat-'+_id).show(hide_chat_time,function(){
                $(this).animate({opacity:1},{duration:'slow',complete:function(){
                    $(this).removeClass('old-old-chat').addClass('new-old-chat');
                }});
            });
        },0);
        return '';
    };

__Basically, here's the little trick I just pulled to animate new instances: `fade_in` is added in the html handlebars simply to trigger a next-event-loop call to `setTimeout(...,0)` which I know will be called as soon as that tag is rendered to the DOM.__

Yes, it's a big kludge, but it seems to work for now, and until Meteor gives us real new-element-animation control.

Most of the other animations I did were variations on this theme, and I won't go into the details here.

The chat system also keeps only the last 10 items of chat (this happens on the server). It would have been nice to have old chats fade out instead of just disappearing. That trick seemed harder than the fade-in, so I didn't even try.

### the biggest problem I hit when adding animations

You might notice in my implementation that new chat messages don't appear the instance I press enter, but instead only after a little delay.  My first implementation used Meteor's latency compensation to have them show up immediately, but by the time I deployed these to the server, where real-world lag is involved, I would often see something like this (*click on image to watch video*):

[![](http://img.youtube.com/vi/dVADkYakjD8/0.jpg)](http://www.youtube.com/watch?v=dVADkYakjD8)

What was happening is that I'd see the new element drawn the first time from the immediate local entry into the database, and then again from the server-side "official" entry into the database. __Annoying, right?__

The workaround I have in the current code is for the client to add a `localVersion` property to the record, and to have the server remove that `localVersion` property, so if `localVersion` is in the record the client can choose to not really display it.

Basically, the workaround, sadly, is to avoid Meteor's latency compensation thing in the first place.

*BTW, I've since learned there is a much easier workaround, and that is simply to not add the `addChat()` method to the client, so that new entries into the Chat table are only initiated at the server. But that's still just another way, albeit a simpler way, to avoid Meteor's latency compensation, and so it remains sad that it's difficult to both latency compensation and animations.*

------

&nbsp;&nbsp;&nbsp;&nbsp; [&lt;&lt; back](../README.md#interesting-bits)
