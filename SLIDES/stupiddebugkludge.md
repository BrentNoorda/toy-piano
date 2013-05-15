a client/server DEBUG variable based on environment <span style="float:right;"> [&#x25B2;](../README.md#interesting-bits)</span>
===============

I did some stupid code, and would like someone to give me a better solution.

### the problem

I like to be in either DEBUG state (in which case I assert stuff, write a lot more log files, patch jQuery to catch invalid selectors, etc...) or !DEBUG state (to run fast).

Since Meteor is so good about blending client and server code, it seemed I ought to be able to have a single place to detect if I'm running locally (and so want DEBUG=true) or at meteor.com (with DEBUG=false).

### my stupid solution

In [lib/lib.js](https://github.com/BrentNoorda/toy-piano/blob/master/lib/lib.js) is code for the server at startup to determine where it's running:

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

The the server publishes a method for the client to call to get this value:

    Meteor.methods({
        getDEBUG: function(){
            return DEBUG;
        }
    });

which the client then calls at startup:

    Meteor.call("getDEBUG",function(err,result){
        DEBUG = result;
    });

Already this is pretty silly. But it gets worse because when my client javascript loads I don't know if the above code, which returns asynchronously, has finished yet. So [client/lib/lib.js](https://github.com/BrentNoorda/toy-piano/blob/master/client/lib/lib.js) has this startup code just to wait for the DEBUG initialization code to finish:

    $(document).ready(function() {
        function alter_$_to_warn_if_selector_does_not_exist()
        {
            ...
        }

        function attach_jquery_warnings_if_we_are_debugging()
        {
            // sometimes this code might run before the server has told us we're debugging, so wait
            if ( DEBUG === undefined )
            {
                Meteor.setTimeout(attach_jquery_warnings_if_we_are_debugging,1);
            }
            else
            {
                ...
            }
        }
        attach_jquery_warnings_if_we_are_debugging();
    });

### a better solution

Well, what's a better solution?

------

&nbsp;&nbsp;&nbsp;&nbsp; [&lt;&lt; back](../README.md#interesting-bits)