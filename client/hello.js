/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Template, console */

Template.hello.greeting = function () {
    return "Welcome to gay-or-straight.";
};

Template.hello.events({
    'click input' : function () {
        // template data, if any, is available in 'this'
        if (typeof console !== 'undefined')
        {
            console.log("You pressed the button");
        }
    }
});

