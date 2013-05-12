Dear Meteor Development Group, here's how to make Meteor more better <span style="float:right;"> [&#x25B2;](../README.md#for-mdg-eyes-only)</span>
===============

In working with Meteor for a short while I'm impressed that you guys are off to such a great start on you radical and audacious goal of solving all the web-related software development problems. Right On!

But no more praise, for now. Instead here's a few suggestions on what you should be up to to improve Meteor. *My advice, and a few bucks, will buy you a cup of Blue Bottle coffee, so I hope you take if for all it's worth.*

# 1) Figure out the animation stuff

Yes, your reactive live update thing is cool. It's very impressive to have user A perform some action that changes the database, and to have that quickly and automatically update the screen of user B without the developer having to write special code for that.

But, that's not what we expect on state-of-the-art web pages these days. We don't want our web pages to just change from one state to another in a magic blink (save that trick for 60's television shows about witches and genies).

Instead of immediate switching from the display of one static DOM state to another static DOM state, we humans need help visualizing what is changing.

In short, we need visual cues. We need animations.

I wrote about my own struggle with this in [animating fade-ins for the chat window](chatanimation.md), but for a simple example of why this is needed, look at your own [leaderboard example](http://meteor.com/examples/leaderboard) and watch the video starting around 20 seconds in. The user on the right is voting, and because of some yellow background and their own actions has a clue what's going on, but the poor user on the left, representing "any player in the world" is just seeing stateless magic, and that's a poor experience (and can even be a wrong experience if that users is click on a name as it's magically moving around and so maybe clicks on the wrong name).

# 2) how the heck is scaling going to work?

It is not clear how to share the load over more than one server. Yes, a node server can suppot a lot of clients, but tens or hundreds of thousands on a single server? Millions? How am I going to support toy-piano once it becomes really really popular? Can I invest my time on Meteor if I hope to get big?

# how can I get to zero down time?

It's cools that each time I deploy all of my users are automatically updated. But that's also totally uncool. What if they're in the middle of something, like entering a text field, or playing a lovely toy-piano sinata?

You need a plan for deploying more gracefully, so that my users see no downtime.

# is latency compensation just a gimmick?

From [your home page](http://meteor.com/):

    When a user makes a change, their screen updates immediately - no waiting for the
    server. If the server rejects their request or executes it differently, the client
    is patched up with what actually happened.

Again, that's super cool. But just because you CAN do this does not mean you usually SHOULD do this.  I suspect that more Meteor developer's time is spent either showing off this feature, or working around it, than it's worth. I suspect that the occasions are actually very rare when an application needs the extra couple of milliseconds that latency compensation gives.

I suggest working instead on making the server response just be faster, and then you can make latency compensation a nice feature that is no longer the default.

# give us a debug-time what-is-happening view

Meteor is doing clever things with reactive, live updates, figuring out the minimum changes needed and performing them as lively as possible. The problem is, once a program reaches anything above minimal complexity, the inter-connectedness between parts quickly becomes complex. This is not too complex for the Meteor framework, which happily follows it's programmed logic forever, but for the developer who is left wondering "why did this change here cause that change there?"

For example, in toy-piano, which is not at all a complicated bit of software, there was a time I found it was running extremely slowly, taking up most of my CPU, and it was a lot harder than it should be to find the cause for this. The cause was my own bad, of course, and misreading of the Meteor Docs, but still, it shouldn't be so hard to figure out what's going on.

What would be really nice would be for Meteor to provide a debug-time option to describe everything it was doing, and why. This is especially useful in a framework such as this because it is Meteor's goal almost-magically do a bunch of figgerin' for the developer (so the developer doesn't have to). I.E. Meteor's goal is for it's logic to remain hidden, which sucks when you're trying to debug or optimize.

I want at least four levels of this debugging help.

1) lots of logs available in the console

2) visual indicators on the page each time an element is being redrawn: this might be in the form of brief bright flashes around each element being redrawn

3) a step mode, so that the developer must press a key to step from one meteor even to the next (i.e. see one elemnt redrawn, along with message for why that happened, then press key to see the next one)

4) a full debugging environment

# Go a step further combining html(handlebars), css(less), & javascript...

I like that you're combining so many components together. I like putting handlebars and less javascript files into combined directories, and further knowing that your tools will bundle them all together. I like that the server language is the same as the client, and much of the time (as with DB calls) the code is actually the same on both client and server.

Those are steps in the right direction. Can you take further steps in melding all these components together? For example:

* how about a way to share variables between .less files and .js (and not [my kludgy approach](sharelessvar.md))?
* how about combining js code directly into the html files (e.g. don't call out to template files, but have that code fit right there in the html)?
* how about templates for css classes, the same way you have templates for html? I don't know what that would look like, but it would be cool. Why doesn't css get to be as flexible as html or javascript?

# ...and events, do something revolutionary with events




# multiple pages done right, dammit

# get control of the smart package environment

# develop demo version of all of today's most-popular web sites and applications

This is the biggest bit of advice, and all of the others would probably fall out of this.

# make the phone developers make better browsers

you guys have impressive credentials. convince your buddies at Apple and Google to stop making such sucky browsers so Meteor can shine on a browser as well as it does on a desktop

# how to restart server without redrawing client?


# charge something for something


don't forget:

 * the freaking annoying double-display thing
 * they have this template thing going pretty well, but then it breaks where events are found (may as well use jquery)
 * too much magic still (for example had to read lots of source code, put in alerts, etc...)
 * our way or the highway
 * load order is annoying, how to make sure one thing is loaded before another
libraries might not all work exactly - need "smart packages"


 the meteor people need to make, and mimic, fraking real-worl web sites

------

&nbsp;&nbsp;&nbsp;&nbsp; [&lt;&lt; back](../README.md#for-mdg-eyes-only)