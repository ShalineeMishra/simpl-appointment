import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectPatientRoutingModule } from './select-patient-routing.module';
import { SelectPatientComponent } from './select-patient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PhoneFormatDirective } from '../../directives/phoneFormatChange.directive';

@NgModule({
  declarations: [SelectPatientComponent, PhoneFormatDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectPatientRoutingModule,
    IonicModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectPatientModule { }
