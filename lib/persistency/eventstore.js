"use strict";

var EventStoreClient = require('event-store-client');
var EventEmitter = require('events').EventEmitter;

// details see https://github.com/x-cubed/event-store-client
var defaultOptions = {
    "server": {
        'host': "localhost",
        'port': "1113",
        'debug': false,
        'stream': 'bpmn-persist-process',
        'credentials': {
            'username': "admin",
            'password': "changeit"
        }
    },
    "persistedProcesses": []
};

/*
 * We have one global connection.
 * We follow the advice of the inventor of the MongoClient:
 *   "You open do MongoClient.connect once when your app boots up and reuse the db object. It's not a singleton connection pool each .connect creates a new connection pool. So open it once an reuse across all requests."
 *   Source: https://groups.google.com/forum/#!msg/node-mongodb-native/mSGnnuG8C1o/Hiaqvdu1bWoJ
 */
 var connection;
 var waitingForConnectionEventEmitters = {};
 var connectionEventName = 'connectionEventName';

/**
 * @param {String} uri
 * @param {*} options
 * @constructor
 */
 var Persistency = exports.Persistency = function(options) {
    this.options = options || defaultOptions;
    this.options.server = this.options.server || defaultOptions.server;

    if (this.options.logger) {
        this._trace = this.options.logger.trace || function() {};
    } else {
        this._trace = function() {};
    }
};

/**
 * @param {{processInstanceId: String}} persistentData
 * @param {Function} done
 */
 Persistency.prototype.persist = function(persistentData, done) {
    var connection = this._getConnection();

    var processId = persistentData.processId;
    var processName = persistentData.processName;
    var streamId = this._createStreamId(processId, processName);

    var newEvent = {
        eventId: EventStoreClient.Connection.createGuid(),
        eventType: 'PersistBPMN',
        data: persistentData
    };

    connection.writeEvents(streamId, EventStoreClient.ExpectedVersion.Any, false, [newEvent], this.options.server.credentials, function(completed) {
        if(completed.result == 0){ // 0 is code for success
            done(null, persistentData);
        }else{
            done(EventStoreClient.OperationResult.getName(completed.result)); // Return the error!
        }
    });
};

/**
 * @param {String} processId
 * @param {String} processName
 * @param done
 */
 Persistency.prototype.load = function(processId, processName, done) {
    var streamId = this._createStreamId(processId, processName);

    var connection = this._getConnection();
    connection.readStreamEventsBackward(streamId, -1, 1, false, true, null, this.options.server.credentials, function(completed) {
        if(completed.result == 1){ // NoStream error code
            done();
        }else{
            done(null, completed.events[0].data); // We only fetch last event, so first entry in array is fine.
        }
    });
};

/**
 * @param {String} processName
 * @param done
 */
 Persistency.prototype.loadAll = function(processName, done) {
    //throw new Error("not implemented");
    done(null, this.options.persistedProcesses);
};

/**
 * @param done
 */
 Persistency.prototype.close = function(done) {
    var connection = this._getConnection();
    if (connection) {
        connection.close();
        this.connection = undefined;
    }
    done();
};

Persistency.prototype._connect = function() {
    this.connection = new EventStoreClient.Connection(this.options.server);
};

/**
 * @returns {*}
 * @private
 */
 Persistency.prototype._getConnection = function() {
    if(!this.connection){
        this._connect();
    }
    return this.connection;
};

/**
 * Creates the stream ID to be used for the eventstore
 * @param  {string} processId   The process ID
 * @param  {string} processName The process Name
 * @return {string}             Stream ID
 */
 Persistency.prototype._createStreamId = function(processId, processName){
    return 'BPMNEngine_' + processName + '_' + processId;
}