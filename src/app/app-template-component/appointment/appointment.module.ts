
import { CommonModule } from '@angular/common';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentComponent } from './appointment.component';


import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationSearchDropdown } from '../location-search-dropdown/location-search-dropdown';
import { SearchDropdown } from '../search-dropdown/search-dropdown';
import { AvailTimeResourceComponent } from '../avail-time-resource/avail-time-resource.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../services/shared.module';


@NgModule({
  declarations: [AppointmentComponent,
    AvailTimeResourceComponent,
    SearchDropdown,LocationSearchDropdown],
  exports :[AvailTimeResourceComponent],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppointmentModule { }
