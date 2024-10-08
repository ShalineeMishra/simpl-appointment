import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppTemplateComponentRoutingModule } from './app-template-component-routing.module';
import { AppTemplateComponent } from './app-template-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [AppTemplateComponent],
  imports: [
    CommonModule,
    AppTemplateComponentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class AppTemplateComponentModule { }
