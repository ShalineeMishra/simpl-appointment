import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'appointment',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('./app-template-component/app-template-component.module')
      .then((m) => m.AppTemplateComponentModule),
    data: { title: 'Appointment' },
  },
  // { path: '**', redirectTo: 'appointment' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    HttpClientModule,
  ],
  exports: [RouterModule],
  providers: [HttpClient],
})
export class AppRoutingModule { }
