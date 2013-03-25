/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Session, Random, amplify*/

// manage the username in html5 store and in Session

function set_username(username)
{
    username = tidy_spaces(username);
    if ( username.length === 0 )
    {
        username = amplify.store('username');
        if ( username === undefined )
        {
            // make up a random username
            username = "? " + Math.floor(Random.fraction() * 10000.0);
            amplify.store('username',username);
        }
    }
    amplify.store('username',username);
    Session.set('username',username);
}

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
