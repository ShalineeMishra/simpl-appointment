import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvailTimeResourceRoutingModule } from './avail-time-resource-routing.module';
import { AvailTimeResourceComponent } from './avail-time-resource.component';


@NgModule({
  declarations: [],//AvailTimeResourceComponent
  //exports : [AvailTimeResourceComponent],
  imports: [
    CommonModule,
    AvailTimeResourceRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AvailTimeResourceModule { }
