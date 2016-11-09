// Type definitions for bpmn 0.2.2
// Project: bpmn
// Definitions by: Guy Spronck (https://github.com/guyspronck)

/*~ 
 *~ Interfaces
 */

interface Descriptor{
	name: string;
	id: string;
}

interface ProcessManagerOptions{
	handlerFilePath?:{
		name: string;
		filePath: string;
	};
	handlerString?:{
		name: string;
		string: string;
	};
	handler?:{
		name: string;
		module: any;
	};
	bpmnFilePath?: string[];
	persistencyOptions?: {
		uri: string;
	};
	bpmnXML?: {
		name: string;
		xml: string;
	}
}

/*~ 
 *~ Classes
 */

export class Bpmn {
     createUnmanagedProcess(bpmnFilePath: string, callback: (err, process: BPMNProcess) => any): void;
	 createUnmanagedProcessFromXML(bpmnXML: string, handler: string, callback: (err, process: BPMNProcess) => any): void;
	 createUnmanagedProcessFromXML(bpmnXML: string, handler: any, callback: (err, process: BPMNProcess) => any): void;
	 createUnmanagedCollaboratingProcesses(bpmnFilePath: string, callback: (err, process: BPMNProcess) => any): void;
	 createUnmanagedCollaboratingProcessesFromXML(bpmnXML: string, handler: string, callback: (err, process: BPMNProcess) => any): void;
	 createUnmanagedCollaboratingProcessesFromXML(bpmnXML: string, handler: any, callback: (err, process: BPMNProcess) => any): void;
	 mapName2HandlerName(bpmnName:string): string;
	 getBPMNDefinitions(bpmnFilePath: string, cache: boolean): any;
}

export class BPMNProcess{
	triggerEvent(eventName: string, data?:any): void;
	taskDone(taskName: string, data?:any): void;
	getState(): any;
	getHistory(): any;
	setProperty(name: string, value:any):void;
	getProperty(name: string): any;
	getParentProcess(): BPMNProcess;
	getParticipantByName(participantName: string): BPMNProcess;
	setLogLevel(logLevel:number):void;
	setLogLevel(logLevel:string):void;
}

export class ProcessManager {
    constructor(options?: ProcessManagerOptions);

	addHandlerFilePath(name: string, handlerFilePath:string): void;
	addHandlerString(name: string, handlerString:string): void;
	addHandler(name: string, handler:string): void;
	addBpmnFilePath(bpmnFilePath: string, processHandler:string): void;
	addBpmnFilePath(bpmnFilePath: string, processHandler:any): void;
	addBpmnXML(bpmnXml: string, processName: string, processHandler: string): void;
	addBpmnXML(bpmnXml: string, processName: string, processHandler: any): void;
	
	createProcess(descriptors: string, callback: (err, process: BPMNProcess) => any): void;
	createProcess(descriptors: Descriptor, callback: (err, process: BPMNProcess) => any): void;
	createProcess(descriptors: Descriptor[], callback: (err, process: BPMNProcess) => any): void;

	get(processId: string, callback: (err, process: BPMNProcess) => any): void;
	getAllProcesses(callback: (err, processes:BPMNProcess[]) => any): void;
	findByState(stateName: string, callback: (err, processes:BPMNProcess[]) => any): void;
	findByProperty(query: any, callback: (err, processes:BPMNProcess[]) => any): void;
	findByName(processName: string, caseSensitive:boolean, callback: (err, processes:BPMNProcess[]) => any): void;

	createServer(): any;
}