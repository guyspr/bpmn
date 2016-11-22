/**
 * Copyright: E2E Technologies Ltd
 */
"use strict";

var parserUtils = require("./parserUtils");

/**
 * @param node
 * @constructor
 */
exports.createBPMNLane = function(node) {
    var getValue = parserUtils.getAttributesValue;

    return (new BPMNLane(
        getValue(node, "id"),
        getValue(node, "name")
    ));
};

/**
 * @param localName name without namespace prefix
 * @return {Boolean}
 */
exports.isLaneName = function(localName) {
    return (localName.toLowerCase() === "lane");
};

/**
 * Subsumes all kind of tasks
 * @param {String} bpmnId
 * @param {String} name
 * @param {String} type
 * @constructor
 */
var BPMNLane = exports.BPMNLane = function(bpmnId, name) {
    this.bpmnId = bpmnId;
    this.name = name;
    this.flowNodeRefs = [];
};

BPMNLane.prototype.addFlowNodeRefs = function(flowNodeRef) {
    this.flowNodeRefs.push(flowNodeRef);
};