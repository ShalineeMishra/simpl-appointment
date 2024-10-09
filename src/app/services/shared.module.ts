import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModuleComponent } from '../app-template-component/paginationModule/paginationModule.component';



@NgModule({
    declarations: [PaginationModuleComponent],
    imports: [
        CommonModule,IonicModule,FormsModule,ReactiveFormsModule,
    ],  
    exports: [
    PaginationModuleComponent,
    ReactiveFormsModule],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
 