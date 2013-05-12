a client/server DEBUG variable based on environment <span style="float:right;"> [&#x25B2;](../README.md#interesting-bits)</span>
===============

toy-piano is my first attempt to play with [MeteorJS](http://meteor.com/) and decide if it really is, as their website proclaims, "A better way to build apps."

I'll share here what I learned, a bit about how toy-piano works, and overall impressions of MeteorJS.

All of the [soure code is on github](https://github.com/BrentNoorda/toy-piano) and a live demo is here: [http://toy-piano.meteor.com/](http://toy-piano.meteor.com/)

Jump To:

* [Why a toy piano?](#why-toy)
* [Installing & Running this code on your own computer](#install-and-run)
* [Super-short intro to Meteor development](#super-short)
* [Quick overview of the toy-piano application hierarchy](#quick-overview-hierarchy)
* [The interesting bits of code in toy-piano](#interesting-bits)
* [Recommendations for web developers - should you be using MeteorJS?](#web-rec)
* [Recommendations for Meteor Development Group - how to improve your product](#for-mdg-eyes-only)

------------------------------------------------------------------------------

<a name="why-toy"></a>
# Why a toy piano?

Because Meteor demos emphasize the "live" nature of the environment, supporting any number of users editing simultaneously, I was curious to create something that would test the speed and "liveliness" of a multiuser app. So I built a toy piano where any time someone presses a key that keypress is broadcast to everyone who is logged in. If latency was low enough, I hoped, the people of the internet could play duets, or triplets, or infinets. *(oh what beautful music I hope we'll make)*

------------------------------------------------------------------------------

<a name="install-and-run"></a>
# Installing & Running this code on your own computer

Here is the first area where MeteorJS really really shines: getting started is trivially fast (I hope all framework makers learn from this).

If you want to run this toy-piano on your own computer (max, windows, linux, I don't care), you don't need to have installed any special versions of languages, tools, libraries, compilers, etc... No, the only thing you need to have already installed are `curl` and `git`. *I'm not kidding*.

Here's the commands to get toy-piano running as a local server on your system.

     $ curl https://install.meteor.com | /bin/sh
     $ git clone https://github.com/BrentNoorda/toy-piano.git my-toy-piano
     $ cd my-toy-piano
     $ meteor

Open your browser to [http://localhost:3000/](http://localhost:3000/) and, voila, you have your own toy piano running on your computer.

All installations of completely new server platforms should be so simple!

### *How do they do this so-easy-to-install magic?*

MeteorJS is built on [NodeJS](http://nodejs.org/). Node developers exercise a pattern of installing all dependencies for a project within that project's directory structure (so that if project A has different dependencies than project B, there is no conflict). Meteor extends this by including *everything* that is needed, even non-meteor stuff like jquery and underscore, within its installed items. This even includes the database: you don't have to install a compatible database engine on your system, because Meteor includes MongoDB directly within its executable. Fantastic!

-------------------------------------------------------------------------

<a name="super-short"></a>
# Super-short intro to Meteor development

Meteor does a great job of briefly saying what they're all about [here](http://meteor.com/) and [here](http://docs.meteor.com/#sevenprinciples), but these are the few bits I think are most interesting and important:

* **same language and code on both client and server** - since both the client and the server are javascript, your brain doesn't have to switch ways of thinking - even better, often the code you right will run on both the client and the server (especially true of database code, where the client often has it's own version of the DB to act more quickly)
* **automatic page updates as data changes** - with it's "reactive" model what you see on the screen is based on what's in the database - as the data changes the screen is just auto-magically updated to match the new data (it can be pretty cool)
* **client-side "Session" object** - separate from the database, this client-side object allows one part of client to auto-magically display themselves based on data changed in another part of the client
* **rapid developments tools** - the Meteor team works hard to remove all developer friction" installing is quick, deploying to a live web server takes seconds, every source-code change causes automatic browser refreshes, lots of packages are waiting to simpley be "added"

-------------------------------------------------------------------------

<a name="quick-overview-hierarchy"></a>
# Quick overview of the toy-piano application hierarchy

In a browser, toy-piano looks like this:

![](https://github.com/BrentNoorda/toy-piano/blob/master/SLIDES/toy-piano-web.png?raw=true)

Created by these source files

    client - code that runs only on the client
        body
            body.html
            body.js
            body.less
        chat
            chat.html
            chat.js
            chat.less
        keyboard
            keyboard.html
            keyboard.js
            keyboard.less
        lib
            lib.js
            username.js
        common.less
        toy-piano.html
        toy-piano.less
    server - code that runs only on the server
        keypoke.js
    common - code that is common to client and server
        chat.js
    lib - code that is common to client and server
        lib.js
    public - static files delivered by the server
        a.mp3
        a.wav
        ... etc all the audio files for each note ...

There are a few very nice things to notice about the layout of these source files:

1. Except for these few top-level directories (client, server, common/lib, & public), Meteor doesn't care what hierarchy you use for your files. They're all going to get meshed into one big mass of data not matter where you place the files.
2. This allows one to group related files together by functional area, rather than by file type. I.E, in many systems it is common to group all `.js` files in one area, all `.css` files in another, and `.html` files in a third. Meteor does nothing to encourage such silliness.

### *What's good about this?*

This agnostic view of source hierarchy, along with the templating, makes it easy to group source files naturally the way the screen is grouped (e.g. everything related to "chat" is in one area of the screen and in one directory).

### *What's bad about this?*

Because Meteor gloms all the code together into a single page indiscriminately, and because of Meteor's emphasis on "reactivity", any user behavior in one part of the screen can easily cause a redraw of another, mostly-unrelated part of the screen (which can be an invisible performance problem frequently, and a visible problem when animations show up). This can lead to extra time debugging and muddying the clean templates with lots of   "{{#isolate}}" tags.

Another problem about everything being glommed together you pretty much lose control over load order. So if you're loading one js library that depends on another, you have to understand their poorly-documented load orders, or try to defer initializations with `Meteor.startup()` or jQuery's `$(document).ready()`.

-------------------------------------------------------------------------

<a name="interesting-bits"></a>
# The interesting bits of code in toy-piano

* **animating fade-ins for the chat window** - Meteor is great at creating and immediately updating a DOM to match the state of your data, but Meteor sucks when you want to animate transition states. [Read about Meteor animation kludges in toy-piano.](SLIDES/chatanimation.md)



## blah

### blah

#### blah


-------------------------------------------------------------------------

<a name="web-rec"></a>
# Recommendations for web developers - should you be using MeteorJS?


 this is a great environment for when the state of the data matches the state of the database


-------------------------------------------------------------------------

<a name="for-mdg-eyes-only"></a>
# Recommendations for Meteor Development Group - how to improve your product


microcosmic god


-------

*more info at [github:BrentNoorda/toy-piano](https://github.com/BrentNoorda/toy-piano)*




don't forget:

 * weird way passing size from less to html (hide chat time) and why doesn't meteor make that stuff easier?
 * how sending keystrokes
 * lots of latency stuff
 * DEBUG
 * when to use isolate, and when not
 * the freaking annoying double-display thing
 * they have this template thing going pretty well, but then it breaks where events are found (may as well use jquery)
 * add lots of template stuff as a side-effect (to avoid render?)
 * too much magic still (for example had to read lots of source code, put in alerts, etc...)
 * add feature to show what is being redrawn
 * our way or the highway
 * load order is annoying, how to make sure one thing is loaded before another
libraries might not all work exactly - need "smart packages"


 the meteor people need to make, and mimic, fraking real-worl web sites

------

&nbsp;&nbsp;&nbsp;&nbsp; [&lt;&lt; back](../README.md#interesting-bits)