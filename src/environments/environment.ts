// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  status: {
    QDECREATED: "1"
  },
  projectId: '3209f7ea7ba811e982270242ac110002',
 //projectId: 'ff8e364e6fce11e98754782bcb8f3845',
  api: {
    'dashboard': {
      'workflowId': '050f5c82789a11e982270242ac110002',
      'processId': '05282424789a11e982270242ac110002'
    },
    'lov': {
      'workflowId': '5f28d48c808311e982270242ac110002',
      'processId': '6569b6d6762911e982270242ac110003'
    },
    'save': {
      'workflowId': '0e40a79e762811e982270242ac110003',
      'processId': '0e5efe06762811e982270242ac110003'
    },
    'get': {
      'workflowId': 'aee31fb0764611e982270242ac110003',
      'processId': 'aefbaf62764611e982270242ac110003'
    },
    'roleLogin': {
      'workflowId': '021ced88708d11e98754782bcb8f3845',
      'processId': '021ced89708d11e98754782bcb8f3845'
    },
    "cityState": {
      'workflowId': '4ab7cb9a723511e982270242ac110003',
      'processId': '4b3c780e723511e982270242ac110003'
    },
    'payGate': {
      'workflowId': '7b222bb4837d11e982270242ac110002',
      'processId': '7b35abc6837d11e982270242ac110002'
    },
    'cibil': {
      'workflowId': '43b3853e86c411e982270242ac110002',
      'processId': '43d2719286c411e982270242ac110002'
    },
    "birthPlace": {
      'workflowId': '4ab7cb9a723511e982270242ac110003',
      'processId': 'af88d3c2724211e982270242ac110003'
    },
    "upload": {
      'workflowId': 'd9e7a808926f11e982270242ac110002',
      'processId': 'da00178a926f11e982270242ac110002'
    },
    "checkPan": {
      'workflowId': '7b222bb4837d11e982270242ac110002',
      'processId': '7b2ecfd6837d11e982270242ac110002'
    },
    "sendOTP": {
      'workflowId': 'b0b6796a7d5b11e982270242ac110002',
      'processId': 'b0cf09267d5b11e982270242ac110002'
    },
    "validateOTP": {
      'workflowId': 'b0b6796a7d5b11e982270242ac110002',
      'processId': '9b47e2808e6811e982270242ac110002'
    },
    "veiwFormSms": {
      'workflowId': '2a2343ba8f5811e982270242ac110002',
      'processId': '2a3bee068f5811e982270242ac110002'
    },
    "status": {
      'workflowId': '1d41cd0a8c4311e982270242ac110002',
      'processId': '1d5a18748c4311e982270242ac110002'
    }
  },
  userName: "icici@icici.com",
  password: "icici@123",
  // host: "http://182.156.249.170",
  appiyoDrive: "/appiyo/d/drive/upload/",
  //host: "http://192.168.1.108"
  host: "http://192.168.1.108",

  driveLocation: "/appiyo/d/drive/docs/"
  //host:""

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
