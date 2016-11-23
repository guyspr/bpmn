/**
 * Copyright: E2E Technologies Ltd
 */
"use strict";

var parserUtils = require("./parserUtils");

/**
 * @param node
 * @constructor
 */
exports.createBPMNFlowNodeRef = function(node) {
    var getValue = parserUtils.getAttributesValue;
    return (new BPMNFlowNodeRef(
        node.local
    ));
};

/**
 * @param localName name without namespace prefix
 * @return {Boolean}
 */
exports.isFlowNodeRefName = function(localName) {
    return (localName.toLowerCase() === "flownoderef");
};

/**
 * Subsumes all kind of tasks
 * @param {String} bpmnId
 * @param {String} name
 * @param {String} type
 * @constructor
 */
var BPMNFlowNodeRef = exports.BPMNFlowNodeRef = function(type) {
    this.type = type;
    this.value = "";
};