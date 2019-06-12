// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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
      'workflowId': '7b222bb4837d11e982270242ac110002',
      'processId': '7b2ecfd6837d11e982270242ac110002'
    }
  },
  userName: "icici@icici.com",
  password: "icici@123"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
