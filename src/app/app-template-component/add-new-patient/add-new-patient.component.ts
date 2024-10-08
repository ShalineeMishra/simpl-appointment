import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PatientDetailsModel, ProviderDetailsModel } from '../../models/appointment.model';
import { CommonDtoService } from '../../services/common.dto.service';
import { HTTPProviderService } from '../../services/http-provider.service';
import { IonSegment } from '@ionic/angular';
import { Subject } from 'rxjs';
import { CommunicationService } from '../../services/communication.service';
import {AbstractControl, FormArray, FormBuilder, FormGroup,ValidationErrors,ValidatorFn,Validators } from '@angular/forms';
import { ToastMessageService } from 'simpl-shared-ui';

@Component({
  selector: 'simplerepo-add-new-patient',
  templateUrl: './add-new-patient.component.html',
  styleUrls: ['./add-new-patient.component.scss'],
})
export class AddNewPatientComponent  implements OnInit {
_ProviderDetails : ProviderDetailsModel;
@ViewChild(IonSegment) segment!: IonSegment;

eventsSubject: Subject<void> = new Subject<void>();
currentDiv: string = 'patient information';
buttonText: string = "Next";
RelationDD : any[] = ["Self","Spouse","Child" ,"Other"];
DescriptionForm: FormGroup;
_PatientData: any;
public segmentDisabledDesc: boolean = true;
isBackEnable: boolean = false;
_simplId : string = "";

  constructor(private router: Router,
    private _location: Location,
    private modalController: ModalController,
    private commonDtoService: CommonDtoService,
    private location: Location,
    public httpProvider : HTTPProviderService,
    private formBuilder: FormBuilder,
    private toastMessageService: ToastMessageService,
    private communicationService: CommunicationService) 
    {
      this._ProviderDetails = new ProviderDetailsModel();

      this.DescriptionForm = this.formBuilder.group({
        notes : [""],
      })
    }


  ngOnInit() {
    if (this.segment) {
      this.segment.value = 'patient information'; 
    }
  }

  segmentChanged(event: any) {
    this.segment = event;
    this.toggleDiv(this.segment)
  }

  toggleDiv(divNumber: any) {
    this.currentDiv = divNumber;
  }

  /**
   * @param event get data from patient screen
   */
  callPatientAddMethod(event: any){
    this._PatientData = event.PatientData;
    this._simplId = this._PatientData?.simpl_id
    this.buttonText = "Submit";
    this.segment.value = 'description';
    this.segmentChanged(this.segment.value);
    this.segmentDisabledDesc = false;
  }


  async getPatientById(){
    if (this._simplId != '' && this._simplId !== undefined) {
      await this.httpProvider.getPatientDataById(this._simplId).subscribe({
        next: (res) => { 
          let trasferdata ={
            patientDetails : res,
            notes : this.DescriptionForm?.value?.notes,
            IsNewPatientAdded: true
          }
          this.communicationService.changeData(trasferdata);
          this.router.navigate(['appointment/select-patient'])
        },
        error: (error) => {
          console.error(error.error.message);
        }
      });
    } else {
      this.toastMessageService.presentErrorMessage("Patient not retrived found.");
    }
  }

  redirectOnNextButton(){
    if (this.currentDiv === "patient information") {
      this.eventsSubject.next();
      //this.segmentDisabledInsurance = false;
     
    }
    else if (this.currentDiv === "description") {
      //this.buttonText = "Submit";
      if (this.DescriptionForm.valid) {
        this.getPatientById();
      }else{
        if (!this.DescriptionForm?.value?.notes) {
          this.DescriptionForm?.get('notes')?.markAsTouched();
        }
      }
        
    }
  }


  descriptionDataStore(){
    this.buttonText = "Submit";
    this.segment.value = 'description';
    this.segmentChanged(this.segment.value);
    this.segmentDisabledDesc = false;
  }

}
