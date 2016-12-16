/**
 * Copyright: E2E Technologies Ltd
 */
"use strict";

var FilePersistency = require('./file.js').Persistency;
var MongoDBPersistency = require('./mongodb.js').Persistency;
var EventStorePersistency = require('./eventstore.js').Persistency;

/**
 * @param {{type: String, uri: String, server: {}} options
 * Type can be:
 *  - file
 *  - mongo
 *  - eventstore
 * @constructor
 */
var Persistency = exports.Persistency = function(options) {
    var uri = options ? options.uri : null;
    var type = options ? options.type : null;
    
    if(!type){
      throw new Error("Persistency options must contain an type property.");
    }
    switch(type){
      case "mongo":
        if(!uri){
          throw new Error("Persistency options must contain an uri property.");
        }
        if(!uri.indexOf('mongodb://') === 0){
          throw new Error("Invalid mongodb uri, should start with 'mongodb://'.")
        }
        this.implementation = new MongoDBPersistency(uri, options);
        break;
      case "file":
        if(!uri){
          throw new Error("Persistency options must contain an uri property.");
        }
        this.implementation = new FilePersistency(uri);
        break;
      case "eventstore":
        this.implementation = new EventStorePersistency(options);
        break;
      default:
        throw new Error("Unknown persistency type. Available types are: mongo, file, eventstore.");
        break;
    }
};

/**
 * @param {{processInstanceId: String}} persistentData
 * @param {Function} done
 */
Persistency.prototype.persist = function(persistentData, done) {
    this.implementation.persist(persistentData, done);
};

/**
 * @param {String} processId
 * @param {String} processName
 * @param done
 */
Persistency.prototype.load = function(processId, processName, done) {
    this.implementation.load(processId, processName, done);
};

/**
 * @param {String} processName
 * @param done
 */
Persistency.prototype.loadAll = function(processName, done) {
    this.implementation.loadAll(processName, done);
};

/**
 * @param done
 */
Persistency.prototype.close = function(done) {
    this.implementation.close(done);
};
