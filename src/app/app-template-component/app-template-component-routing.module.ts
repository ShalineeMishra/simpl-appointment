import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppTemplateComponent } from './app-template-component.component';

const routes: Routes = [
  {
    path: '',
    component: AppTemplateComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'appointment' },
      {
        path: 'appointment',
        loadChildren: () =>
          import('./appointment/appointment.module').then((d) => d.AppointmentModule),
        data: { title: 'Appointment' },
      } 
    ],
  },
  // {
  //   path: '',
  //   component: AppTemplateComponent,
  // },
  // { 
  //   path: '', 
  //   pathMatch: 'full', 
  //   redirectTo: 'appointment' 
  // },
  // {
  //   path: 'appointment',
  //   loadChildren: () =>
  //     import('./appointment/appointment.module').then((d) => d.AppointmentModule),
  //   data: { title: 'Appointment' },
  // } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppTemplateComponentRoutingModule { }
