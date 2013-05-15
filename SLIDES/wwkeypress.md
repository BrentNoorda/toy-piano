real-time sharing toy-piano keypresses amond all worldwide users <span style="float:right;"> [&#x25B2;](../README.md#interesting-bits)</span>
===============

The goal was for a global keyboard: anytime anyone in the world pressed keys on [toy-piano.meteor.com](http://toy-piano.meteor.com/), we would all hear, see, and play along with them together. *It would be like [that scene in Big](http://www.youtube.com/watch?v=0Yu62StlsMY), only with the entire world coming together in perfect unison and harmony.*

### first pass: sharing keys through a DB collection

Meteor's standard way to share data among users is through database Collections, so that's how I started. Each time a client hit a key, an entry would go in the database. Each time an entry went in database all clients would get it and play it.

This approach was really easy to put together and worked pretty well, with only a tiny lag between multiple players, when I tried it locally.

But when I deployed to Meteor.com there were obvious lags when one player would hit a key and another player would hear it.

*If you're alone, and want to experience the lags for yourself, turn on the "self latency" checkmark at the bottom of the keyboard, which effectively undoes Meteor's latency compensation and let's you hear yourself as others do:*

![](https://github.com/BrentNoorda/toy-piano/blob/master/SLIDES/selflatency.png?raw=true)

### second pass: skipping the database

I wondered how much of the lag in playing was do to the layer of using the MongoDB database to store-and-retrieve data. So I set out to use Meteor's publish/subscribe model more directly, without involving the database.

This proved to be much more complicated than I'd expected because the plumbing of the servers publish mechanism is not yet documented, and it wasn't clear how to directly broadcast to all clients whatever comes in from one client. The good folks at Meteor pointed me to some of their own [tinytest_server.js](https://github.com/meteor/meteor/blob/master/packages/tinytest/tinytest_server.js) code, and I plagiarized from that.

The resulting code is [server/keypoke.js](https://github.com/BrentNoorda/toy-piano/blob/master/server/keypoke.js).

The response was a little better with this approach, but not a lot better. I did not look further than this for making a fully real-time keyboard with Meteor as hosted on their servers (which, to be fair, or simultaneously hosting a lot of other projects too).

### solving the multiple-simultaneous-key (i.e. "chord" problem)

At this point I started to notice a really annoying problem. When a user was pressing multiple keys simultaneously, they would not appear to be pressed simultaneously for other users, as you can see in this video where I'm pressing 4 keys simultaneously, but it usually shows up as if I press one key first followed by the other three simultaneously (*click on image to watch video*):

[![](http://img.youtube.com/vi/zLVwyMev8DE/0.jpg)](http://www.youtube.com/watch?v=zLVwyMev8DE)

With a little experimentation I got the feeling that the meteor server probably has some timings in it such that it is giving less time (or more infrequent pollings) to a server when it doesn't appear busy, but if it is busy they are more responsive.

To work around my guess, I added some prime-the-pump code to [client/keyboard.js](https://github.com/BrentNoorda/toy-piano/blob/master/client/keyboard/keyboard.js) so that if it's been more than 50ms since keys were pressed, a dummy NOP key would be sent first to prime-the-pump:

    var prevSendKeyTime = 0;
    var max_time_between_pump_priming = 50;

    function tell_server_about_this_keystroke()
    {
        ...
        curTime = (new Date()).getTime();
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
        }
        ...
    }

at the expense of delaying the broadcast of some keystrokes, this does seem to solve the more-annoying problem of not being able to broadcast chords.  Here's the server running with this change:

(*click on image to watch video*):

[![](http://img.youtube.com/vi/bIL1qw_C6nM/0.jpg)](http://www.youtube.com/watch?v=bIL1qw_C6nM)

------

That's as far as I went creating a real-time shared keyboard as hosted on Meteor's servers. Had I gone further, I would have tried these things:

* Hosting on my own server, dedicated to this keyboard. Meteor.com is hosting a ton of stuff, so I don't know how much better it could run on a dedicated machine.
* Calculating some theoretically best-case values based on pure internet communication times.
* Using tools that are not part of Meteor, but not prevented by Meteor either, such as using Socket.IO directly, or WebRTC peer channels, or time-dilated wormholes through space (which risks the danger of hearing a keystroke before anyone has pressed it).

------

&nbsp;&nbsp;&nbsp;&nbsp; [&lt;&lt; back](../README.md#interesting-bits)