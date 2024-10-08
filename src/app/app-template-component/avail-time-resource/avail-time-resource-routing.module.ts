import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvailTimeResourceComponent } from './avail-time-resource.component';

const routes: Routes = [
  {
    path: '',
    component: AvailTimeResourceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvailTimeResourceRoutingModule { }
