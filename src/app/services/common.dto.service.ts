import { Injectable } from '@angular/core';
import { AvailTimeReqResourceModel, AvaliableStaffListModel, PatientDetailsModel, ProviderDetailsModel, ServiceDTO } from '../models/appointment.model';


@Injectable({
  providedIn: 'root'
})
/**
 * Common Datat Transfer Object service to store state data and page all the pages
 */
export class CommonDtoService {

  _DTOAvailResources : AvailTimeReqResourceModel;
  _clickInfoForNextPage: any;
  _ProviderDetails : ProviderDetailsModel;
  _DTOAvaliableStaffList : AvaliableStaffListModel[];
  _DtoPtaientdata: PatientDetailsModel;
  _ServiceDetailsDTO : ServiceDTO;
  constructor() { }
}