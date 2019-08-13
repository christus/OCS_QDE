// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  version: "0.0.0",
  buildDate: "",
  production: false,
  status: {
    QDECREATED: "1"
  },
  projectId: '5928d30eac7811e9a1670242ac110002', //developement

 // projectId: '3209f7ea7ba811e982270242ac110002', //production

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
      'processId': '1c34e0c8a92611e9a4bd0242ac110002'
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
    },
    "applicableDocuments": {
      'workflowId': '0705a6c4810311e982270242ac110002',
      'processId': '071e0f5c810311e982270242ac110002'
    },
    "clss": {
      'workflowId': '8dc189f485df11e982270242ac110002',
      'processId': '8de0689285df11e982270242ac110002'
    },
    "loginfee": {
      'workflowId': 'f512f03a8ea311e982270242ac110002',
      'processId': 'f53166328ea311e982270242ac110002'
    },
    "aps": {
      'workflowId': '46f4c44490f911e982270242ac110002',
      'processId': '4719724e90f911e982270242ac110002'
    },
    "reviewEligibility": {
      'workflowId': 'ec16befc9f1b11e9a0040242ac110003',
      'processId': 'ec2f4f089f1b11e9b0c20242ac110003'
    },
    "mPINLogin": {
      'workflowId': '6cf36ddca16911e984730242ac110003',
      'processId': '6d12051ca16911e9be500242ac110003'
    },
    "resetMPIN": {
      'workflowId': '6cf36ddca16911e984730242ac110003',
      'processId': 'a444f89aa22811e984060242ac110002'
    },
    "ops": {
      'workflowId': '471f4154a3a211e9abab0242ac110002',
      'processId': '473800cca3a211e989e10242ac110002'
    },
    "paymentRecon": {
      'workflowId': '83ab8a8ca16911e9b1900242ac110003',
      'processId': '7230e902a21b11e9b52d0242ac110002'
    },
    "paymentReconUpload": {
      'workflowId': '83c3fd7ea16911e99a8f0242ac110003',
      'processId': '83c3fd7ea16911e99a8f0242ac110003'
    },
    "duplicateApplicantCheck": {
      'workflowId': '471f4154a3a211e9abab0242ac110002',
      'processId': '473800cca3a211e989e10242ac110002'
    },
    "executePayment": {
      'workflowId': '49fa2570a22a11e9a2f80242ac110002',
      'processId': '4a1b6398a22a11e998e90242ac110002'
    },
    "adminGetUsers": {
      'workflowId': '30d9085ead3311e9a3ae0242ac110002',
      'processId': '27e68b8cb9b211e9b40d0242ac110002'
    },
    "adminAddUser": {
      'workflowId': '30d9085ead3311e9a3ae0242ac110002',
      'processId': '07906c06ad4e11e9a7f80242ac110002'
    },
    "adminUpdateUser": {
      'workflowId': '30d9085ead3311e9a3ae0242ac110002',
      'processId': '92bab630adf611e998450242ac110002'
    },
    "adminUserLOV": {
      'workflowId': '4c1a5e74b84611e988b70242ac110002',
      'processId': '4c2dcd56b84611e98b890242ac110002'
    },
    "adminListOfValues": {
      'workflowId': '3189bc1eb50611e982a40242ac110002',
      'processId': '31a9c2c0b50611e9a0150242ac110002'
    },
    "adminGetEachLov": {
      'workflowId': '3189bc1eb50611e982a40242ac110002',
      'processId': 'dcb96e9ab50611e9b6d80242ac110002'
    },
    "adminInsertUpdateEachLov": {
      'workflowId': '3189bc1eb50611e982a40242ac110002',
      'processId': '174399a6b50b11e9be530242ac110002'
    },
    "adminSoftDeleteLov": {
      'workflowId': '3189bc1eb50611e982a40242ac110002',
      'processId': '69bea66eb76b11e9b2e30242ac110002'
    },
    "adminGetUser": {
      'workflowId': '30d9085ead3311e9a3ae0242ac110002',
      'processId': 'bb2f6f8eb84611e980970242ac110002'
    },
    "adminReportingTo": {
      'workflowId': '1afeb32ab8dd11e9a7520242ac110002',
      'processId': '1b175d3ab8dd11e988a00242ac110002'
    },
    "adminStatesZonesLovs": {
      'workflowId': '4c1a5e74b84611e988b70242ac110002',
      'processId': '4c2dcd56b84611e98b890242ac110002'
    },
    "adminGetZoneFromState": {
      'workflowId': '2351a8c2ba7511e9b7b30242ac110002',
      'processId': 'ecae1acebaad11e98a370242ac110002'
    },
    "adminGetCityFromZone": {
      'workflowId': '2351a8c2ba7511e9b7b30242ac110002',
      'processId': '2dffe0ccba7511e98e4f0242ac110002'
    },
    "adminCLSSGet": {
      'workflowId': '223a54c8b8e711e997f60242ac110002',
      'processId': '26c4fe6cb9c311e9bcfb0242ac110002'
    }
  },
  userName: "icici@icici.com",
  password: "icici@123",
  appiyoDrive: "/d/drive/upload/",
  host: "http://192.168.1.108/appiyo",
  // host: "http://182.156.249.170/appiyo",
  //host: "https://ihfcmobileuat.icicihfc.com/appiyo",
  driveLocation: "/d/drive/docs/"
  //host: ""

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.