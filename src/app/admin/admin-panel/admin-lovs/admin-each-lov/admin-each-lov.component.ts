import { Component, OnInit, ViewChildren, ElementRef, QueryList, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Item } from 'src/app/models/qde.model';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { json } from 'sjcl';

@Component({
  selector: 'admin-each-lov',
  templateUrl: './admin-each-lov.component.html',
  styleUrls: ['./admin-each-lov.component.css']
})
export class AdminEachLovComponent implements OnInit, AfterViewInit {

  lovs: Array<any> = [];
  tempLovs: Array<any> = [];
  // previousLength: number;
  tableName: string;
  isApplicantTitle: boolean;
  isDocumentCategory: boolean;
  totalPages:string;
  totalItems:number;
  currentPage: string;
  perPage:string;
  searchKey:string="";
  key:Array<number>=[];
  lastKey: number;
  isErrorModal: boolean = false;
  errorMsg: string;
  isLoanPurpose:boolean = false;
  isFinancialApplicant: boolean = false;
  isMale: boolean;
  isConfirmModal : boolean;
  isUserAtivity: boolean = false;
  delIndex;
responseData;

  @ViewChildren('lovsElements') lovsElements: QueryList<ElementRef>;
  public activityLists: Array<any>;
  public userActivityList: Array<any> ;
  public selectedRoleActivity = {};
  myCall: any;

  


  constructor(private route: ActivatedRoute,
              private qdeHttp: QdeHttpService,              
              private ren: Renderer2) {
                

    this.route.params.subscribe(v => {
      this.tableName = v['eachLovName']
      this.isApplicantTitle = this.tableName == 'applicant_title' ? true: false;
      this.isDocumentCategory = this.tableName == 'document_category' ? true: false;
      this.isLoanPurpose = this.tableName == 'loan_purpose' ? true : false;
      this.isFinancialApplicant = this.tableName == 'profile' ? true : false;
      this.isMale = this.tableName == 'profile' ? true : false;
      this.isUserAtivity = this.tableName == "user_role"? true : false;
      if (this.tableName== "user_role"){
        
        console.log("resolve data", this.route.snapshot.data);     


        // this.activityLists = JSON.parse(this.route.snapshot.data["roleLovs"]['ProcessVariables']["lovs"])["LOVS"]["activity"];activityList
        // this.activityLists = JSON.parse(this.route.snapshot.data["eachLovs"]['ProcessVariables']["activityList"])
        console.log("Type",this.activityLists);       
        
        
      }
    });
    

    let response = this.route.snapshot.data['eachLovs'];

    if(this.route.snapshot.data['eachLovs']['ProcessVariables']['status'] == true) {
      if(this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription'] && this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription'].length > 0 ) {
        console.log(this.route.snapshot.data['eachLovs']['ProcessVariables']);
        console.log(this.route.snapshot.data['eachLovs']['ProcessVariables']['perPage']);
        console.log(this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages']);
        this.activityLists = this.route.snapshot.data["eachLovs"]['ProcessVariables']["activityList"]
        console.log("activity List",this.activityLists);   
        this.perPage = this.route.snapshot.data['eachLovs']['ProcessVariables']['perPage'];
        this.currentPage = this.route.snapshot.data['eachLovs']['ProcessVariables']['currentPage'];
        this.totalPages = this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages'];
        this.totalItems = parseInt(this.perPage)*parseInt(this.totalPages);
        this.tempLovs = this.lovs = this.getLovMap(this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription']);
         
        // console.log("this.activityLists", this.activeRout.snapshot.data);
        // this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription'].map((v, i) => {

        //   return {
        //     userId: localStorage.getItem('userId'),
        //     description: v['description'],
        //     value: v['value'],
        //     isEdit: true,
        //     id: v['id'],
        //     male: v['male'],
        //     female: v['female'],
        //     tableName: this.tableName,
        //     isRequired: v['isRequired'],
        //     reqBoolean : v['reqBoolean'],
        //     isMale : v['isMale'],
        //     activityLists: v['activityId']
            
        //   }
        // });
        for(var i=0; i<this.lovs.length;i++){
          this.key[i]=((parseInt(this.perPage)*(parseInt(this.currentPage)-1))+i+ 1);
        }
      } else {
        this.isErrorModal = true;
        this.errorMsg='No Data Found';
      }
    }
  }

  ngOnInit() {
    

  }

  save(index) {

    console.log(this.lovs[index].description);
    if(this.lovs[index].description != '' && this.lovs[index].value != '') {

      if(this.lovs[index].tableName == 'applicant_title' && (this.lovs[index].male == false && this.lovs[index].female == false)) {
        this.isErrorModal = true;
        this.errorMsg='Please enter all values';
        //alert("Please enter all values");
        //this.refresh();
      }else{
        let data ;
        if(this.tableName == "user_role"){
          console.log("index Value ",this.lovs[index])
          data = { 
            userId: this.lovs[index].userId,
              tableName: "user_role",             
              value: this.lovs[index].value,
              isEdit: true,
              description: this.lovs[index].description,              
              id: 13,
              activityLists: this.selectedRoleActivity[index]
          }
        } else{
          data = this.lovs[index];
        }
        // console.log("index Value ",this.lovs[index]);
         console.log("index Value ",data);


      this.qdeHttp.insertUpdateEachLovs(this.lovs[index]).subscribe(res => {
        if(res['ProcessVariables']['status'] == true) {
          console.log(this.lovs[index]);
          this.lovs[index].isEdit = true;
          this.lovs[index].id = res['ProcessVariables']['id'];
        } 
		/* else if(res['ProcessVariables']['errorMessage'] != "") {
          //this.refresh();
          this.isErrorModal = true;
          this.errorMsg=res['ProcessVariables']['errorMessage'];
          //alert(res['ProcessVariables']['errorMessage']);
        } */
      });
    }
    } else {
      console.log(this.lovs[index]);
      this.isErrorModal = true;
      this.errorMsg="Please enter all values";
      //alert("Please enter all values");
      this.refresh();
    }
    this.tempLovs = this.lovs;
  }

  addNew() {
    this.qdeHttp.adminLoadMoreLovs(this.tableName, parseInt(this.totalPages), parseInt(this.perPage),this.searchKey).subscribe(res => {
      if (res['ProcessVariables']['status'] == true) {
        if (res['ProcessVariables']['valueDescription'] && res['ProcessVariables']['valueDescription'].length > 0) {
          this.lovs.push({tableName: this.tableName, userId: localStorage.getItem('userId'), description: '', value: '', isEdit: false, male: false, female: false});
          this.tempLovs = this.getLovMap(res['ProcessVariables']['valueDescription']);
          
          // res['ProcessVariables']['valueDescription'].map((v, i) => {
          //   return {
          //     userId: localStorage.getItem('userId'),
          //     description: v['description'],
          //     value: v['value'],
          //     isEdit: true,
          //     id: v['id'],
          //     male: v['male'],
          //     female: v['female'],
          //     tableName: this.tableName,
          //     isRequired: v['isRequired'],
          //     reqBoolean : v['reqBoolean'],
          //     isMale : v['isMale'],
          //     activityLists: v['activityId']
          //   }
          // });
          this.lastKey = (parseInt(this.perPage)*(parseInt(this.totalPages)-1))+this.tempLovs.length+1;
          console.log(this.lastKey);
          this.key.push(this.lastKey);
        }
      }
    })
  }

  getLovMap(obj) {
    let myLovs = obj.map((v, i) => {
      return {
        userId: parseInt(localStorage.getItem('userId')),
        tableName: this.tableName,
        cityId: v['cityId'],
        cityName: v['cityName'],
        value: v['value'],
        isEdit: true,
        description: v['description'],
        isRequired: v['isRequired'],
        id: v['id'] ? v['id'] : null,
        stateId: v['stateId'],
        stateName: v['stateName'],
        zone: v['zone'],
        zoneName: v['zoneName'],
        reqBoolean : v['reqBoolean'],
        isMale : v['isMale'],
        activityLists: v['activityId']!= null? this.getActivityObject(v['activityId']):null 
      }
    });

  console.log('activity list',myLovs["activityLists"]);
  return myLovs;
  }


  getActivityObject(aList){
    let getStringList: string = aList
    let selectActivity: Array<any> = getStringList.split(",");
    let myList=[];
    console.log("arry list length ",this.activityLists.length);
    if (selectActivity.length>0 &&  this.activityLists.length >0 ){
        selectActivity.forEach((d) => {
          this.activityLists.forEach( (obj)=> {
              if (d== obj.key){
                  console.log("ddd",obj)
                  myList.push(obj);
                  }}
              )});
            }
          

    console.log('conveted Object',myList) ;
          return myList;

  }
  ngAfterViewInit() {
    // this.previousLength = this.tempLovs.length;

    // this.lovsElements.changes.subscribe(e => {
    //   if(this.previousLength < e.length) {
    //     e.last.nativeElement.focus();
    //   }
    //   this.previousLength = e.length;
    // });
  }

  delete(index) {
    this.delIndex = this.lovs[index];
    this.isConfirmModal = true; 
  }

  confirmDelete(){
        this.isConfirmModal = false;
        this.qdeHttp.softDeleteLov(this.delIndex).subscribe(res => {
          this.refresh();
        });
        this.tempLovs = this.lovs;
  }


  search(event) {
    let dude = {
      tableName: this.tableName,
      searchKey: event.target.value,
      userId: parseInt(localStorage.getItem('userId')),
    };

    this.qdeHttp.adminZipCodeSearch(dude).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        if(res['ProcessVariables']['valueDescription']) {
          console.log(res['ProcessVariables']['perPage']);
          console.log(res['ProcessVariables']['currentPage']);
          console.log(res['ProcessVariables']['totalPages']);
          this.perPage = res['ProcessVariables']['perPage'];
          this.currentPage = res['ProcessVariables']['currentPage'];
          this.totalPages = res['ProcessVariables']['totalPages'];
          this.totalItems = parseInt(this.perPage) * parseInt(this.totalPages);
          this.lovs = this.getLovMap(res['ProcessVariables']['valueDescription']);
          // res['ProcessVariables']['valueDescription'].map((v, i) => {
          //   return {
          //     userId: parseInt(localStorage.getItem('userId')),
          //     tableName: this.tableName,
          //     cityId: v['cityId'],
          //     cityName: v['cityName'],
          //     value: v['value'],
          //     isEdit: true,
          //     description: v['description'],
          //     isRequired: v['isRequired'],
          //     id: v['id'] ? v['id'] : null,
          //     stateId: v['stateId'],
          //     stateName: v['stateName'],
          //     zone: v['zone'],
          //     zoneName: v['zoneName'],
          //     reqBoolean : v['reqBoolean'],
          //     isMale : v['isMale']
          //   }
          // });
          for(var i=0; i<this.lovs.length;i++){
            this.key[i]=((parseInt(this.perPage)*(parseInt(this.currentPage)-1))+i+ 1);
          }
        } else {
        this.isErrorModal = true;
        this.errorMsg='No Data Present Further';
          //alert('No Data Present Further');
        }
      } 
	  /* else {
        this.isErrorModal = true;
        this.errorMsg='No Data Present Further';
          //alert('No Data Present Further');
      } */
    });
  
  }

  edit(index) {
    this.lovs[index].isEdit = false;
    console.log(this.lovsElements['_results'][index]);
    this.lovsElements['_results'][index]['nativeElement'].focus();
  }

  changeGender(n: number, index) {
    if(n == 1) {
      this.lovs[index].male = true;
      this.lovs[index].female = false;
    } else if(n == 2) {
      this.lovs[index].male = false;
      this.lovs[index].female = true;
    } else {
      this.lovs[index].male = true;
      this.lovs[index].female = true;
    }
  }

  changeIsRequired(n: string, index) {
    this.lovs[index].isRequired = (n=='1') ? '1': '0';
  }
  changeIsPropertyIdentified(event,index){
    this.lovs[index].reqBoolean = event.target.checked;
  }
  changeIsFinancialApplicant(event, index){
    this.lovs[index].reqBoolean = event.target.checked;
  }

  changeIsMale(event, index){
    this.lovs[index].isMale = event.target.checked;
  }

  refresh() {
    this.searchKey="";
    this.qdeHttp.adminLoadMoreLovs(this.tableName).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        if(res['ProcessVariables']['valueDescription'] && res['ProcessVariables']['valueDescription'].length > 0) {
          console.log(res['ProcessVariables']['perPage']);
          console.log(res['ProcessVariables']['currentPage']);
          console.log(res['ProcessVariables']['totalPages']);
          this.perPage = res['ProcessVariables']['perPage'];
          this.currentPage = res['ProcessVariables']['currentPage'];
          this.totalPages = res['ProcessVariables']['totalPages'];
          this.totalItems = parseInt(this.perPage) * parseInt(this.totalPages);
          this.tempLovs = this.lovs = this.getLovMap(res['ProcessVariables']['valueDescription']);
          // .map((v, i) => {

          //   return {
          //     userId: localStorage.getItem('userId'),
          //     description: v['description'],
          //     value: v['value'],
          //     isEdit: true,
          //     id: v['id'],
          //     male: v['male'],
          //     female: v['female'],
          //     tableName: this.tableName,
          //     isRequired: v['isRequired'],
          //     reqBoolean : v['reqBoolean'],
          //     isMale : v['isMale']
          //   }
          // });
          for(var i=0; i<this.lovs.length;i++){
            this.key[i]=((parseInt(this.perPage)*(parseInt(this.currentPage)-1))+i+ 1);
          }
        } else {
          this.isErrorModal = true;
          this.errorMsg='No Data Found';
          //alert("No Data Found");
        }
      }
    }, err => {

    });
  }
  getData(data) {
    this.qdeHttp.adminLoadMoreLovs(this.tableName, data, parseInt(this.perPage),this.searchKey).subscribe(res => {
      if (res['ProcessVariables']['status'] == true) {
        if (res['ProcessVariables']['valueDescription'] && res['ProcessVariables']['valueDescription'].length > 0) {
          console.log(res['ProcessVariables']['perPage']);
          console.log(res['ProcessVariables']['currentPage']);
          console.log(res['ProcessVariables']['totalPages']);
          this.perPage = res['ProcessVariables']['perPage'];
          this.currentPage = data;
          this.totalPages = res['ProcessVariables']['totalPages'];
          this.totalItems = parseInt(this.perPage) * parseInt(this.totalPages);
          this.tempLovs = this.lovs = this.getLovMap(res['ProcessVariables']['valueDescription'])
          // .map((v, i) => {
          //   return {
          //     userId: localStorage.getItem('userId'),
          //     description: v['description'],
          //     value: v['value'],
          //     isEdit: true,
          //     id: v['id'],
          //     male: v['male'],
          //     female: v['female'],
          //     tableName: this.tableName,
          //     isRequired: v['isRequired'],
          //     reqBoolean : v['reqBoolean'],
          //     isMale : v['isMale']
              
          //   }
          // });
          this.key=[];
          for(var i=0; i<this.lovs.length;i++){
            this.key[i]=((parseInt(this.perPage)*(data-1))+i+ 1);
          }
        }
      }
    })
  }
  pageChanged(value) {
    let data =value;
    this.getData(data);
}
  onAddActivity(event,index){
    if (event.length>0){  
        this.selectedRoleActivity[index] =[]
        let selectActivityList  = event; 
        console.log("selected activity  ",event);
        console.log("activity ",event[0]["key"]);
        selectActivityList.forEach(obj => 
          this.selectedRoleActivity[index].push( obj.key)
          );
        // this.selectedRoleActivity[index]= (event.id);
        console.log("activity selected",this.selectedRoleActivity)
      }

  }
}
