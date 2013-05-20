Dear MeteorJS Development Group, here's 1000 things you need to do to achieve your mission <span style="float:right;"> [&#x25B2;](../README.md#for-mdg-eyes-only)</span>
===============

*I only coded with Meteor for a couple of days. So my advice, and a few bucks, will buy you a small cup of Blue Bottle coffee. You're welcome.*

# 1) Figure out the animation stuff

Yes, your reactive live update thing is cool. It's very impressive to have user A perform some action that changes the database, and to have that quickly and automatically update the screen of user B without the developer having to write special code for that.

But, that's not what we expect on state-of-the-art web pages these days. We don't want our web pages to just change from one state to another in a magic blink (save that trick for 60's television shows about witches and genies).

Instead of immediate switching from the display of one static DOM state to another static DOM state, we humans need help visualizing what is changing.

In short, we need visual cues. We need animations.

If you can get animations working alongside latency compensation, even better.

I wrote about my own struggle with this in [animating fade-ins for the chat window](chatanimation.md), but for a simple example of why this is needed, look at your own [leaderboard example](http://meteor.com/examples/leaderboard) and watch the video starting around 20 seconds in. The user on the right is voting, and because of some yellow background and their own actions has a clue what's going on, but the poor user on the left, representing "any player in the world" is just seeing stateless magic, and that's a poor experience (and can even be a wrong experience if that users is click on a name as it's magically moving around and so maybe clicks on the wrong name).

# 2) how the heck is scaling going to work?

It is not clear how to share the load over more than one server. Yes, a node server can suppot a lot of clients, but tens or hundreds of thousands on a single server? Millions? How am I going to support toy-piano once it becomes really really popular? Can I invest my time on Meteor if I hope to get big?

# 3) how can I get to zero down time?

It's cools that each time I deploy all of my users are automatically updated. But that's also totally uncool. What if they're in the middle of something, like entering a text field, or playing a lovely toy-piano sinata?

You need a plan for deploying more gracefully, so that my users see no downtime. How do I restart the one server without each user seeing an interruptive screen redraw?

# 4) is latency compensation just a gimmick?

From [your home page](http://meteor.com/):

    When a user makes a change, their screen updates immediately - no waiting for the
    server. If the server rejects their request or executes it differently, the client
    is patched up with what actually happened.

Again, that's super cool. But just because you CAN do this does not mean you usually SHOULD do this.  I suspect that more Meteor developer's time is spent either showing off this feature, or working around it, than it's worth. I suspect that the occasions are actually very rare when an application needs the extra couple of milliseconds that latency compensation gives.

I suggest working instead on making the server response just be faster, and then you can make latency compensation a nice feature that is no longer the default.

# 5) give us a debug-time what-is-happening view

Meteor is doing clever things with reactive, live updates, figuring out the minimum changes needed and performing them as lively as possible. The problem is, once a program reaches anything above minimal complexity, the inter-connectedness between parts quickly becomes complex. This is not too complex for the Meteor framework, which happily follows it's programmed logic forever, but for the developer who is left wondering "why did this change here cause that change there?"

For example, in toy-piano, which is not at all a complicated bit of software, there was a time I found it was running extremely slowly, taking up most of my CPU, and it was a lot harder than it should be to find the cause for this. The cause was my own bad, of course, and misreading of the Meteor Docs, but still, it shouldn't be so hard to figure out what's going on.

What would be really nice would be for Meteor to provide a debug-time option to describe everything it was doing, and why. This is especially useful in a framework such as this because it is Meteor's goal almost-magically do a bunch of figgerin' for the developer (so the developer doesn't have to). I.E. Meteor's goal is for it's logic to remain hidden, which sucks when you're trying to debug or optimize.

I want at least four levels of this debugging help.

1) lots of logs available in the console

2) visual indicators on the page each time an element is being redrawn: this might be in the form of brief bright flashes around each element being redrawn

3) a step mode, so that the developer must press a key to step from one meteor even to the next (i.e. see one elemnt redrawn, along with message for why that happened, then press key to see the next one)

4) a full debugging environment

<a name="combineevenmoreandless"></a>
# 6) go a step further combining html(handlebars), css(less), & javascript...

I like that you're combining so many components together. I like putting handlebars and less javascript files into combined directories, and further knowing that your tools will bundle them all together. I like that the server language is the same as the client, and much of the time (as with DB calls) the code is actually the same on both client and server.

Those are steps in the right direction. Can you take further steps in melding all these components together? For example:

* how about a way to share variables between .less files and .js (and not [my kludgy approach](sharelessvar.md))?
* how about combining js code directly into the html files (e.g. don't call out to template files, but have that code fit right there in the html)?
* how about templates for css classes, the same way you have templates for html? I don't know what that would look like, but it would be cool. Why doesn't css get to be as flexible as html or javascript?

### ...and events, do something revolutionary with events

you guys are revolutionizing the reactive programmatic html system. Hurray. But then when events are involved, you get down to code like this:

    Template.chat.events({
        'focus #new-chat': function (e,tmpl) {
            ...
        }
    });

Boo! I don't want my events relegated to a different paradigm than the rest of the html template library. Using a scheme that is not even better than jQuery but, worse, more limited.

Get those events integrated with the html elements and their templates. Not as a separate "event selector" thing. I don't know the event solution, but what you have isn't revolutionary enough.

# 7) multiple pages done right, dammit

Accept it: Not everything is or should be a "single web page". Sometimes (usually) it just makes sense for a web site to contain multiple web pages! All the workaround I saw for this are hacks that still get all those code into a single web page and only show parts of it at a time.

Support multiple web pages! Accept it and do it. It will be easy!

# 8) get control of the smart package environment

It's great that it's not too difficult to make a smart package, or to work with other tools via DDP. Now it's time to make this useful by making all the smart packages easy to find, to add some editorial control over reviewing them, and to insist that every smart package putting itself into your "marketplace" provide good documentation and working examples.

# 9) concentrate on mobile

Most of your meteor apps (your own examples, and those found on [Made with Meteor](http://madewith.meteor.com/)) look pretty crappy on mobile browsers. Concentrate on mobile.

# 10) charge something for something

*Since writing the following section I've learned that Meteor had already announced a "Galaxy" plan to eventually charge for something, which alleviates some of these concerns. To learn more see "Galaxy" in [this old meteor blog](http://meteor.com/blog/2012/07/25/meteors-new-112-million-development-budget).*

    Is Meteor going to exist three years from now? Do I want to put time
    into a platform that I don't know will exist three years from now?
    How can you convince me you'll stick around?

    I'll tell you how I'll be convinced: when you get some revenue; when
    you figure out how to charge something for something.

# 11,12,13...1000) develop working, functional, demo version of all of today's most-popular web sites and applications and gizmos

**This is BY FAR the most important recommendation. All of the others recommendations would probably fall out of this one.**

Instead of producing samples and demos that show what Meteor excels at, you need to produce samples of how to use Meteor to reproduce the most influential pages and apps of today. Show us best practices for reproducing today's hip new sites (e.g. Pinterest, Facebook, Netflix? Yammer?) and the cool stuff used in them (menus, drop downs, fades, infinite scrolling, ads, contextual popups, integration with external non-meteor code such as adwords, and on and on...).

While doing so, and eating your own dog food doing it, you'll be the first to come across all the challenges your users are going to hit, and the first to come up with the solutions (even when it means, gulp, re-evaluating your assumptions about your own platform).

In other words, don't show us how to do what you're best it. Show us how you're best at doing what we want to do, and if you're not the best at *that*, then become the best.

----------------------------------------------------------------

&nbsp;&nbsp;&nbsp;&nbsp; [&lt;&lt; back](../README.md#for-mdg-eyes-only)