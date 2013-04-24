/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Session, Random, amplify, tidy_spaces, set_username:true*/

// manage the username in html5 store and in Session

set_username = function(username)
{
    username = tidy_spaces(username);
    if ( username.length === 0 )
    {
        username = amplify.store('username');
        if ( (username === undefined) || (username.length === 0) )
        {
            // make up a random username
            username = "? " + Math.floor(Random.fraction() * 10000.0);
            amplify.store('username',username);
        }
    }
    amplify.store('username',username);
    Session.set('username',username);
};

function init_username()
{
    var username = amplify.store('username');
    if ( username === undefined )
    {
        username = '';
    }
    set_username(username);
}

init_username();
