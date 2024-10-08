
import {NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AddNewPatientRoutingModule } from './add-new-patient-routing.module';
import { AddNewPatientComponent } from './add-new-patient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddpatientComponent } from './addpatient/addpatient.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [AddNewPatientComponent,AddpatientComponent],
  imports: [
    AddNewPatientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    CommonModule,
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class AddNewPatientModule { }
