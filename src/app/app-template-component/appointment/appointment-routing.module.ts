import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentComponent } from './appointment.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentComponent,
  },
  {
    path: 'select-patient',
    loadChildren: () =>
      import('../select-patient/select-patient.module').then((m) => m.SelectPatientModule),
    data: { title: 'Select-Patient' },
  },
  {
    path: 'add-new-patient',
    loadChildren: () =>
      import('../add-new-patient/add-new-patient.module').then((m) => m.AddNewPatientModule),
    data: { title: 'Select-Patient' },
  },
  {
    path: 'appointmentsList',
    loadChildren: () =>
      import('../appointments-list/appointments-list.module').then((m) => m.AppointmentsListModule),
    data: { title: 'Appointments List' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
