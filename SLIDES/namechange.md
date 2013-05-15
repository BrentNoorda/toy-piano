toy-piano name-change field - simple Meteor reactive-template stuff <span style="float:right;"> [&#x25B2;](../README.md#interesting-bits)</span>
===============

You'll notice that the top of the screen changes from this display-current-name mode:

![](https://github.com/BrentNoorda/toy-piano/blob/master/SLIDES/showname.png?raw=true)

to this enter-name-mode:

![](https://github.com/BrentNoorda/toy-piano/blob/master/SLIDES/changename.png?raw=true)

based on what the user has done with the cursors.

Nothing fancy here, just Meteor template stuff found in [client/body code on github](https://github.com/BrentNoorda/toy-piano/tree/master/client/body).

In [body.html](https://github.com/BrentNoorda/toy-piano/blob/master/client/body/body.html) is:

    <h1>
        Hello
        <a href="javascript:void 0" id="display-username" {{{display_username_visibility}}}>{{username}}</a>
        <input value="{{username}}" id="enter-username" {{{enter_username_visibility}}}>
        . Let's play.
    </h1>

The main difference between the two states is whether the first field is visible, or the second field is visible.  That happens in [body.js](https://github.com/BrentNoorda/toy-piano/blob/master/client/body/body.js), where the templates return either one version or the other as "hidden":

    Template.body.display_username_visibility = function () {
        return ( Session.get('entering-username') ) ? 'class="hidden"' : '';
    };

    Template.body.enter_username_visibility = function () {
        return ( !Session.get('entering-username') ) ? 'class="hidden"' : '';
    };

Easy, right?

------

&nbsp;&nbsp;&nbsp;&nbsp; [&lt;&lt; back](../README.md#interesting-bits)