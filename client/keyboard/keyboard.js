/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Template, console*/

Template.keyboard.greeting = function () {
    return "Welcome to toy-piano";
};

Template.keyboard.events({
    'click input' : function () {
        // template data, if any, is available in 'this'
        if (typeof console !== 'undefined')
        {
            console.log("You pressed the button");
        }
    }
});

