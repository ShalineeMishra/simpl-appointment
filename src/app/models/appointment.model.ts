import { PageResponse, PageableObject } from "../models/pagination.model";

export class APIBaseModel{
    code : number;
    message : string;
}
/**
 * Appointment list model
 */
export class AppointmentListModel extends PageResponse {
    count : number;
    total :number;
    content : AppointmentDataModel[];
    pageable : PageableObject;

    constructor(){
        super();
        this.content = [];
    }
}

export class AppointmentDataModel{
    id : string;
    resource_name : string;
    resource_email: string;
    create_date: any;
    start_date_time: string;
    end_date_time : string;
    date: string;
    time :number;
    duration :number;
    status: string;
    confirmation_number : string;
    confirmed :boolean;
    email : string;
    name : string;
    simpl_id : string;
    service_id: number;
    service_name: string;
    service_type: string;
    professional_id :number;
    profileImage : string;
    initialImage : string;
}


/**
 * This model is used for provider list api
 */
export class LocationListAPIRespModel extends APIBaseModel{
    body : LocationListModel[];

    constructor(){
        super();
        this.body = [];
    }
}

export class LocationListModel{
    id: number;
    npi: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    primary_location: boolean;
    name: string;
}

/**
 * this model used for service list 
 */
export class ServiceAPIRespModel extends PageResponse {
        content: ServiceListModel[];
        pageable : PageableObject;
        constructor(){
            super()
            this.content = []
        }
}

export class ServiceListModel {
    service_id : number;
    service_name : string;
    service_duration : number;
    service_type : string;
    staff_list: StaffListModel[];
    profileImage : string;
    initialImage : string;
    constructor(){
        this.staff_list = [];
    }

}

export class ServiceDTO{
    service_id : number;
    service_name? : string;
    service_duration : number;
    service_type : string; 
}

export class StaffListModel{
    id : number;
    name : string;
    time_zone : string;
}

/**
 * this model is used to api request model and data transfer
 */
export class AvailTimeReqResourceModel{
    location_id : number;
    service_id : number;
    service_name?: string;
    start_date : string;
    end_date : string;
    resource_ids : any[];
    type : string;
    constructor(){
        this.resource_ids = [];
    }
}

/**
 * Get available time of resource API Response model class
 */
export class AvailTimeAPIResp{
    available_resources_dto : AvailTimeDayResModel;
    available_date_and_time_dto : AvailableTimeModel;
    
    constructor(){
        this.available_resources_dto = new AvailTimeDayResModel();
        this.available_date_and_time_dto = new AvailableTimeModel();
    }
}

export class AvailTimeDayResModel{
    id : number;
    name : string;
    logo : string;
    time_zone: string;
    profileImage : string;
    initialImage : string;
    constructor(){
        this.logo = this.logo;
    }
}

export class AvailableTimeModel{
        type : string;
        date : string;
        time_slot : TimeSlotModel[];

        constructor(){
            this.time_slot = [];
        }
}

export class TimeSlotModel{
    date : string;
    display_time : string;
    time : number;
    duration :  number;
    start_date_time : string;
    end_date_time : string;
}

export class AvaliableStaffListModel{
    id : number;
    name : string;
    logo : string;
    status : string;
    profileImage : string;
    initialImage : string;
}

/**
 * Get available day of resource API Response model class
 */
export class AvailDayAPIResp{
    available_resources_dto : AvailTimeDayResModel;
    available_date_and_time_dto : AvailableDayModel;
    
    constructor(){
        this.available_resources_dto = new AvailTimeDayResModel();
        this.available_date_and_time_dto = new AvailableDayModel();
    }
}

export class AvailableDayModel{
        type : string;
        date : string;
        enddate: string;
        day_slot : DaySlotModel[];

        constructor(){
            this.day_slot = [];
        }
}

export class DaySlotModel{
    date : string;
    booking_count : number;
    available : boolean;
    reason :  string;
}

export class ProviderDetailsModel{
    name: string;
    start_date : string;
    enddate: string;
    display_time : string;
    duration : number;
    resource_id : number;
    service_id : number;
    location_id : number;
    start_date_time : string;
    end_date_time : string;
    service_name? : string;
    service_type: string;
    service_duration: number;
    logo?: string;
    provider_name: string;
     profileImage : string;
    initialImage : string;
}
/**
 * sunmit appointment model
 */
export class CreateAppointmentReqModel{
        location_id: any;
        service_id : any;
        resource_id: any;
        start_date_time: string;
        end_date_time: string;
        consumer_email: string;
        consumer_name : string;
        notes: string;
        simpl_id: string;
}

/**
 * patient details api model
 */
export class PatientDetailsModel{
    id : number;
    partner_number : string;
    phone : string;
    email: string;
    first_name: string;
    location_id : number;
    active: string;
    middle_name: string;
    last_name: string;
    status: string;
    hc_professional_id : number;
    simpl_id: string;
    role_type: any;
    ssn: string;
    authentication_status: string;
    gender: string;
    consumer_detail :ConsumerDetail;
    consumer_address :ConsumerAddress[];
    consumer_insurance : consumerInsurance[];
    profileImage : string;
    initialImage : string;
    constructor(){
        this.consumer_detail = new ConsumerDetail();
        this.consumer_address = [];
        this.consumer_insurance = [];
    }
}
    
export class ConsumerDetail{
    date_of_birth : string;
    gender : string;
    language: string;
    created_date: string;
    ssn: string;
    medical_record_name : string;
    contact_channel : string;
}

    
export class ConsumerAddress{
    city : string;
    state: string;
    country: string;
    zip: string;
    address_line_1: string;
    address_line_2: string;
}

export class consumerInsurance{
    relation : string;
    plan_name : string;
    member_id : string;
    group_id : string;
    insurance_type : string;
}

export class apptCancelCompleteModel{
    appointment_id : any;
    location_id : any;
}

export class TelehealthRespModel{
    user_id: string;
    token: string;
    call_id: string;
    ai_scribe: boolean;
    telehealth_session_id: any;
    simpl_id: string;
}

export class SortingObject {
    key: string;
    value: string;
}
export class SearchPaginationModel {
    globalOperator!: string;
    pageRequest!: PageRequest;
    searchRequestDto!: SearchRequestDto[];
}

export class PageRequest {
    pageNo!: number;
    pageSize!: number;
    sort!: string;
    sortByColumn!: string;
}

export class SearchRequestDto {
    column!: string;
    value!: string;
    joinTable!: string;
    operation!: string;
}

export class LoggedInUser {
    id!: number;
    firstName!: string;
    lastName!: string;
    locationId!: any;
    providerId!: number;
    roleType!: string;
    constructor() {}
  }


  export interface IState {
    id?: number;
    name?: string;
    code?: string;
    active?: boolean;
  }
  
  export class State implements IState {
    constructor(
      public id?: number,
      public name?: string,
      public code?: string,
      public active?: boolean
    ) { }
  }
  