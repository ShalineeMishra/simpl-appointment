import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../services/base-service.service';
import { AvaliableStaffListModel } from '../models/appointment.model';
import { HttpRestApiService } from './http-rest-api-service';

@Injectable({
  providedIn: 'root'
})
export class HTTPProviderService extends BaseService {
  _MonthNames: string[] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  apiConsumerUrl!: string | '';
  apiProviderUrl!: string | '';
  partnerProviderUrl!: string | '';
  partnerUrl!: string | '';
  apiAuthenticationUrl!: string | '';
  transactionServiceUrl: string | '';

  constructor(http: HttpClient,
    private httpService: HttpRestApiService) {
    super(http);

    this.apiConsumerUrl = environment.consumerApiPrefix;
    this.apiAuthenticationUrl = environment.consumerApiPrefix;
    this.apiProviderUrl = environment.providerApiPrefix;
    this.partnerUrl = environment.partnerApiPrefix;
    this.transactionServiceUrl = environment.transactionApiPrefix;
    this.partnerProviderUrl = environment.partnerApiPrefix;
  }

  getAllAppointmentsByLocationId<AppointmentListModel>(argLocationId: number, requestBody?: any): Observable<AppointmentListModel> {
    return this.post<AppointmentListModel>(this.apiProviderUrl + `/api/v1/appointment/all/${argLocationId}`, requestBody);
  }

  cancelAppointment(requestBody: any): Observable<any> {
    return this.post<any>(this.apiProviderUrl + `/api/v1/appointment/cancel`, requestBody);
  }

  completeAppointment(requestBody: any): Observable<any> {
    return this.post<any>(this.apiProviderUrl + `/api/v1/appointment/complete`, requestBody);
  }

  getAllLocationByProviderId<LocationListAPIRespModel>(argProviderId: number): Observable<LocationListAPIRespModel> {
    return this.get<LocationListAPIRespModel>(this.apiProviderUrl + `/api/v1/provider_location/all/${argProviderId}`);
  }

  getProviderName(email: any) {
    return this.get(this.apiProviderUrl + `/api/v1/professional/email/${email}`);
  }

  getAllServiceByLocationId(argLocationId: number, requestBody: any): Observable<any> {
    return this.post<any>(this.apiProviderUrl + `/api/v1/appointment/service/all/${argLocationId}`, requestBody);
  }

  getAvailResourceData(AvailTimeResourceData: any): Observable<any> {
    return this.post<any>(this.apiProviderUrl + `/api/v1/availability/resources`, AvailTimeResourceData);
  }

  getAvailDoctorData(AvailTimeResourceData: any): Observable<AvaliableStaffListModel[]> {
    return this.post<any>(this.apiProviderUrl + `/api/v1/availability/resources/available`, AvailTimeResourceData);
  }

  createAppointment(CreateAppointmentReq: any): Observable<any> {
    return this.post<any>(this.apiProviderUrl + `/api/v1/appointment`, CreateAppointmentReq);
  }

  getExportAppointmentList(locationID: string, bodyParam: any): Observable<any> {
    return this.postBlob(this.apiProviderUrl + `/api/v1/appointment/export/${locationID}`, bodyParam);
  }

  /**
   * patient api 
   */
  getPatientList(payload?: any): Observable<any> {
    return this.post<any>(this.apiConsumerUrl + '/api/v1/consumer/all', payload);
  }

  getPatientListBasedOnProvider(providerId: any, payload?: any): Observable<any> {
    return this.post<any>(this.apiConsumerUrl + `/api/v1/consumer/all/${providerId}`, payload);
  }

  getPatientDataById(simple_id?: any) {
    return this.get(this.apiConsumerUrl + `/api/v1/consumer/${simple_id}`);
  }

  getCallwithAppointmentId(apptId: any) {
    return this.get(this.transactionServiceUrl + `/api/v1/telehealth/video/call/start/${apptId}`)
  }

  addpatient(patientbody: any) {
    return this.post(this.apiConsumerUrl + '/api/v1/consumer', patientbody);
  }

  updatePatientEmail(SimplId: any, email: any): Observable<any> {
    return this.patch<any>(this.apiConsumerUrl + `/api/v1/consumer/${SimplId}`, email);
  }

  /**
   * common method for console 
   */
  logText(argKey: string, argText: any) {
    //console.log(argKey, argText)
  }

  getDayName(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const dateObject: Date = new Date(year, month - 1, day); // Note: month is zero-based
    const dayOfWeek: number = dateObject.getDay();
    const dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName: string = dayNames[dayOfWeek];
    return dayName;
  }

  getMonthNameAndDate(dateString: string) {
    // Parse the date string to get year, month, and day components
    const [year, month, day] = dateString.split('-').map(Number);
    const monthName = this._MonthNames[month - 1]; // Note: month is 1-based in the input string
    const formattedDate = `${monthName} ${day}`;
    return formattedDate;
  }

  getDate(dateString: string) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Note: month is zero-based
    if (isNaN(date.getTime())) {
      return undefined;
    }
    return day;
  }

  getMonthAndYear(dateString: string) {
    const date = new Date(dateString);
    const monthName = this._MonthNames[date.getMonth()];
    const fullYear = date.getFullYear();
    return monthName + " " + fullYear;
  }

  calculateLastTime(argTime: any, argDuration: any) {
    const timeParts = argTime.split(':');
    let hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1].split(' ')[0]);
    const meridian = timeParts[1].split(' ')[1];

    hours = meridian === 'PM' ? hours + 12 : hours;
    const totalMinutes = hours * 60 + minutes + argDuration;

    const lastHours = Math.floor(totalMinutes / 60);
    const lastMinutes = totalMinutes % 60;

    const lastMeridian = lastHours >= 12 ? 'PM' : 'AM';
    const lastFormattedHours = lastHours % 12 === 0 ? 12 : lastHours % 12;

    return `${lastFormattedHours}:${lastMinutes.toString().padStart(2, '0')} ${lastMeridian}`;
  }

  calculateAgeByDOB(dateOfBirth: string) {
    const today = new Date();
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }
      return age;
    }
    return 0;
  }

  formatDateToYYYYMMDD(): string {
    try {
      const parsedDate: Date = new Date();
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const formattedLocaleDate: string = parsedDate.toLocaleDateString('en-US', options);
      const year: string = parsedDate.getFullYear().toString();
      const month: string = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const day: string = parsedDate.getDate().toString().padStart(2, '0');
      const formattedDate: string = `${year}-${month}-${day}`;
      return formattedDate;
    } catch (error: any) {
      console.error('An error occurred in formatDateToYYYYMMDD(): ', error);
    }
    return "";
  }

  downloadProfileImage(path: string) {
    return this.get(this.apiProviderUrl + `/api/v1/document?path=${path}`);
  }

  downloadPatientProfileImage(simplId: string) {
    return this.get(this.apiConsumerUrl + `api/v1/document/${simplId}`);
  }

  /**
   * patient API
   * @param searchText 
   * @returns 
   */
  searchplanName(searchText: any) {
    return this.httpService.get(this.partnerProviderUrl + `/api/v1/payers_list?queryString=${searchText}`);
  }

  getLoggedInProviderDetail(email: any) {
    return this.httpService.get(this.apiProviderUrl + `/api/v1/professional/email/${email}`);
  }


  createInsuranceURL() {
    return this.apiConsumerUrl + `/api/v1/consumer/create-consumer-with-insurance`
  }

  savepatient(patientbody: any) {
    return this.httpService.post(this.apiConsumerUrl + '/api/v1/consumer', patientbody);
  }
  addpatientWithInsurance(patientbody: any) {
    return this.httpService.post(this.apiConsumerUrl + 'api/v1/consumer/create-consumer-with-insurance', patientbody);
  }
  getPatientdata(id?: any) {
    return this.httpService.get(this.apiConsumerUrl + `/api/v1/consumer/${id}`);
  }

  getAllStatesByStatus<IState>(active: boolean): Observable<IState[]> {
    return this.getDataList<IState[]>(this.partnerUrl + `/api/v1/states/active/${active}`);
  }
}
