/*jslint white:false plusplus:false browser:true nomen:false */
/*globals DEBUG:true, tidy_spaces:true*/

DEBUG = 12;   // else must be false

tidy_spaces = function(s)
{
    return s.replace(/^\s+|\s+$/g, '');
};
