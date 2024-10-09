import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsListRoutingModule } from './appointments-list-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AppointmentsListComponent } from './appointments-list.component';


@NgModule({
  declarations: [AppointmentsListComponent],
  imports: [
    CommonModule,
    AppointmentsListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule
  ]
})
export class AppointmentsListModule { }
