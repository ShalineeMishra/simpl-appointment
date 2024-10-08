import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AddpatientRoutingModule } from './addpatient-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneFormatDirective } from '../../../directives/phoneFormatChange.directive';

@NgModule({
  imports: [CommonModule,IonicModule,AddpatientRoutingModule,FormsModule,ReactiveFormsModule],
  declarations: [PhoneFormatDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[]

})
export class AddpatientModule { }
