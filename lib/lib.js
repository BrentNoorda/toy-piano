/*jslint white:false plusplus:false browser:true nomen:false */
/*globals DEBUG:true, tidy_spaces:true, Meteor, process*/

// DEBUG is a global variable (client and server) to say whether we wand debug stuff to
// be happening.  Our default is that if we're on localhost then DEBUG=true, else on
// meteor.com then DEBUG is false, and we find that by looking for non-80 port.
DEBUG = undefined;
if (Meteor.is_server) {
    Meteor.startup(function () {
        var root_url, portIdx, port = '80';
        root_url = process.env.ROOT_URL.substring(6); // skip http: or https:
        portIdx = root_url.indexOf(':');
        if ( portIdx !== -1 )
        {
            port = root_url.substring(portIdx+1);
        }
        DEBUG = (port !== '80');
    });
    Meteor.methods({
        getDEBUG: function(){
            return DEBUG;
        }
    });
}
else
{
    Meteor.call("getDEBUG",function(err,result){
        DEBUG = result;
    });
}

tidy_spaces = function(s)
{
    return s.replace(/^\s+|\s+$/g, '');
};
