import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import {
  AuthService,
  CONSUMER_HOST,
  HostService,
  PROVIDER_HOST,
  ThemeService,
  TitleService,
  ToastMessageService,
} from 'simpl-shared-ui';
import { AvailDayAPIResp, 
  AvailTimeAPIResp, 
  AvailTimeReqResourceModel, 
  AvaliableStaffListModel, 
  LocationListModel, 
  ProviderDetailsModel, 
  ServiceAPIRespModel, 
  ServiceDTO, 
  ServiceListModel, 
  StaffListModel, 
  TimeSlotModel } from '../../models/appointment.model';
import { Router, NavigationStart, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription, map, catchError, of, filter } from 'rxjs';
import { PaginationModel, PageRequest, SearchRequestDto } from '../../models/pagination.model';
import { CommonDtoService } from '../../services/common.dto.service';
import { HTTPProviderService } from '../../services/http-provider.service';
import { GlobleMethods } from '../../services/gobalMethodVariable';
import { FormDataService } from '../../services/formservice';



@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent implements OnInit {
  _LocationList: LocationListModel[];
  _ServiceList: ServiceListModel[];
  _filteredServiceList: ServiceListModel[];
  _LocationID: any = null;
  _IsServiceAvaliable: boolean = true;
  _AvailResources: AvailTimeReqResourceModel;
  _selectedStaff: any = 0;
  _AvailDayPageLoad: boolean = false;
  _AvailTimePageLoad: boolean = false;
  _HeaderLabel: string;
  _AvaliableStaffList: AvaliableStaffListModel[];
  _AvaliableStoreStaffList: AvaliableStaffListModel[];

  _AvailReqResources: AvailTimeReqResourceModel;
  _AvailDayRespDetails: AvailDayAPIResp[];
  _AvailTimeDeatils: AvailTimeAPIResp[];
  groupedTimeData: { [key: string]: any[] } = {};
  _hideFirstPanel: boolean = false;
  _serviceDTO: ServiceDTO;
  countsArray: any[] = [];
  apiResponseReceived: boolean = false;

  private routerSubscription: Subscription;
  previousUrl: string;
  currentUrl: string;

  public currentPage: number = 0;
  public numbersofpages: number[] = [];
  public listSize: number = 0;
  paginationModel!: PaginationModel;
  pageRequest!: PageRequest;
  searchRequst: SearchRequestDto[] = [];

  isAccordionExpanded: boolean = false;
  indexvalue: any;

  public profileImage: string = '';
  public availTimeImage: string = '';
  public availDayImage: string = '';
  public availDayInitial: string = '';

  public initials: string = '';
  public availTimeInitials: string = '';

  public logoData: string = '';
  public staffListImage: string = '';
  public staffListInitials: string = '';
  dropdownItems: any = [
    {
      Id: 'In Person',
      Label: 'In Person',
    }];
  shown = false;
  value: any = 'Select Type';
  @HostListener('document:click', ['$event']) onClick(e: any) {
    if (!this.ele.nativeElement.contains(e.target)) {
      this.shown = false;
    }
  }
  availofferCodes: any;

  shownDateDD = false;
  selectedDate: string;
  today = new Date();
  maxDate: Date;
  currentMonth: number;
  currentYear: number;
  daysArray: any[] = [];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  yearRange: number[] = [];
  showTimeSlots = false;
  timeSlotsForDate: any = [];
  uniqueDatesArrayForCalendar: string[][] = [];
  isHoveredPast: boolean = false;


  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private titleService: TitleService,
    private hostService: HostService,
    private http: HttpClient,
    public httpProvider: HTTPProviderService,
    private globleMethod: GlobleMethods,
    private formDataService: FormDataService,
    private toastMessageService: ToastMessageService,
    private router: Router,
    private route: ActivatedRoute,
    public commonDtoService: CommonDtoService,
    private menuCtrl: MenuController,
    private ele: ElementRef,
    private activatedRoute: ActivatedRoute,
  ) {
      this._LocationList = [];
      this._ServiceList = [];
      this._filteredServiceList = [];
      this._AvailResources = new AvailTimeReqResourceModel();
      this._AvaliableStaffList = [];
      this._AvaliableStoreStaffList = [];
      /**
       * available-day-resource component
       */
      this._AvailReqResources = new AvailTimeReqResourceModel();
      this._AvailDayRespDetails = [];
      this._AvailTimeDeatils = [];
      this.availofferCodes = localStorage.getItem('AvailofferCodes');
      this.availofferCodes = JSON.parse(this.availofferCodes) || '';

      this.currentMonth = this.today.getMonth();
      this.currentYear = this.today.getFullYear();
      this.maxDate = new Date(this.today);
      this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
  }
  
  ngOnInit() {
    const savedData = this.formDataService.getFormData();
    if (savedData !== undefined) {
      this.selectTimeSideMenu(true);
      this._AvailDayPageLoad = savedData?.availDayPageLoad;
      this._AvailTimePageLoad = savedData?.availTimePageLoad;
    }else{
      this._AvailDayPageLoad = false;
      this._AvailTimePageLoad = false;
    }
    this.getLocations();
    this._LocationID = localStorage.getItem('locationId') || null;
    this.httpProvider.logText('ngOnInit', ' call this component');
    this._HeaderLabel = 'Select Service';    
    this.currentPage = 0;
    this.pageRequest = this.globleMethod.getPageRequestObject(
      0,
      10,
      'DESC',
      'id'
    );
    this.searchRequst.push(
      this.globleMethod.getSearchRequestDtoObject('active', 'true', '', 'EQUAL')
    );
    this.paginationModel = this.globleMethod.getSearchPaginationModel(
      'OR',
      this.pageRequest,
      []
    );
    if(this.isTelehealth()){
      this.dropdownItems.push({
        Id: 'Telehealth',
        Label: 'Telehealth',
      })
    }
  }

  isTelehealth(): boolean {
    if (this.availofferCodes?.length !== 0) {
      return this.availofferCodes?.some((item: any) => item.id === '9');
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleAccordion(index: any) {
    this.indexvalue = index;
    this.isAccordionExpanded = !this.isAccordionExpanded;
  }

  getSelectedLocation(arg: any) {
    this._LocationID = arg;
    this.populateService();
  }

  filterstaffByName(event: any) {
    let l_AvaliableStaffList = this._AvaliableStaffList;
    if (this._AvaliableStaffList.length != 0) {
      const query = event.target.value.toLowerCase();
      this._AvaliableStaffList = l_AvaliableStaffList.filter(
        (d) => d.name.toLowerCase().indexOf(query) > -1
      );
    }
  }

  clearstaffSearch() {
    this._AvaliableStaffList = this._AvaliableStoreStaffList;
  }
  /**
   * This function call on page load, get list of location
   */
  async getLocations() {
    const providerId: any = localStorage.getItem('providerId') || null;
    if (providerId !== null && providerId !== undefined) {
      await this.httpProvider
        .getAllLocationByProviderId<LocationListModel[]>(providerId)
        .subscribe({
          next: (res: LocationListModel[]) => {
            this._LocationList = res;
          },
          error: (error) => {
            this.toastMessageService.presentErrorMessage(error.error.message);
          },
        });
    } else {
      console.error('Provider id is not found.');
    }
    this.populateService();
  }

  locationSelected(selectedItem: any) {
    if (selectedItem.id != null && selectedItem.id !== undefined) {
      this._LocationID = selectedItem.id;
      this.populateService();
    }
  }

  /**
   * This function called when location value change from dropdown
   */
  populateService() {
    this._ServiceList = [];
    this._filteredServiceList = [];
    if (this._LocationID !== null && this._LocationID !== undefined) {
      this.httpProvider
        .getAllServiceByLocationId(
          this._LocationID,
          this.paginationModel
        )
        .subscribe({
          next: (res: any) => {
            this.listSize = res.total_elements;
            this.numbersofpages = new Array(res.total_pages);
            this.currentPage = res.pageable.page_number;
            this._ServiceList = res.content;
            this._filteredServiceList = this._ServiceList;
            this._ServiceList?.map(async (x: any) => {
              if (x?.service_logo !== undefined) {
                this.profileImage = x.profileImage = await this.downloadAndReturnProfileImage(x.service_logo);
              } else {
                this.initials = x.initialImage = this.getInitials(x?.service_name);
              }
            });
            
            if (res.content == undefined) {
              this._IsServiceAvaliable = false;
            } else {
              this._IsServiceAvaliable = true;
            }
          },
          error: (error) => {
            console.error(error.error.message);
          },
        });
    } else {
      console.error('Location id is not found.');
    }
    // this._AvailDayPageLoad = false;
    // this._AvailTimePageLoad = false;
  }

  /**
   *
   * @param arrData specified list from which the user wants to filter out a desired value.
   * @param stringValue Value which user want to find into list
   */
  filterServiceByLetter(arrData: ServiceListModel[], stringValue: any) {
    const searchTerm = stringValue?.toLowerCase();
    if (searchTerm) {
      this.currentPage = 0;
      this.searchRequst = [];
      this.pageRequest = this.globleMethod.getPageRequestObject(
        0,
        10,
        'DESC',
        'id'
      );
      this.searchRequst.push(
        this.globleMethod.getSearchRequestDtoObject(
          'name',
          searchTerm,
          '',
          'LIKE'
        )
      );
      this.paginationModel = this.globleMethod.getSearchPaginationModel(
        'OR',
        this.pageRequest,
        this.searchRequst
      );
      this.populateService();
    } else {
      this.clearSearch();
    }
  }

  showDropdown() {
    this.shown = this.shown ? false : true;
  }
  selectValueFromTypeDD(argData: any) {
    this.shown = false;
    this.value = argData.Id;
    this.currentPage = 0;
    this.searchRequst = [];
    this.pageRequest = this.globleMethod.getPageRequestObject(
      0,
      10,
      'DESC',
      'id'
    );
    this.searchRequst.push(
      this.globleMethod.getSearchRequestDtoObject(
        'type',
        this.value,
        '',
        'LIKE'
      )
    );
    this.paginationModel = this.globleMethod.getSearchPaginationModel(
      'OR',
      this.pageRequest,
      this.searchRequst
    );
    this.populateService();
  }

  /**
   *
   * @param argValue clear search value from filter input
   */
  clearSearch() {
    this.currentPage = 0;
    this.searchRequst = [];
    this.pageRequest = this.globleMethod.getPageRequestObject(
      0,
      10,
      'DESC',
      'id'
    );
    this.paginationModel = this.globleMethod.getSearchPaginationModel(
      'OR',
      this.pageRequest,
      this.searchRequst
    );
    this.populateService();
  }

  onValueSelected(selectedItem: any, argflag: boolean, argAvailResources: any, argService: any, clickInfo: any) {
    this.navigateToSelectTimeFromDD(
      argflag,
      selectedItem.id,
      argAvailResources,
      argService,
      clickInfo
    );
  }

  navigateToSelectTimeFromDD(
    IsFirstAvaliable: boolean,
    selectedStaff: any,
    l_AvailResources: AvailTimeReqResourceModel,
    argService: any,
    clickInfo: any
  ) {
    this._serviceDTO = new ServiceDTO();
    this._serviceDTO.service_name = argService?.service_name;
    this._serviceDTO.service_type = argService?.service_type;
    this._serviceDTO.service_duration = argService?.service_duration;
    if (!IsFirstAvaliable) {
      l_AvailResources.type = 'DAY';
      l_AvailResources.resource_ids = [];
      l_AvailResources.resource_ids.push(Number(selectedStaff));
      this._AvailDayPageLoad = true;
      this._AvailTimePageLoad = false;
      this._AvailReqResources = l_AvailResources;
      this.getAllAvaliable(this._AvailReqResources);
      this.getAvaliableTimeForSidePanel();
    } else {
      l_AvailResources.type = 'TIME';
      if (l_AvailResources.resource_ids.length != 0) {
        this._AvailDayPageLoad = false;
        this._AvailTimePageLoad = true;
      }
    }
    this.commonDtoService._DTOAvailResources = l_AvailResources;
    this.commonDtoService._ServiceDetailsDTO = this._serviceDTO;
    this.commonDtoService._clickInfoForNextPage = clickInfo;
    this._AvailResources = l_AvailResources;
  }

  commonDataSetmethod(argServiceId: any, staff_list: StaffListModel[]) {
    let l_staff_list: any[] = [];
    staff_list.forEach((element) => {
      l_staff_list.push(element.id);
    });
    let l_AvailResources = new AvailTimeReqResourceModel();
    l_AvailResources.service_id = argServiceId;
    l_AvailResources.location_id = Number(this._LocationID);

    // const today: string = new Date().toISOString().slice(0, 10);
    // const nextWeekDate: string = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const today = this.todayDateIntoString();
    const nextWeekDate = this.getDateAfterSixDays();

    l_AvailResources.start_date = today;
    l_AvailResources.end_date = nextWeekDate;
    return { l_AvailResources, l_staff_list };
  }

  todayDateIntoString() {
    let dateObj = new Date();
    let year = dateObj.getFullYear();
    let month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    let day = ('0' + dateObj.getDate()).slice(-2);
    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  getDateAfterSixDays() {
    let today = new Date();
    let nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 6);
    let year = nextDate.getFullYear();
    let month = ('0' + (nextDate.getMonth() + 1)).slice(-2);
    let day = ('0' + nextDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  /**
   * This function call when staff Dropdown clicked
   * @param argAvailResources API request data
   */
  GetAvailStaffAPI(
    IsFirstAvaliable: boolean,
    argService: ServiceListModel,
    staff_list: any[],
    clickInfo: string
  ) {
    try {
      this._AvaliableStaffList = [];
      this.apiResponseReceived = false;
      let { l_AvailResources, l_staff_list } = this.commonDataSetmethod(
        argService.service_id,
        staff_list
      );
      l_AvailResources.resource_ids = l_staff_list;
      l_AvailResources.type = 'DAY';
      this.httpProvider.getAvailDoctorData(l_AvailResources).subscribe({
        next: (res: any) => {
          if (res != undefined) {
            this._AvaliableStaffList = res;
            this._AvaliableStaffList?.map(async (x: any) => {
              if (x?.logo !== undefined) {
                this.profileImage = x.profileImage = await this.downloadAndReturnProfileImage(x.logo);
              } else {
                this.initials = x.initialImage = this.getInitials(x?.name);
              }
            });
            this._AvaliableStoreStaffList = this._AvaliableStaffList;
            this.commonDtoService._DTOAvaliableStaffList = this._AvaliableStaffList;
            this.commonDtoService._DTOAvaliableStaffList?.map(async (x: any) => {
              if (x?.logo !== undefined) {
                x.profileImage = await this.downloadAndReturnProfileImage(x.logo);
              } else {
                x.initialImage = this.getInitials(x?.name);
              }
            });
            this.httpProvider.logText(
              'Get available staff of resource',
              this._AvaliableStaffList
            );
            l_AvailResources.service_name = argService.service_name;
            this._AvailResources = l_AvailResources;
            if (IsFirstAvaliable && this._AvaliableStaffList.length != 0) {
              this.navigateToSelectTimeFromDD(true, null, l_AvailResources, argService,clickInfo);
            }
          }
          if (IsFirstAvaliable && this._AvaliableStaffList.length == 0) {
            this.globleMethod.presentToastFailure(
              'Currently no providers are available'
            );
          }
          this.apiResponseReceived = true;
        },
        error: (error) => {
          if (error.error.code == '7011') {
            this.globleMethod.presentToastFailure(
              'Currently no providers are available'
            );
          }
          console.error(
            'Error while fetching available resource : ' + error.error.message
          );
          this.apiResponseReceived = true;
        },
      });
    } catch (error) {
      this.apiResponseReceived = true;
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('').substring(0, 2);
    return initials.toUpperCase();
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

  GetValueFromDayTimeComp(event: any) {
    if (event) {
      this._AvailDayPageLoad = false;
      this._AvailTimePageLoad = false;
      this._selectedStaff = 0;
    }
    //this.ngOnInit();
  }

  public onChangePageNumber(pagenumber: any) {
    this.currentPage = pagenumber;
    this.paginationModel.pageRequest.pageNo = this.currentPage;
    this.populateService();
  }

  /***
   * avail-day resource
   */
  goBack() {
    this._AvailDayPageLoad = false;
  }

  getCountForDate(dateToFind: string) {
    if (this.countsArray.length !== 0) {
      this.countsArray.forEach((element: any) => {
        if (element.date == dateToFind) {
          return element.count;
        }
      });
    }
    return 0; // Return 0 if the date is not found
  }

  async getAllAvaliable(l_AvailReqResources: any) {
    if (Object.keys(l_AvailReqResources).length !== 0) {
      delete l_AvailReqResources.service_name;
      await this.httpProvider
        .getAvailResourceData(l_AvailReqResources)
        .subscribe({
          next: (res: any) => {
            this._AvailDayRespDetails = res;
            this._AvailDayRespDetails?.map(async (x: any) => {
              if (x?.available_resources_dto?.logo !== undefined) {
                x.available_resources_dto.profileImage = await this.downloadAndReturnProfileImage(x.available_resources_dto.logo);
              } else {
                x.available_resources_dto.initialImage = this.getInitials(x.available_resources_dto.name);
              }
            });
            this.httpProvider.logText(
              'Availability data successfully retrieved',
              1
            );
          },
          error: (error) => {
            this.globleMethod.presentToastFailure(
              'Error while fetching available resource : ' + error.message
            );
          },
        });
    }
  }

  selectTimeSideMenu(argData: boolean) {
    if (argData) {
      this.menuCtrl.open('sidePanelTime');
      //this.getAvaliableTimeForSidePanel();old code
    }
    return;
  }

  getAvaliableTimeForSidePanel() {
    let l_AvailResources = this._AvailReqResources;
    delete l_AvailResources.service_name;//ss
    l_AvailResources.type = 'TIME';
    if (Object.keys(l_AvailResources).length !== 0) {
      this.httpProvider.getAvailResourceData(l_AvailResources).subscribe({
        next: (res: any) => {
          this._AvailTimeDeatils = res;
          this._AvailTimeDeatils?.map(async (x: any) => {
            if (x?.available_resources_dto.logo !== undefined) {
              x.available_resources_dto.profileImage = await this.downloadAndReturnProfileImage(x.available_resources_dto.logo);
            } else {
              x.available_resources_dto.initialImage = this.getInitials(x?.available_resources_dto.name);
            }
          });
          this.groupDataByDate();
          this.httpProvider.logText(
            'Availability data successfully retrieved',
            1
          );
        },
        error: (error) => {
          this.globleMethod.presentToastFailure(
            'Error while fetching available resource : ' + error.error.message
          );
        },
      });
    }
  }

  groupDataByDate() {
    const timeSlotCounts: any = {};
    this.groupedTimeData = {};
    if (this._AvailTimeDeatils.length != 0)
      this._AvailTimeDeatils.forEach((outerEle) => {
        outerEle.available_date_and_time_dto.time_slot.forEach((item: any) => {
          const date = item.date;
          // Check if the date exists in the counts object, if not, initialize it
          if (!timeSlotCounts[date]) {
            timeSlotCounts[date] = 0;
          }
          // Increment the count for the current date
          timeSlotCounts[date]++;

          if (!this.groupedTimeData[date]) {
            this.groupedTimeData[date] = [];
          }
          this.groupedTimeData[date].push(item);
        });
      });
    const countsArray = Object.entries(timeSlotCounts).map(([date, count]) => ({
      date,
      count,
    }));
    this.countsArray = this.fillDateCounts(
      countsArray,
      this.todayDateIntoString(),
      this.getDateAfterSixDays()
    );
  }

  getDateList(startDate: any, endDate: any) {
    let currentDate = new Date(startDate);
    const dateCollection = [];
    while (currentDate <= endDate) {
      dateCollection.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateCollection;
  }

  fillDateCounts(dateArray: any, startDate: any, endDate: any) {
    let dateCounts: any = {};

    // Populate the dateCounts object with the counts from the input array
    dateArray.forEach((item: any) => {
      dateCounts[item.date] = item.count;
    });

    // Helper function to increment date by one day
    function incrementDate(dateStr: any) {
      let [year, month, day] = dateStr.split('-').map(Number);
      let date = new Date(year, month - 1, day);
      date.setDate(date.getDate() + 1);
      year = date.getFullYear();
      month = ('0' + (date.getMonth() + 1)).slice(-2);
      day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }

    // Create the result array
    let result = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      result.push({
        date: currentDate,
        count: dateCounts[currentDate] || 0,
      });
      currentDate = incrementDate(currentDate);
    }
    return result;
  }

  closePanel() {
    this.menuCtrl.close('sidePanelTime');
  }

  openAllDrListMenu() {
    this._hideFirstPanel = true;
  }
  closeSecondPanel() {
    this._hideFirstPanel = false;
  }

  NavigateToSelectPatientpage(
    argData: AvailTimeAPIResp,
    arrRow: TimeSlotModel,
    argdate: any
  ) {
    let l_ProviderDetails = new ProviderDetailsModel();
    l_ProviderDetails.start_date = argdate;
    l_ProviderDetails.enddate = this._AvailReqResources.end_date;
    l_ProviderDetails.name = argData?.available_resources_dto?.name;
    l_ProviderDetails.service_id = this._AvailReqResources?.service_id;
    l_ProviderDetails.location_id = this._AvailReqResources?.location_id;
    l_ProviderDetails.resource_id = argData?.available_resources_dto?.id;
    l_ProviderDetails.start_date_time = arrRow?.start_date_time;
    l_ProviderDetails.end_date_time = arrRow?.end_date_time;
    l_ProviderDetails.display_time = arrRow?.display_time;
    l_ProviderDetails.duration = arrRow?.duration;
    l_ProviderDetails.service_name = this._serviceDTO?.service_name;
    l_ProviderDetails.service_type = this._serviceDTO?.service_type;
    l_ProviderDetails.service_duration = this._serviceDTO?.service_duration;
    l_ProviderDetails.profileImage = argData?.available_resources_dto?.profileImage;
    l_ProviderDetails.initialImage = argData?.available_resources_dto?.initialImage;
    this.commonDtoService._ProviderDetails = l_ProviderDetails;
    let l_formData ={
      availDayPageLoad :this._AvailDayPageLoad,
      availTimePageLoad :this._AvailTimePageLoad
    }
    this.formDataService.setFormData(l_formData);
    this.router.navigate(['/appointment/select-patient']);
  }
  //side panel for future appointment
  showDateDropdown() {
    this.shownDateDD = this.shownDateDD ? false : true;
    this.currentMonth = this.today?.getMonth();
    this.currentYear = this.today?.getFullYear();
    this.maxDate = new Date(this.today);
    this.maxDate.setFullYear(this.maxDate?.getFullYear() + 1);
    this.generateYearRange();
    this.generateCalendar();
    this.onDateSelect(this.formatDateToYYYYMMDD(this.today))
  }

  formatDateToYYYYMMDD(dateObj: Date) {
    let year = dateObj?.getFullYear();
    let month = ('0' + (dateObj?.getMonth() + 1)).slice(-2);
    let day = ('0' + dateObj?.getDate())?.slice(-2);
    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  
  generateYearRange() {
    const startYear = this.today.getFullYear();
    const endYear = this.maxDate.getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      this.yearRange.push(year);
    }
  }

  generateCalendar() {
    const today = new Date();
    this.timeSlotsForDate = [];
    const isCurrentMonthAndYear =
    this.currentYear === today.getFullYear() && this.currentMonth === today.getMonth();

    // If it's the current month, set the first date to today
    const firstDateOfMonth = isCurrentMonthAndYear ? today : new Date(this.currentYear, this.currentMonth, 1);
    const lastDateOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

    const firstDateFormatted = this.formatDateToYYYYMMDD(firstDateOfMonth);
    let lastDateFormatted = this.formatDateToYYYYMMDD(lastDateOfMonth);

    // Ensure lastDateFormatted is not earlier than firstDateFormatted
    if (new Date(lastDateFormatted) < new Date(firstDateFormatted)) {
      lastDateFormatted = firstDateFormatted;
    }


    const firstDay = firstDateOfMonth.getDay();
    const lastDate = lastDateOfMonth.getDate();

    this.daysArray = [];

    for (let i = 0; i < firstDay; i++) {
      this.daysArray.push({ date: '', inactive: true });
    }

    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      const inRange = date >= this.today && date <= this.maxDate;
      this.daysArray.push({
        date: i,
        dateFormatted: this.formatDateToYYYYMMDD(date),
        isToday: this.isToday(date),
        inactive: !inRange,
        selected: this.isToday(date)
      });
    }
    this.showTimeSlots = false;
    // Check if the first date is not less than today's date before calling getAvaliableDate
    if (firstDateOfMonth >= today) {
      let availResources = this.commonDtoService._DTOAvailResources;
      availResources.start_date = firstDateFormatted;
      availResources.end_date = lastDateFormatted;
      this.getAvaliableDateInCalendar(availResources).subscribe(response => {
        if (response?.length > 0) {
          this.processAvailabilityData(response, 0);
        }

      });
    } else {
      console.log('Skipping getAvaliableDate call as the start date is less than today.');
    }
  }

  isToday(date: Date): boolean {
    return (
      date.getDate() === this.today.getDate() &&
      date.getMonth() === this.today.getMonth() &&
      date.getFullYear() === this.today.getFullYear()
    );
  }

  selectDateFromCalendar(day: any) {
    if (!day.inactive) {
      this.daysArray.forEach(d => d.selected = false);
      day.selected = true;
      this.onDateSelect(day?.dateFormatted);
    }
  }

  onDateSelect(date: string) {
    this.selectedDate = date;
    this.showTimeSlots = true;
    let availResources = this.commonDtoService._DTOAvailResources;
    availResources.start_date = date;
    availResources.end_date = date;
    this.getAvaliableTimeslotInCalendar(availResources).subscribe(response => {
      if (response?.length > 0) {
        let l_AvailableTimeslotsData: any[] = [];
        this.uniqueDatesArrayForCalendar = []
        this.uniqueDatesArrayForCalendar = this.exactUnqiueDate(response);
        l_AvailableTimeslotsData = this.groupDataByDateForCalendar(response);
        this.getTimeSlotsForDate(l_AvailableTimeslotsData, date);
      }
    });

  }

  getAvaliableTimeslotInCalendar(l_AvailReqResources: any) {
    let l_AvailReqResourcesData = l_AvailReqResources
    if (Object.keys(l_AvailReqResourcesData).length != 0) {
      if (l_AvailReqResourcesData.service_name != undefined) {
        delete l_AvailReqResourcesData.service_name;
      }
      l_AvailReqResourcesData.type = 'TIME';
      return this.httpProvider.getAvailResourceData(l_AvailReqResourcesData).pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error: any) => {
          console.error('Endpoint call error: ', error);
          return of([]);
        })
      );
    } else {
      return of([]);
    }
  }

  isTimeSlotAvailable(date: any) {
    const exists = this.uniqueDatesArrayForCalendar.includes(date);
    return exists;
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  isPrevDisabled(): boolean {
    const minMonth = this.today.getMonth();
    const minYear = this.today.getFullYear();
    return (
      this.currentYear < minYear ||
      (this.currentYear === minYear && this.currentMonth <= minMonth)
    );
  }

  isNextDisabled(): boolean {
    const maxMonth = this.maxDate.getMonth();
    const maxYear = this.maxDate.getFullYear();
    return (
      this.currentYear > maxYear ||
      (this.currentYear === maxYear && this.currentMonth >= maxMonth)
    );
  }

  processAvailabilityData(availabilityData: any, index: number) {
    const daySlots = availabilityData[0]?.available_date_and_time_dto?.day_slot;
    this.daysArray?.forEach(day => {
      const matchingSlot = daySlots?.find((slot: any) => slot?.date === day?.dateFormatted);
      if (matchingSlot) {
        day.inactive = !matchingSlot?.available;
      }
    });
  }

  getTimeSlotsForDate(argData: any, searchDate: string) {
    argData?.forEach((element: any) => {
      let dateArray = []
      dateArray?.push(element?.date)
      const timeSlotObject = dateArray?.find((slot: any) =>
        slot?.hasOwnProperty(searchDate)
      );
      this.timeSlotsForDate = timeSlotObject
        ? timeSlotObject[searchDate]
        : [];
      return this.timeSlotsForDate;
    });
  }

  getAvaliableDateInCalendar(l_AvailReqResources: any) {
    let l_AvailReqResourcesData = l_AvailReqResources
    if (Object.keys(l_AvailReqResourcesData).length != 0) {
      if (l_AvailReqResourcesData.service_name != undefined) {
        delete l_AvailReqResourcesData.service_name;
      }
      l_AvailReqResourcesData.type = 'DAY';
      return this.httpProvider.getAvailResourceData(l_AvailReqResourcesData).pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error: any) => {
          console.error('Endpoint call error: ', error);
          return of([]);
        })
      );
    } else {
      return of([]);
    }
  }

  exactUnqiueDate(arg: any[]) {
    let uniqueDatesArray: any = []
    arg?.forEach(staffData => {
      const uniqueDatesSetForRow = new Set<string>();
      staffData.available_date_and_time_dto.time_slot.forEach((timeSlot: any) => {
        const date = timeSlot.date;
        uniqueDatesSetForRow.add(date);
      });
      uniqueDatesArray.push(Array.from(uniqueDatesSetForRow));
    });
    return uniqueDatesArray
  }


  groupDataByDateForCalendar(argData: any) {
    let l_AvailableStaffData: any[] = [];
    if (argData?.length !== 0) {
      argData?.forEach((outerEle: any, Outerindex: number) => {
        let l_details = outerEle.available_resources_dto;
        let groupedTimeData: any = {}; // Reset groupedTimeData for each staff member
        outerEle.available_date_and_time_dto?.time_slot?.forEach((item: any, innerIndex: number) => {
          const date = item.date;
          if (!groupedTimeData[date]) {
            groupedTimeData[date] = [];
          }
          groupedTimeData[date].push(item);
        });
        let ObjectData = {
          date: groupedTimeData,
          available_resources_dto: l_details,
          selectedDateIndex: 0
        };
        l_AvailableStaffData.push(ObjectData);
      });
    }
    return l_AvailableStaffData
  }

  toggleIconColorPast() {
    this.isHoveredPast = !this.isHoveredPast; // Toggle the state
  }

}
