import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { CreateAppointmentReqModel as CreateAppointmentReqModel, PatientDetailsModel, ProviderDetailsModel, SearchPaginationModel } from '../../models/appointment.model';

import { CommonDtoService } from '../../services/common.dto.service';
import { HTTPProviderService } from '../../services/http-provider.service';
import { PageRequest, SearchRequestDto } from '../../services/gobalMethodVariable';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../../services/communication.service';
import { ToastMessageService } from 'simpl-shared-ui';
import { FormDataService } from '../../services/formservice';

@Component({
  selector: 'simplerepo-select-patient',
  templateUrl: './select-patient.component.html',
  styleUrls: ['./select-patient.component.scss'],
})
export class SelectPatientComponent implements OnInit {
  _ProviderDetails: ProviderDetailsModel;
  searchForm!: FormGroup;
  emailForm!: FormGroup;
  _SearchValue: string = '';
  searchPaginationModel: SearchPaginationModel;
  _IsShowMultiplePatients: boolean = false;
  _ShowPatientDiv: boolean = false;

  _patientlist: PatientDetailsModel[] = [];
  _singlePatientDetails: PatientDetailsModel;
  _IsSearchPatientEmpty: boolean = false;

  pageRequest: PageRequest;
  searchRequestDtoList: SearchRequestDto[] = [];
  _SerachPatientDetails: SearchRequestDto[] = [];
  private subscription: Subscription | undefined;
  logo?: string;

  editPatientEmailMode: boolean = false;
  editedEmail: string = '';
  _searchOperation: boolean = true;
  _AppointmentNotes: string;
  _IsPatientBtnDisabled: boolean = false;
  _IsEmailupdated: boolean = false;

  public profileImage: string = "";
  initials: string = "";
  image: string = '';

  isHoveredPast: boolean = false;
  getPageRequestObject(
    pageNo: number,
    pageSize: number,
    sort: string,
    sortByColumn: string) {

    let pageRequest = new PageRequest();
    pageRequest.pageNo = pageNo;
    pageRequest.pageSize = pageSize;
    pageRequest.sort = sort;
    pageRequest.sortByColumn = sortByColumn;

    return pageRequest;
  }

  getSearchRequestDtoObject(
    column: string,
    value: string,
    joinTable: string,
    operation: string) {

    let tempSearchRequestDto = new SearchRequestDto();
    tempSearchRequestDto.column = column;
    tempSearchRequestDto.value = value;
    tempSearchRequestDto.joinTable = joinTable;
    tempSearchRequestDto.operation = operation;

    return tempSearchRequestDto;
  }

  getSearchPaginationModel(
    globalOperator: string,
    pageRequest: PageRequest,
    searchRequestDtoList: SearchRequestDto[]) {

    let searchPaginationModel = new SearchPaginationModel();
    searchPaginationModel.globalOperator = globalOperator;
    searchPaginationModel.pageRequest = pageRequest;
    searchPaginationModel.searchRequestDto = searchRequestDtoList;

    return searchPaginationModel;
  }
  formData: any;

  constructor(private router: Router,
    private _location: Location,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private commonDtoService: CommonDtoService,
    public httpProvider: HTTPProviderService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastMessageService: ToastMessageService,
    private communicationService: CommunicationService,
    private formDataService: FormDataService) {

    this._ProviderDetails = new ProviderDetailsModel();
    this._singlePatientDetails = new PatientDetailsModel();
    this.searchPaginationModel = new SearchPaginationModel();
    this.pageRequest = this.getPageRequestObject(0, 5, "DESC", "id");
    this.searchPaginationModel = this.getSearchPaginationModel("AND", this.pageRequest, this.searchRequestDtoList);

    this.searchForm = this.formBuilder.group({
      firstName: ["", [Validators.minLength(0), Validators.maxLength(32), Validators.pattern("^[ a-zA-Z\-\']+$")]],
      lastName: ["", [Validators.minLength(0), Validators.pattern("^[ a-zA-Z\-\']+$")]],
      streetAddress: ["", Validators.minLength(0)],
      zipcode: ["", [Validators.minLength(0), Validators.maxLength(5), Validators.minLength(5)]],
      phoneNumber: ["", [Validators.maxLength(10), Validators.minLength(0), Validators.pattern("^[0-9]*$")]],
      email: ["", [Validators.minLength(0), Validators.maxLength(50), Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]],
      dob: ["", [Validators.minLength(0), Validators.pattern("^(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])-[0-9]{4}$")]],
      pin1: ["", [Validators.minLength(0)]],
      pin2: ["", [Validators.minLength(0)]],
      pin3: ["", [Validators.minLength(0)]],
    });
    this.emailForm = this.formBuilder.group({
      email: ["", [Validators.maxLength(50), Validators.email, Validators.pattern(/^(?![@._%+-])(?=.{1,50})(?=.{1,24}@.{1,49}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)]],
    });

    //detect when the go back page is loaded//edit slot
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //"called when page reload"
      }
    });
    this._IsPatientBtnDisabled = false;
    this.formData = this.formDataService.getFormData();
  }



  ngOnInit() {
    this._IsEmailupdated = false;
    this.subscription = this.communicationService.currentData.subscribe(
      (objectData: any) => {
        if (objectData !== 'nodata' && objectData.IsNewPatientAdded) {
          this.httpProvider.logText("patient component data with notes", objectData);
          this._singlePatientDetails = objectData.patientDetails;
          this.httpProvider.logText("this._singlePatientDetails =>", this._singlePatientDetails)
          this._IsShowMultiplePatients = false;
          this._ShowPatientDiv = true;
          this._searchOperation = false;
          this._AppointmentNotes = objectData.notes;
          this._IsPatientBtnDisabled = objectData.IsNewPatientAdded
        }
      }
    );
    this._ProviderDetails = this.commonDtoService._ProviderDetails;
  }

  maskLastFourDigitsSSN(number: string) {
    if (number !== undefined && number?.length > 5) {
      const maskedPart = '*'.repeat(number.length - 4);
      const lastFourDigits = number.slice(-4);
      return maskedPart + lastFourDigits;
    }
    return "-";
  }

  async downloadAndReturnProfileImage(path: string): Promise<any> {
    try {
      const res: any = await this.httpProvider
        .downloadProfileImage(path)
        .toPromise();
      return res || '';
    } catch (error) {
      console.error('Error downloading profile image:', error);
      return ''; // Return empty string on error
    }
  }

  async downloadAndReturnPatinetProfileImage(simplId: string): Promise<any> {
    try {
      const res: any = await this.httpProvider
        .downloadPatientProfileImage(simplId)
        .toPromise();
      return res || '';
    } catch (error) {
      console.error('Error downloading profile image:', error);
      return ''; // Return empty string on error
    }
  }


  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('').substring(0, 2);
    return initials.toUpperCase();
  }

  goBackToAppointmentList() {
    this.router.navigate(['/appointments']);
  }

  goBackToProviderList() {
    this.router.navigate(['/appointment']);
  }

  editTime() {
    this.formDataService.setFormData(this.formData);
    this.router.navigate(['/appointment']);
  }

  addNewPatient() {
    this.router.navigate(['/appointment/add-new-patient']);
  }

  getPatientListFromAPI() {
    let provider_id = localStorage.getItem('providerId') || '';
    if (provider_id !== '') {
      this.httpProvider.getPatientListBasedOnProvider(provider_id, this.searchPaginationModel).subscribe({
        next: (res: any) => {
          this._SerachPatientDetails = res
          //console.log('this._SerachPatientDetails', this._SerachPatientDetails);
          if (!res.empty) {
            this._patientlist = [];
            this._patientlist = res.content;
            this._patientlist?.map(async (x: any) => {
              if (x?.logo !== undefined) {
                this.profileImage = x.profileImage = await this.downloadAndReturnPatinetProfileImage(x.simpl_id);
              } else {
                let name = x?.first_name + " " + x?.last_name
                this.initials = x.initialImage = this.getInitials(name);
              }
            });
            this._IsShowMultiplePatients = true;
            this._ShowPatientDiv = true;
          }
          else {
            this._IsSearchPatientEmpty = res.empty;
            this._ShowPatientDiv = false;
            this._IsShowMultiplePatients = false;
          }
        },
        error: (error) => {
          this.toastMessageService.presentErrorMessage("Error while fetching search patient : " + error.message);
        }
      })
    }
  }

  enableeditPatientEmail() {
    this.emailForm?.get('email')?.setValue(this._singlePatientDetails?.email);
    this.editPatientEmailMode = true;
    this.editedEmail = this._singlePatientDetails?.email || '';
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.editedEmail = this.emailForm?.controls['email']?.value;
      //this._singlePatientDetails.email = this.editedEmail;

      if (this.editedEmail !== "" && this.editedEmail !== undefined) {
        this.updatePatientEmailAddress();
      }
    }
  }

  updatePatientEmailAddress() {
    let simpl_id: any = this._singlePatientDetails?.simpl_id || null;
    let payloadData = {
      "email": this.editedEmail
    }
    this.httpProvider.updatePatientEmail(simpl_id, payloadData).subscribe({
      next: (): void => {
        this.editPatientEmailMode = false;
        this._IsEmailupdated = true;
        this._singlePatientDetails.email = this.editedEmail;
      },
      error: (error) => {
        this.toastMessageService.presentErrorMessage("Error updating Email : " + (error?.error?.message || ""));
      }
    });
  }

  cancelEdit() {
    // Cancel edit mode and reset the edited email address
    this.editPatientEmailMode = false;
    this.editedEmail = '';
  }

  validatePaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    const pastedData = clipboardData?.getData('text');

    // Convert pasted data to a number
    const numericValue = Number(pastedData);

    // Check if the pasted data is a valid number and matches the original string value
    if (isNaN(numericValue) || numericValue.toString() !== pastedData) {
      // If not numeric, prevent the paste
      event.preventDefault();
    }
  }


  searchPatientList(serachString: any) {
    this._searchOperation = true;
    this.menuCtrl.close('existingPatient');

    this.searchRequestDtoList = [];
    this.pageRequest = this.getPageRequestObject(0, 5, "DESC", "id");

    if (serachString != '') {
      this.searchRequestDtoList.push(this.getSearchRequestDtoObject("firstName", serachString.trim(), "", "LIKE"));
    }
    else if (this.searchForm?.value?.firstName && this.searchForm?.value?.firstName.trim().length > 0) {
      this.searchRequestDtoList.push(this.getSearchRequestDtoObject("firstName", this.searchForm?.value?.firstName.trim(), "", "LIKE"));
    }

    if (this.searchForm?.value?.lastName && this.searchForm?.value?.lastName.trim().length > 0) {
      this.searchRequestDtoList.push(this.getSearchRequestDtoObject("lastName", this.searchForm?.value?.lastName.trim(), "", "LIKE"));
    }

    if (this.searchForm?.value?.phoneNumber && this.searchForm?.value?.phoneNumber.trim().length > 0) {
      this.searchRequestDtoList.push(this.getSearchRequestDtoObject("phone", this.searchForm?.value?.phoneNumber.trim(), "", "LIKE"));
    }

    if (this.searchForm?.value?.email && this.searchForm?.value?.email.trim().length > 0) {
      this.searchRequestDtoList.push(this.getSearchRequestDtoObject("email", this.searchForm?.value?.email.trim(), "", "LIKE"));
    }

    if (this.searchForm?.value?.zipcode && this.searchForm?.value?.zipcode.trim().length > 0) {
      this.searchRequestDtoList.push(this.getSearchRequestDtoObject("zip", this.searchForm?.value?.zipcode.trim(), "consumerAddress", "JOIN"));
    }

    if (this.searchForm?.value?.streetAddress && this.searchForm?.value?.streetAddress.trim().length > 0) {
      this.searchRequestDtoList.push(this.getSearchRequestDtoObject("addressLine1", this.searchForm?.value?.streetAddress.trim(), "consumerAddress", "JOIN"));
    }

    this.searchPaginationModel = this.getSearchPaginationModel("AND", this.pageRequest, this.searchRequestDtoList);
    this.getPatientListFromAPI();
  }

  clearSearchbar() {
    this.searchPatientList('$#%');
  }

  clearSearch() {
    this.searchForm.get("firstName")?.setValue("");
    this.searchForm.get("lastName")?.setValue("");
    this.searchForm.get("streetAddress")?.setValue("");
    this.searchForm.get("zipcode")?.setValue("");
    this.searchForm.get("dob")?.setValue("");
    this.searchForm.get("phoneNumber")?.setValue("");
    this.searchForm.get("email")?.setValue("");
    this.searchForm.get("pin1")?.setValue("");
    this.searchForm.get("pin2")?.setValue("");
    this.searchForm.get("pin3")?.setValue("");
    this.searchPatientList(this._SearchValue);
  }



  openPatientMenu() {
    this.menuCtrl.open('existingPatient');
  }

  closePatientMenu() {
    this.menuCtrl.close('existingPatient');
  }

  singlePatientDiv(argPatientData: PatientDetailsModel) {
    this._IsPatientBtnDisabled = true;
    this._IsShowMultiplePatients = false;
    this._ShowPatientDiv = true;
    this._searchOperation = false;
    this._singlePatientDetails = argPatientData;
  }

  removeSelectedPatient() {
    this._IsShowMultiplePatients = true;
    this._ShowPatientDiv = true;
    this._IsPatientBtnDisabled = false;
    this._IsEmailupdated = false;
    //this.searchPatientList(this._SearchValue);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this._ShowPatientDiv = true;
      this.searchPatientList(this._SearchValue);
    }
  }

  createAppointment() {
    let l_CreateAppointRequest = new CreateAppointmentReqModel();
    l_CreateAppointRequest.start_date_time = this._ProviderDetails?.start_date_time;
    l_CreateAppointRequest.end_date_time = this._ProviderDetails?.end_date_time;
    l_CreateAppointRequest.service_id = this._ProviderDetails?.service_id;
    l_CreateAppointRequest.resource_id = this._ProviderDetails?.resource_id;
    l_CreateAppointRequest.location_id = this._ProviderDetails?.location_id;
    l_CreateAppointRequest.consumer_email = this._singlePatientDetails?.email;
    l_CreateAppointRequest.simpl_id = this._singlePatientDetails?.simpl_id;
    l_CreateAppointRequest.notes = this._AppointmentNotes;

    if (this._singlePatientDetails.middle_name != undefined) {
      l_CreateAppointRequest.consumer_name = this._singlePatientDetails.first_name + " " + this._singlePatientDetails.middle_name + " " + this._singlePatientDetails.last_name;
    } else {
      l_CreateAppointRequest.consumer_name = this._singlePatientDetails.first_name + " " + this._singlePatientDetails.last_name;
    }

    this.httpProvider.createAppointment(l_CreateAppointRequest).subscribe({
      next: (res: any) => {
        this.httpProvider.logText("Get available staff of resource", res);
        this.toastMessageService.presentSuccessMessage("Appointment has been successfully booked!!");
        this.router.navigate(['/appointments']);
      },
      error: (error) => {
        this.toastMessageService.presentErrorMessage("Error while creating appointment : " + error.error.message);
      }
    });
  }

  formatDateWithoutDateObject(dateString: any) {
    const [year, month, day] = dateString?.split('-');
    return `${month}-${day}-${year}`;
  }

  loginConsumer(){
    this.router.navigate(['/login']);
  }
}
