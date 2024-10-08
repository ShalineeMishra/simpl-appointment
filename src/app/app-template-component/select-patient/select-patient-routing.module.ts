import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectPatientComponent } from './select-patient.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: '',
    component: SelectPatientComponent,
  },
  // {
  //   path: 'login',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       remoteName: 'LoginApp',
  //       remoteEntry: 'http://localhost:5001/remoteEntry.js', // same as above
  //       exposedModule: './LoginModule',
  //     }).then(m => m.LoginModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectPatientRoutingModule { }
