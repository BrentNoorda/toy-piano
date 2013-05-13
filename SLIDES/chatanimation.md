kludging animations on Meteor for toy-piano <span style="float:right;"> [&#x25B2;](../README.md#interesting-bits)</span>
===============

In the chat window portion of toy-piano I wanted animated to show new chat elements (rather than tho have them just suddenly exist). But Meteor doesn't yet help with the concept of animations, such as when a new item appears in the DOM. The workarounds I found online seemed overly complicated, and so here's the simple kludge I came up with.


### the biggest problem I hit when adding animations

The standard Meteor chat examples simply change the state of the display output when a user enters a chat message, as in this [Basic chat app](http://brh-chat.meteor.com/)  example from the top of [Made With Meteor](http://madewith.meteor.com/).

In this case everything appears fine and dandy. The user enters a new message and, boom, the message is there.

[![](http://img.youtube.com/vi/oub20Iw7hiA/0.jpg)](http://www.youtube.com/watch?v=oub20Iw7hiA)

But in the toy-piano chat windoe I wanted something a little fancier. I wanted to provide visual cues to the user to about when new messages came in and where they belonged in the history. So I added some typical animations (more on how that happened later), and by the time I deployed these to the server, where lag is involved, I would sometimes see something like this:

[![](http://img.youtube.com/vi/dVADkYakjD8/0.jpg)](http://www.youtube.com/watch?v=dVADkYakjD8)

Annoying, right?

Basically, the currently workaround, sadly, is to avoid Meteor's latency compensation thing in the first place.

Here's how I did that in the current code:

------

BTW, I've since learned there is a much easier workaround to my kludge to not really draw the field in the client (and thus avoid the latency compensation double-draw thing) and that is simply to not add the `addChat()` method to the client, so that new entries into the Chat table are only initiated at the server.

------


&nbsp;&nbsp;&nbsp;&nbsp; [&lt;&lt; back](../README.md#interesting-bits)

http://youtu.be/oub20Iw7hiA