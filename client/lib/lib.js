/*jslint white:false plusplus:false browser:true nomen:false */
/*globals alert, $, window, DEBUG, Meteor*/

$(document).ready(function() {
    function alter_$_to_warn_if_selector_does_not_exist()
    {
        // change the $ version of jQuery so that if a selector is not found it writes
        // to the console. This is real useful for catching errors or even typos during
        // development.  If you want the original NOP version of jQuery for a particular
        // call then use jQuery.
        var prop, original_$;
        original_$ = $;
        function myjQuery() {
            var res = original_$.apply(this, arguments), msg, idx;
            if (!res.length) {
                msg = 'JQUERY $ ELEMENT ERROR: Could not match selector "';
                for ( idx = 0; idx < arguments.length; idx++ )
                {
                    msg += (idx === 0 ? '' : ' ') + arguments[idx];
                }
                msg += '"';
                if ( window.console && window.console.error )
                {
                    window.console.error(msg);
                }
                else
                {
                    alert(msg);
                }
            }
            return res;
        }
        for ( prop in original_$ )
        {
            if ( original_$.hasOwnProperty(prop) )
            {
                myjQuery[prop] = original_$[prop];
            }
        }
        window.$ = myjQuery;
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
            if ( DEBUG )
            {
                alter_$_to_warn_if_selector_does_not_exist();
            }
        }
    }
    attach_jquery_warnings_if_we_are_debugging();
});
