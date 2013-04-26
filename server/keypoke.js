/*jslint white:false plusplus:false browser:true nomen:false */
/*globals Meteor, _, console*/
/* server management of the keypokes */

// a lot of this is copied from the code in meteor/packages/tinytest/tinytest_server.js

var subscribedClients = {}; // will add publish "self" object based on runId
var forceUpdater = 0; // will cycle through a bunch of values just to force updates

function showSubscribedClients()
{
    console.log('');
    console.log("subscribedClients:");
    _.each(subscribedClients,function(value,key) {
        var arrayOut = '';
        _.each(value,function(element,index){
            if ( index !== 0 )
            {
                arrayOut += ',';
            }
            arrayOut += 'subscriber';
        });
        console.log(" " + key + ':[' + arrayOut + ']');
    });
}


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
        console.log("removed keypokes client " + runId);
        subscribedClients[runId] = _.without(subscribedClients[runId], self);
        if ( subscribedClients[runId].length === 0 )
        {
            delete subscribedClients[runId];
        }
        showSubscribedClients();
    });

    self.added('keypokes', runId, {idx:-1});

    console.log("added keypokes client " + runId);
    showSubscribedClients();

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
                    console.log("ALERT clientId " + clientId + " # " + index + " about keypoke");
                    client.changed('keypokes', clientId, fields);
                }
            });
        });
    }
});