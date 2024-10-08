import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewPatientComponent } from './add-new-patient.component';

const routes: Routes = [
  {
    path: '',
    component: AddNewPatientComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddNewPatientRoutingModule { }
