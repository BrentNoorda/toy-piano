/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Meteor, _, console, DEBUG*/

// keypoke.js - handle the server receiving key presses from individual clients, then
//              "broadcasting" that information to those clients.
//
// a lot of this is copied from the code in meteor/packages/tinytest/tinytest_server.js

var subscribedClients = {}; // will add publish "self" object based on runId
var forceUpdater = 0; // will cycle through a bunch of values just to force updates

Meteor.publish("keypokes", function(runId) {
    var self = this;
    if (!_.has(subscribedClients, runId))
    {
        subscribedClients[runId] = [self];
    }
    else
    {
        subscribedClients[runId].push(self);
    }

    self.onStop(function () {
        //console.log("removed keypokes client " + runId);
        subscribedClients[runId] = _.without(subscribedClients[runId], self);
        if ( subscribedClients[runId].length === 0 )
        {
            delete subscribedClients[runId];
        }
    });

    self.added('keypokes', runId, {idx:-1});
    if ( DEBUG )
    {
        console.log("added keypokes client " + runId);
    }

    self.ready();
});


Meteor.methods({
    addKeypoke: function (runId,keyIdx,username,tellMyself) {
        // tell all connected clients about this keystroke

        forceUpdater = ( forceUpdater + 1 ) % 100000;
        var fields = { idx:keyIdx, username:username, force: forceUpdater  };
        _.each(subscribedClients,function(clients,clientId) {
            _.each(clients,function(client,index) {
                if ( (clientId !== runId) || tellMyself )
                {
                    if ( DEBUG )
                    {
                        console.log("ALERT clientId " + clientId + " # " + index + " about keypoke");
                    }
                    client.changed('keypokes', clientId, fields);
                }
            });
        });
    }
});