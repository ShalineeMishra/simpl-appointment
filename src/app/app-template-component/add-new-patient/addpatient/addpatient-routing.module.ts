import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AddpatientComponent } from "./addpatient.component";
import { IonicModule } from "@ionic/angular";

const routes: Routes = [
    {
        path : '',
        component: AddpatientComponent
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes),IonicModule],
    exports: [RouterModule]
})

export class AddpatientRoutingModule{}