/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Template, console*/

Template.test.greeting = function () {
    return "Welcome to toy-piano";
};

Template.test.events({
    'click input' : function () {
        // template data, if any, is available in 'this'
        if (typeof console !== 'undefined')
        {
            console.log("You pressed the button");
        }
    }
});

