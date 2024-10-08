import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonDtoService } from '../../services/common.dto.service';
import { HTTPProviderService } from '../../services/http-provider.service';
import { Location } from '@angular/common';
import { AvailTimeAPIResp, AvailTimeReqResourceModel, ProviderDetailsModel, ServiceDTO, TimeSlotModel } from '../../models/appointment.model';
import { catchError, map, of } from 'rxjs';
import { ToastMessageService } from 'simpl-shared-ui';

@Component({
  selector: 'simplerepo-avail-time-resource',
  templateUrl: './avail-time-resource.component.html',
  styleUrls: ['./avail-time-resource.component.scss'],
})
export class AvailTimeResourceComponent implements OnInit {
  _AvailReqResources: AvailTimeReqResourceModel;
  _AvailTimeRespDetails: AvailTimeAPIResp[];
  _TimeSoltList: TimeSlotModel[];
  @Input() AvailReqResources: AvailTimeReqResourceModel;
  @Output() IsFirstLoad: EventEmitter<boolean> = new EventEmitter();
  groupedTimeData: { [key: string]: any[] } = {};
  _activeTime: any



  _AvailableStaffData: any[] = [];
  selectedDateIndex: number = 0;
  uniqueDatesArrayPerRow: string[][] = [];
  public profileImage: string = "";
  initials: string = "";
  image: string = '';
  _serviceDTO: ServiceDTO = new ServiceDTO();
  currentDateGroupIndex: number = 0;
  isHoveredPast: boolean = false;

  calendarShowHide: boolean[] = [];
  timeSlotsForDate: any = [];
  uniqueDatesArrayForCalendar: string[][] = [];
  selectedDate: string;
  popupWidth: number = 200; // default width
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
  _clickInfo: any;

  constructor(private router: Router,
    public httpProvider: HTTPProviderService,
    private toastMessageService: ToastMessageService,
    public commonDtoService: CommonDtoService,
    private _location: Location) {
    this._AvailReqResources = new AvailTimeReqResourceModel();
    this._AvailTimeRespDetails = [];
    this._TimeSoltList = [];
    this.currentMonth = this.today?.getMonth();
    this.currentYear = this.today?.getFullYear();
    this.maxDate = new Date(this.today);
    this.maxDate.setFullYear(this.maxDate?.getFullYear() + 1);
  }

  ngOnInit() {
    this._AvailReqResources = this.commonDtoService._DTOAvailResources;//get data from service file
    this._serviceDTO = this.commonDtoService._ServiceDetailsDTO;
    this.getAllAvaliable(this._AvailReqResources);
    this._clickInfo = this.commonDtoService._clickInfoForNextPage;
    if (this._clickInfo == '3') {
      this.showDateDropdown(0, null);
    }
  }

  goBack() {
    this._location.back();
    this.IsFirstLoad.emit(true);
  }

  getAllAvaliable(l_AvailReqResources: any) {
    if (Object.keys(l_AvailReqResources).length != 0) {
      delete l_AvailReqResources.service_name;
      this.httpProvider.getAvailResourceData(l_AvailReqResources).subscribe({
        next: (res: any) => {
          this._AvailTimeRespDetails = res;
          this._AvailTimeRespDetails?.map(async (x: any) => {
            if (x.available_resources_dto.logo) {
              x.available_resources_dto.profileImage = await this.downloadAndReturnProfileImage(x.available_resources_dto.logo);
            } else {
              x.available_resources_dto.initialImage = this.getInitials(x?.available_resources_dto.name);
            }
          });
          if (this._AvailTimeRespDetails != undefined) {
            this.uniqueDatesArrayPerRow = this.exactUnqiueDate(this._AvailTimeRespDetails);
            this._AvailableStaffData = this.groupDataByDate(this._AvailTimeRespDetails);
          }
        },
        error: (error: any) => {
          this.toastMessageService.presentErrorMessage("Error while fetching available resource : " + error.message);
        }
      });
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


  groupDataByDate(argData: any) {
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

  nextDate(item: any, index: number) {
    item.selectedDateIndex = (item.selectedDateIndex + 1) % this.uniqueDatesArrayPerRow[index].length;
  }

  previousDate(item: any, index: number) {
    item.selectedDateIndex = (item.selectedDateIndex - 1 + this.uniqueDatesArrayPerRow[index].length) % this.uniqueDatesArrayPerRow[index].length;
  }

  closeScreen() {
    this.IsFirstLoad.emit(true)
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

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('').substring(0, 2);
    return initials.toUpperCase();
  }

  navigateToSelectPatientpage(argData: AvailTimeAPIResp, arrslotdata: TimeSlotModel) {
    let l_ProviderDetails = new ProviderDetailsModel();
    l_ProviderDetails.start_date = arrslotdata?.date;
    l_ProviderDetails.enddate = this._AvailReqResources?.end_date;
    l_ProviderDetails.service_id = this._AvailReqResources?.service_id;
    l_ProviderDetails.location_id = this._AvailReqResources?.location_id;
    l_ProviderDetails.name = argData?.available_resources_dto?.name;
    l_ProviderDetails.resource_id = argData?.available_resources_dto?.id;
    l_ProviderDetails.start_date_time = arrslotdata?.start_date_time;
    l_ProviderDetails.end_date_time = arrslotdata?.end_date_time;
    l_ProviderDetails.display_time = arrslotdata?.display_time;
    l_ProviderDetails.duration = arrslotdata?.duration;
    l_ProviderDetails.service_name = this._serviceDTO?.service_name;
    l_ProviderDetails.service_type = this._serviceDTO?.service_type;
    l_ProviderDetails.service_duration = this._serviceDTO?.service_duration;
    l_ProviderDetails.profileImage = argData.available_resources_dto?.profileImage;
    l_ProviderDetails.initialImage = argData.available_resources_dto?.initialImage;
    this.commonDtoService._ProviderDetails = l_ProviderDetails;

    this.router.navigate(["/appointment/select-patient"]);
  }


  //new code future appointment
  showDateDropdown(idx: number, availData: any) {
    this.calendarShowHide[idx] = this.calendarShowHide[idx] ? false : true;
    this.currentMonth = this.today?.getMonth();
    this.currentYear = this.today?.getFullYear();
    this.maxDate = new Date(this.today);
    this.maxDate.setFullYear(this.maxDate?.getFullYear() + 1);
    this.generateYearRange();
    this.generateCalendar(idx ,availData);
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

  generateCalendar(idx: number, availData : any) {
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
      //if multiple available pass only selected resource id
      if(availData !== null && availData?.available_resources_dto !== undefined){
        let resouce : any = this.commonDtoService?._DTOAvaliableStaffList?.find((resource: any) => resource.name === availData?.available_resources_dto?.name);
        availResources.resource_ids = [];
        availResources.resource_ids?.push(resouce?.id); 
      }
      this.getAvaliableDateInCalendar(availResources).subscribe((response: any) => {
        if (response?.length > 0) {
          this.processAvailabilityData(response, idx);
        }

      });
    } else {
      console.log('Skipping getAvaliableDate call as the start date is less than today.');
    }
  }

  processAvailabilityData(availabilityData: any, index: number) {
    const daySlots = availabilityData[index]?.available_date_and_time_dto?.day_slot;
    this.daysArray?.forEach(day => {
      const matchingSlot = daySlots?.find((slot: any) => slot?.date === day?.dateFormatted);
      if (matchingSlot) {
        day.inactive = !matchingSlot?.available;
      }
    });
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
    this.getAvaliableTimeslotInCalendar(availResources).subscribe((response: any) => {
      if (response?.length > 0) {
        let l_AvailableTimeslotsData: any[] = [];
        this.uniqueDatesArrayForCalendar = []
        this.uniqueDatesArrayForCalendar = this.exactUnqiueDate(response);
        l_AvailableTimeslotsData = this.groupDataByDate(response);
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

  isTimeSlotAvailable(date: any) {
    const exists = this.uniqueDatesArrayForCalendar?.includes(date);
    return exists;
  }

  prevMonth(idx: number, availData: any) {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(idx ,availData);
  }

  nextMonth(idx: number,availData: any) {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(idx,availData);
  }

  isPrevDisabled(): boolean {
    const minMonth = this.today?.getMonth();
    const minYear = this.today?.getFullYear();
    return (
      this.currentYear < minYear ||
      (this.currentYear === minYear && this.currentMonth <= minMonth)
    );
  }

  isNextDisabled(): boolean {
    const maxMonth = this.maxDate?.getMonth();
    const maxYear = this.maxDate?.getFullYear();
    return (
      this.currentYear > maxYear ||
      (this.currentYear === maxYear && this.currentMonth >= maxMonth)
    );
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
}

