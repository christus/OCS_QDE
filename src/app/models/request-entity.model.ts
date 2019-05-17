import Qde from "./qde.model";

export default class RequestEntity {
    processId : string;
    ProcessVariables : RequestBody;
    workflowId : string;
    projectId : string;
}

export class RequestBody {
    request : Qde;
}