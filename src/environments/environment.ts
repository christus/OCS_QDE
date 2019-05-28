// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  projectId: '3209f7ea7ba811e982270242ac110002',
  api: {
    'dashboard': {
      'workflowId': '050f5c82789a11e982270242ac110002',
      'processId': '05282424789a11e982270242ac110002'
    },
    'lov': {
      'workflowId': '5f28d48c808311e982270242ac110002',
      'processId': '6569b6d6762911e982270242ac110003'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
