// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { environment as environmentProd } from './environment.prod';

export const environment = {
  version: environmentProd.version,
  buildDate: "",
  production: false,
  status: {
    QDECREATED: "1"
  },
  projectId: '5928d30eac7811e9a1670242ac110002', //developement

  //projectId: '3209f7ea7ba811e982270242ac110002', //production

  // projectId: 'ff8e364e6fce11e98754782bcb8f3845',

  apiVersion: {
    login: "v4/",
    api: "v2/"
  },

  logoutTime: 15,

  api: {
    'dashboard': {
      'workflowId': '050f5c82789a11e982270242ac110002',
      'processId': '05282424789a11e982270242ac110002'
    },
    'newLeads': {
      'workflowId': '9c388b88a6e911e9bce50242ac110002',
      'processId': '9c5a8562a6e911e985160242ac110002'
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
    "saveTermsAndCondition": {
      'workflowId': '17d45f6a90c411e982270242ac110002',
      'processId': '17f2f34e90c411e982270242ac110002'
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


    "paymentReconDownload": {
      'workflowId': '83ab8a8ca16911e9b1900242ac110003',
      'processId': '315870bad84111e99d440242ac110002'
    },
    "paymentNonReconDownload" : {
      'workflowId': '83ab8a8ca16911e9b1900242ac110003',
      'processId': '7230e902a21b11e9b52d0242ac110002'
    },
    "paymentOfflineDownload": {
      'workflowId': '57459ecc8cfd11e982270242ac110002',
      'processId': '575dd3d48cfd11e982270242ac110002'
    },
    "paymentReconUpload": {
      'workflowId': '83ab8a8ca16911e9b1900242ac110003',
      'processId': '83c3fd7ea16911e99a8f0242ac110003'
    },
    "offlinePaymentUpload" : { 
      'workflowId': 'f144eee2927f11e982270242ac110002',
      'processId': 'f17089c6927f11e982270242ac110002'
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
    },
    "adminPmayList": {
      'workflowId': 'ba0222ecb9c111e998f70242ac110002',
      'processId': 'f3af354cbcc411e9b5e00242ac110002'
    },
    "adminPmayRecord": {
      'workflowId': 'ba0222ecb9c111e998f70242ac110002',
      'processId': 'ee98cdb6ba6211e98c2a0242ac110002'
    },
    "adminAddPmayList": {
      'workflowId': 'ba0222ecb9c111e998f70242ac110002',
      'processId': 'ba1b1752b9c111e992ae0242ac110002'
    },
    "deletePmayRecord": {
      'workflowId': 'ba0222ecb9c111e998f70242ac110002',
      'processId': 'ba1b1752b9c111e992ae0242ac110002'
    },
    "adminCLSSUpdate": {
      'workflowId': '223a54c8b8e711e997f60242ac110002',
      'processId': '22534d7ab8e711e9b9de0242ac110002'
    },
    "deleteRecord": {
      'workflowId': '3189bc1eb50611e982a40242ac110002',
      'processId': '69bea66eb76b11e9b2e30242ac110002'
    },
    "adminGetBranchList": {
      'workflowId': '900c5bdcb82811e98dac0242ac110002',
      'processId': '1c67c2b4bb5411e9900d0242ac110002'
    },
    "adminGetBranchRecord": {
      'workflowId': '900c5bdcb82811e98dac0242ac110002',
      'processId': '66e48d08ba8811e9ba4c0242ac110002'
    },
    "adminAddBranchRecord": {
      'workflowId': '900c5bdcb82811e98dac0242ac110002',
      'processId': '902b508cb82811e996b80242ac110002'
    },
    "getCityLov": {
      'workflowId': 'e77f2900bcd111e9871a0242ac110002',
      'processId': 'e797e6b6bcd111e9ab9a0242ac110002'
    },
    "getZipLov": {
      'workflowId': 'e77f2900bcd111e9871a0242ac110002',
      'processId': 'f84cb0eebdc211e98e020242ac110002'
    },
    "adminLoanTypePurposeMap": {
      'workflowId': '923cb878b8d411e9a42f0242ac110002',
      'processId': 'f7c57d26bb5711e9b4160242ac110002'
    },
    "adminInsertUpdateLoanTypePurposeMap": {
      'workflowId': '923cb878b8d411e9a42f0242ac110002',
      'processId': 'cb3957bab8d611e989900242ac110002' 
    },
    "adminDocumentProfile": {
      'workflowId': '2565d5f4b8e311e996d50242ac110002',
      'processId': '4cd3a740bcbe11e9baf50242ac110002'
    },
    "adminUpdateDocumentProfile": {
      'workflowId': '2565d5f4b8e311e996d50242ac110002',
      'processId': '257e4aa8b8e311e993e80242ac110002'
    },
    "adminGetAllLoginFee": {
      'workflowId': '74907e5aba7211e985490242ac110002',
      'processId': '03ddc21ebb5111e9bc080242ac110002'
    },
    "adminUpdateLoginFee": {
      'workflowId': '74907e5aba7211e985490242ac110002',
      'processId': '74afdc8cba7211e9bf1a0242ac110002'
    },
    "adminGetAllLoanMaster": {
      'workflowId': '4d71bd12b81e11e998630242ac110002',
      'processId': '1311dc10bb5211e9b7460242ac110002'
    },
    "adminUpdateLoanMaster": {
      'workflowId': '4d71bd12b81e11e998630242ac110002',
      'processId': '4d90d742b81e11e984c60242ac110002'
    },
    "auditTrailUpdateAPI": {
      'workflowId': '98b55c00be8811e98e020242ac110002',
      'processId': '98ce328ebe8811e9b9a00242ac110002'
    },
    "getLoanPurposeFromLoanType": {
      'workflowId': '1d28844c72f011e982270242ac110003',
      'processId': 'cdec0538b83711e990590242ac110002'
    },
    "clssSearch": {
      'workflowId': '15985832c56711e9a0b00242ac110002',
      'processId': '15b0dceac56711e9b81a0242ac110002'
    },
    "downloadPdf": {
      'processId': 'a88fd316c4a111e993030242ac110002',
      'projectId': 'ff8e364e6fce11e98754782bcb8f3845'
    },
    "leadSave": {
      'workflowId': 'd848a7fca6e911e995e30242ac110002',
      'processId': 'd86751a2a6e911e98ad90242ac110002'
    },
    "mandatoryDocs": {
      'workflowId': '197cc83ec7c411e9bb0c0242ac110002',
      'processId': '1995b4cac7c411e985c10242ac110002'
    },
    "roleName" : {
      'workflowId': '8fdf0f40ca5911e9a0280242ac110002',
      'processId': '90003788ca5911e992030242ac110002'
    },
    "omniDocs" : {
      'workflowId': 'd9e7a808926f11e982270242ac110002',
      'processId': '605aa9d6b74a11e983250242ac110002'
    },
    "chequeDetails" : {
      'workflowId': 'b969b1908dd111e982270242ac110002',
      'processId': 'b981f6928dd111e982270242ac110002'
    },
    "getApplicationStatus" : {
      'workflowId': '1d41cd0a8c4311e982270242ac110002',
      'processId': '653e21a6d48e11e981c20242ac110002'
    },
    "getApplications" : {
      'workflowId': 'acd78f24cf0311e991e50242ac110002',
      'processId': '9747382ce5aa11e9910c0242ac110002'
    },  
    "reAssignApplications" : {
      'workflowId': 'acd78f24cf0311e991e50242ac110002',
      'processId': 'aceffe2ecf0311e9829f0242ac110002'
    },   
    "getUsers" : {
      'workflowId': '46111230e45011e9935a0242ac110002',
      'processId': '462cc00ce45011e9abed0242ac110002'
    },
    "getErrorIdMessage" :{
      'workflowId': 'a6a43e0ccfc311e9a3b50242ac110002',
      'processId': 'cec4fac0d46411e9bed10242ac110002'
    },
    "getErrorMessage" : {
      'workflowId': 'a6a43e0ccfc311e9a3b50242ac110002',
      'processId': 'be09a9cad08f11e99b810242ac110002'
    },
    "updateErrorMessage" :{
      'workflowId': 'a6a43e0ccfc311e9a3b50242ac110002',
      'processId': 'a6c2d402cfc311e99a490242ac110002'
    },
    "flashExitingData" :{
      'workflowId': '99cad862dac211e9a4f70242ac110002',
      'processId': '99e5af3edac211e9929c0242ac110002'
    },
    "adminApplicantRelationship": {
      'workflowId': '3c5a465adeb311e9821f0242ac110002',
      'processId': 'fee20736decb11e99bf10242ac110002'
    },
    "adminUpdateApplicantRelationship": {
      'workflowId': '3c5a465adeb311e9821f0242ac110002',
      'processId': '3c723bd4deb311e9b8de0242ac110002'
    },
    "getApplicantRelationships": {
      'workflowId': 'ce7466e6dec311e9a0b20242ac110002',
      'processId': 'cec7c4d0dec311e994980242ac110002'
    },
    "assessmentListForProfileApplicantType": {
      'workflowId': '0705a6c4810311e982270242ac110002',
      'processId': '29a0c746e11511e995dc0242ac110002'
    },
    "checkOccupationType" :{
      'workflowId': '82ce648ae10c11e9b7730242ac110002',
      'processId': '82ed99d6e10c11e9b3d00242ac110002'
    },
    "downloadAuditTrail": {
      'workflowId': '6d02a184e41811e987550242ac110002',
      'processId': '6d1b4b1ce41811e9aaf90242ac110002'
    },
    "usersLov": {
      'workflowId': '1afeb32ab8dd11e9a7520242ac110002',
      'processId': '1b175d3ab8dd11e988a00242ac110002'
    },
    "downloadLeads" : { 
      'workflowId': '6f9d4872e37811e991630242ac110002',
      'processId': '6fbc9484e37811e9b0470242ac110002',
      'projectId': 'ff8e364e6fce11e98754782bcb8f3845'
    },
    "downloadLogin" : {
      'workflowId': '4b639b98e41611e99a460242ac110002',
      'processId': '4b702584e41611e9b36c0242ac110002',
      'projectId': 'ff8e364e6fce11e98754782bcb8f3845'
    },
    "downloadDump" : {
      'workflowId': '154273f0e44c11e9abed0242ac110002',
      'processId': '155b02bce44c11e987550242ac110002',
      'projectId': 'ff8e364e6fce11e98754782bcb8f3845'
    },
    "filtersForDownload": { 
      'workflowId': '46111230e45011e9935a0242ac110002',
      'processId': '462cc00ce45011e9abed0242ac110002'
    },
    "getOccupationLov": { 
      'workflowId': 'd6a7a3d8ee6711e99c870242ac110002',
      'processId': 'd6c0505eee6711e98e850242ac110002'
    },
    "adminGetLov":{
      'workflowId': '412f2232faff11e9b71e0242ac110002',
      'processId' : '41481940faff11e9b5560242ac110002'
    },
    "uploadCSV":{
      'workflowId': 'f17089c6927f11e982270242ac110002',
      'processId' : '66145102ca6311e9bd540242ac110002'
    },
    "checkCompanyDetails":{
      'workflowId': '16c6f24efbaa11e9b4290242ac110002',
      'processId' : '16e1cefcfbaa11e9949c0242ac110002'
    },
    
  },
  userName: "icici@icicibankltd.com",
  password: "icici@123",
  appiyoDrive: "/d/drive/upload/",
  host: "http://192.168.1.108/appiyo",
  iciciDomainExt: "@icicibankltd.com",
  ocsHost: "http://192.168.1.108/ocs",
  // host: "http://182.156.249.170/appiyo",
  //host: "https://ihfcmobileuat.icicihfc.com/appiyo",
  driveLocation: "/d/drive/docs/",
  csvLocation: "/d/download/csv?",
  isMobile: false,
  mobileExtenstion: "@icicibankltd.com",
  // tslint:disable-next-line: max-line-length
  // tslint:disable-next-line: quotemark
  // tslint:disable-next-line: max-line-length
  aesPublicKey: 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==',
  encryptionType: true, // Ecryption
  // host: ""
  captchFormat: "&width=250&height=80&bgr=255&bgg=255&bgb=255&bga=255&fontR=187&fontG=187&fontB=187&fontSize=50&captchaSize=5",
  defaultItem:{key:"Select...",value:"0"}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
