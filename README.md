toy-piano - learning about MeteorJS
===============

This is my first attempt to play with [MeteorJS](http://meteor.com/) and decide if it really is, as their website proclaims, "A better way to build apps."

Because Meteor demos emphasize the "live" nature of the environment, supporting any number of users editing simultaneously, I was curious to create something that would test the speed and "liveliness" of a multiuser app. So I built a toy piano where any time someone presses a key that keypress is broadcast to everyone who is logged in. If latency was low enough, I hoped, the people of the internet could play duets, or triplets, or infinets. *(oh what beautful music I hope we'll make)*

All of the [soure code is on github](https://github.com/BrentNoorda/toy-piano) and a live demo is here: [http://toy-piano.meteor.com/](http://toy-piano.meteor.com/)

# Running this code on your own computer

Here is the first area where MeteorJS really really shines: getting started is trivially fast (I hope all framework makers learn from this).



JSSince so many MeteoJS demo are built to

Playing around with MeteorJS. Curious about latency among multiple users, how to do animations in such a renderful environment, and such...

Demo: [http://toy-piano.meteor.com/](http://toy-piano.meteor.com/)



-------

*more info at [github:BrentNoorda/toy-piano](https://github.com/BrentNoorda/toy-piano)*




don't forget:

 * weird way passing size from less to html (hide chat time)
 * how sending keystrokes
 * lots of latency stuff
 * DEBUG
 * when to use isolate, and when not
 * the way to arrange files is super sweet (html with css with js) anywhere in the path
   -- another example, just create username.js and don't worrry about where to put it
 * the freaking annoying double-display thing
 * they have this template thing going pretty well, but then it breaks where events are found (may as well use jquery)
 * add lots of template stuff as a side-effect (to avoid render?)
 * too much magic still (for example had to read lots of source code, put in alerts, etc...)

 the meteor people need to make, and mimic, fraking real-worl web sites


 this is a great environment for when the state of the data matches the state of the database