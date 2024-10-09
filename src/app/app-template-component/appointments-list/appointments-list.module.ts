import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsListRoutingModule } from './appointments-list-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AppointmentsListComponent } from './appointments-list.component';
import { SharedModule } from '../../services/shared.module';


@NgModule({
  declarations: [AppointmentsListComponent],
  imports: [
    CommonModule,
    AppointmentsListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    SharedModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppointmentsListModule { }
