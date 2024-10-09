import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppointmentDataModel, AppointmentListModel, apptCancelCompleteModel, PageRequest, SearchRequestDto, SortingObject, TelehealthRespModel } from '../../models/appointment.model';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, MenuController, LoadingController } from '@ionic/angular';
import { map, catchError, of } from 'rxjs';
import { PaginationModel } from '../../models/pagination.model';
import { CommonDtoService } from '../../services/common.dto.service';
import { CommunicationService } from '../../services/communication.service';
import { GlobleMethods } from '../../services/gobalMethodVariable';
import { HTTPProviderService } from '../../services/http-provider.service';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.scss'
})
export class AppointmentsListComponent implements OnInit{

  _completeApptPopupLabel: string = "";
  _isCompleteAppt: boolean = false;
  canDismiss: boolean = false;
  _filterAppointmentList: AppointmentDataModel[];
  _PatientDetails: AppointmentDataModel;
  _NoData: boolean = false;
  _searchValue: string = "";

  _TransformedAppontDate: any;
  _singlerowApptData: AppointmentDataModel = new AppointmentDataModel();
  _singlerowCompleteAppt: AppointmentDataModel = new AppointmentDataModel();

  public currentPage: number = 0;
  public numbersofpages: number[] = [];
  public listSize: number = 0;
  paginationModel!: PaginationModel;
  pageRequest!: PageRequest;
  searchRequst: SearchRequestDto[] = [];
  _TodayDate: any;
  _IsBooked: boolean = false;
  _locationId: any;
  _loggedInUser: string;

  //sorting object
  _resourceNameSortObj: SortingObject;
  _consumerNameSortObj: SortingObject;
  _serviceNameSortObj: SortingObject;
  _StartDateSortObj: SortingObject;
  _durationSortObj: SortingObject;
  _locationSortObj: SortingObject;
  profileImageCache: { [simplId: string]: string | null } = {};
  docprofileImageCache: { [simplId: string]: string | null } = {};
  public profileImage: string | undefined;
  public profileDocImage: string | undefined;
  initials: string = "";

  constructor(private httpProvider: HTTPProviderService,
    private globleMethod: GlobleMethods,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private menuCtrl: MenuController,
    private elementRef: ElementRef,
    private communicationService: CommunicationService,
    private loadingController: LoadingController) {
    this._PatientDetails = new AppointmentDataModel();
  }


  ngOnInit() {
    this.route.params.subscribe(() => {
      let simplId = localStorage.getItem('simplId')||'';
      if(simplId ==''){
        localStorage.setItem('simplId',"8914d4ac-5d2c-46bf-9628-42cb40ad2b09")//for testing
      }
      this.currentPage = 0;
      this.searchRequst = [];
      this._filterAppointmentList = [];
      this.pageRequest = this.globleMethod.getPageRequestObject(0, 10, "DESC", "id");
      this.searchRequst.push(this.globleMethod.getSearchRequestDtoObject("simplId", simplId, "", "EQUAL"));
      this.paginationModel = this.globleMethod.getSearchPaginationModel("AND", this.pageRequest, this.searchRequst);

      this._resourceNameSortObj = new SortingObject();
      this._consumerNameSortObj = new SortingObject();
      this._serviceNameSortObj = new SortingObject();
      this._StartDateSortObj = new SortingObject();
      this._durationSortObj = new SortingObject();
      this._locationSortObj = new SortingObject();

      this._resourceNameSortObj.key = 'professional.firstName';
      this._resourceNameSortObj.value = 'DESC';

      this._consumerNameSortObj.key = 'consumerName';
      this._consumerNameSortObj.value = 'DESC';

      this._StartDateSortObj.key = 'startDateTime';
      this._StartDateSortObj.value = 'DESC';

      this._serviceNameSortObj.key = 'service_name';
      this._serviceNameSortObj.value = 'DESC';

      this._durationSortObj.key = 'duration';
      this._durationSortObj.value = 'DESC';

      this._locationSortObj.key = 'service_type';
      this._locationSortObj.value = 'DESC';
      this.getAppointmentList();
    });
  }
  
  fifteenMinutesAgoTime(): string{
    const currentUtcDateTime = new Date();
    const fifteenMinutesAgo = new Date(currentUtcDateTime.getTime() - 15 * 60000);
    const formattedDateTime = fifteenMinutesAgo.toISOString().slice(0, 19);
    return formattedDateTime
  }

  nextDayDate() : string{
    const currentDate = new Date();
    const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const formattedNextDay = nextDay.toISOString().slice(0, 10);
    return formattedNextDay
  }

  getFormattedStartTime(argDate: any) {
    let startTimeWithoutTimezone = argDate?.slice(0, -6);; // Remove the last 6 characters ("-05:00")
    return this.datePipe.transform(startTimeWithoutTimezone, 'hh:mm a');
  }

  getdateFomatstartDateTime(argDate: any) {
    let cloneData = argDate;
    let startDate = cloneData?.substring(0, 10)
    let l_TransformedAppontDate = this.datePipe.transform(startDate, 'MM/dd/yy');
    let cloneTime = argDate;
    let startTimeWithoutTimezone = cloneTime?.slice(0, -6);
    let l_TransformedAppontTime = this.datePipe.transform(startTimeWithoutTimezone, 'hh:mm a');
    let stringValue = l_TransformedAppontDate + " " + l_TransformedAppontTime
    return stringValue;
  }


  filterByPatientName(argstring: any) {
    const searchTerm = argstring.toLowerCase();
    if (searchTerm != "") {
      this.currentPage = 0;
      this.searchRequst = [];
      this.pageRequest = this.globleMethod.getPageRequestObject(0, 10, "DESC", "id");
      if (searchTerm.includes('@')) {
        this.searchRequst.push(this.globleMethod.getSearchRequestDtoObject("email", searchTerm, "", "LIKE"));

      } else {
        this.searchRequst.push(this.globleMethod.getSearchRequestDtoObject("consumerName", searchTerm, "", "LIKE"));
      }
      this.searchRequst.push(this.globleMethod.getSearchRequestDtoObject("startDateTime", this.httpProvider.formatDateToYYYYMMDD(), "", "LIKE"));
      this.paginationModel = this.globleMethod.getSearchPaginationModel("AND", this.pageRequest, this.searchRequst);

      this.getAppointmentList();
    } else {
      this.clearSearch(this._searchValue);
    }
  }

  clearSearch(arg: any) {
    this.currentPage = 0;
    this.searchRequst = [];
    this.pageRequest = this.globleMethod.getPageRequestObject(0, 10, "DESC", "id");
    let simplId = localStorage.getItem('simplId')||'';
    this.searchRequst.push(this.globleMethod.getSearchRequestDtoObject("simplid", simplId, "", "EQUAL"));
    this.paginationModel = this.globleMethod.getSearchPaginationModel("AND", this.pageRequest, this.searchRequst);
    this.getAppointmentList();
  }


  callFilterMethod(columnObj: SortingObject) {
      if (columnObj.key === "professional.firstName") {
        this._resourceNameSortObj.value = this._resourceNameSortObj.value === "ASC" ? "DESC" : "ASC";
      } else if (columnObj.key === "consumerName") {
        this._consumerNameSortObj.value = this._consumerNameSortObj.value === "ASC" ? "DESC" : "ASC";
      } else if (columnObj.key === "service_name") {
        this._serviceNameSortObj.value = this._serviceNameSortObj.value === "ASC" ? "DESC" : "ASC";
      } else if (columnObj.key === "startDateTime") {
        this._StartDateSortObj.value = this._StartDateSortObj.value === "ASC" ? "DESC" : "ASC";
      }else if (columnObj.key === "duration") {
        this._durationSortObj.value = this._durationSortObj.value === "ASC" ? "DESC" : "ASC";
      }else if (columnObj.key === "service_type") {
        this._locationSortObj.value = this._locationSortObj.value === "ASC" ? "DESC" : "ASC";
      }
    this.sortingList(columnObj)
  }

  sortingList(columnObj: SortingObject) {
    this.pageRequest = this.globleMethod.getPageRequestObject(0, 10, columnObj.value, columnObj.key);
    this.paginationModel = this.globleMethod.getSearchPaginationModel("AND", this.pageRequest, this.searchRequst);
    this.getAppointmentList();
  }

  setSortSign(value: string): string {
    if (value === 'DESC') {
      return 'arrow-down';
    } else {
      return 'arrow-up';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.filterByPatientName(this._searchValue)
    }
  }

  /**
   * This function call on page load, get list of location
   */
  getAppointmentList() {
    this._locationId = localStorage.getItem("locationId") || null;
    if (this._locationId !== null) {
      this.httpProvider.getAllAppointmentsByLocationId<AppointmentListModel>(this._locationId, this.paginationModel).subscribe({
        next: (res: AppointmentListModel) => {
          let l_AppointmentList: AppointmentListModel = res;
          this._filterAppointmentList = [];
          if (l_AppointmentList?.content != undefined) {
            this._filterAppointmentList = l_AppointmentList?.content;
            if (this._filterAppointmentList?.length > 0) {
              this.listSize = res?.total_elements;
              this._filterAppointmentList.forEach(appointment => {
                if (appointment.simpl_id && !this.profileImageCache[appointment.simpl_id]) {
                  this.fetchAndCacheProfileImage(appointment.simpl_id);
                }
              });
              this._filterAppointmentList.forEach(appointment => {
                if (appointment.professional_id && !this.docprofileImageCache[appointment.professional_id]) {
                  this.fetchDocAndCacheProfileImage(appointment.professional_id);
                }
              })
              
              this.numbersofpages = new Array(res?.total_pages);
              this.currentPage = res?.pageable?.page_number;
            } else {
              this._NoData = true;
            }
          }
        },
        error: (error) => {
          this.globleMethod.presentToastFailure(this.globleMethod.getErrorMessage(error));
        }
      });
    } else {
      console.error("Location id is not found.");
    }
  }

  sortDoctorNameWords(a: any, b: any) {
    let nameA = a?.resource_name?.split(" ")?.sort()?.join(" ");
    let nameB = b?.resource_name?.split(" ")?.sort()?.join(" ");
    return nameA.localeCompare(nameB);
  }

  getDateMonthYearTime(dateString: any) {
    const day = new Date(dateString).getDate();
    const month = new Date(dateString).getMonth() + 1;
    const year = new Date(dateString).getFullYear();
    const time = new Date(dateString).toLocaleTimeString();
    return `${day}-${month}-${year}-${time}`;
  };

  sortedArray(arrfilterAppointmentList: AppointmentDataModel[]) {
    let sortedArray = arrfilterAppointmentList.sort((a, b) => {
      let l_firstDate: any = this.getDateMonthYearTime(new Date(a.create_date));
      let l_secondDate: any = this.getDateMonthYearTime(new Date(b.create_date));
      return l_firstDate - l_secondDate
    })
    return sortedArray;
  }

  

  navigateToNewAppointment() {
    this.router.navigate(['/appointment']);

  }

  openSidePanel(argappointment: AppointmentDataModel) {
    this._PatientDetails = argappointment;
    this.getProviderDetails(argappointment);
  }

  

  getStatusLabel(shortForm: string): string {
    shortForm = shortForm.toLowerCase();
    if (shortForm != null && shortForm === "bk") {
      let l_fullForm = "Scheduled";
      return l_fullForm;
    } if (shortForm != null && shortForm === "cn" || shortForm === "re") {
      let l_fullForm = "Cancelled";
      return l_fullForm;
    } if (shortForm != null && shortForm === "in") {
      let l_fullForm = "Initial";
      return l_fullForm;
    }
    if (shortForm != null && shortForm === "ns") {
      let l_fullForm = "Completed";
      return l_fullForm;
    }
    else {
      return shortForm;
    }
  }

  getStatusColor(shortForm: string): string {
    shortForm = shortForm.toLowerCase();
    if (shortForm === 'bk' || shortForm === 'ns') {
      return 'brown-btn';
    } else if (shortForm === 'cn' || shortForm === "re") {
      return 'red-btn';
    } else if (shortForm === 'in') {
      return 'brown-btn';
    } else {
      return '';
    }
  }

  getCirleStatusColor(shortForm: string): string {
    shortForm = shortForm.toLowerCase();
    if (shortForm === 'bk' || shortForm === 'ns') {
      return 'brown-bg';
    } else if (shortForm === 'cn' || shortForm === "re") {
      return 'red-bg';
    } else if (shortForm === 'in') {
      return 'brown-bg';
    } else {
      return '';
    }
  }



  getProviderDetails(argData: AppointmentDataModel) {
    this.httpProvider.getProviderName(argData.resource_email).subscribe((res: any) => {

    }, (error) => {
      console.error("Error occured.!", error);
    });
  }

  public onChangePageNumber(pagenumber: any) {
    this.currentPage = pagenumber;
    this.paginationModel.pageRequest.pageNo = this.currentPage;
    this.getAppointmentList();
  }

  // Method to fetch and cache profile images
  fetchAndCacheProfileImage(simplId: any) {
    this.httpProvider.downloadPatientProfileImage(simplId).pipe(
      map((res: any) => {
        let profileImage: any = null;
        if (res.code === 4029) {
          profileImage = res.body;
        } else {
          console.error("Error occurred.");
        }

        // Cache the result
        this.profileImageCache[simplId] = profileImage;
      }),
      catchError((error: any) => {
        console.error('Endpoint call error: ', error);
        this.profileImageCache[simplId] = null;
        return of(null);
      })
    ).subscribe();
  }

  fetchDocAndCacheProfileImage(professionalId: any) {
    this.httpProvider.downloadProfileImage(professionalId).pipe(
      map((res: any) => {
        let profileImage: any = null;
        if (res.code === 6004) {
          profileImage = res.body;
        } else {
          console.error("Error occurred.");
        }

        // Cache the result
        this.docprofileImageCache[professionalId] = profileImage;
      }),
      catchError((error: any) => {
        console.error('Endpoint call error: ', error);
        this.docprofileImageCache[professionalId] = null;
        return of(null);
      })
    ).subscribe();
  }

  getProfileImage(simplId: any): string | null {
    return this.profileImageCache[simplId] || null;
  }

  getDocProfileImage(professionalId: any): string | null {
    return this.docprofileImageCache[professionalId] || null;
  }

  getDocInitials(name: string): string {
    if (!name) return '';
    const nameParts = name?.split(' ');
    const initials = nameParts?.map(part => part?.charAt(0))?.join('')?.substring(0, 2);
    return initials?.toUpperCase();
  }

  getInitials(resourceName?: string): string {
    if (!resourceName) return '';

    const parts = resourceName?.split(' ').filter(part => part?.trim() !== '');

    if (parts?.length < 2) return '';

    const firstName = parts[0]; // Assuming first name is the second part
    const lastName = parts[parts.length - 1]; // Assuming last name is the last part
    const lastInitial = lastName?.charAt(0)?.toUpperCase();
    const firstInitial = firstName?.charAt(0)?.toUpperCase();

    return `${firstInitial}${lastInitial}`;
  }

}