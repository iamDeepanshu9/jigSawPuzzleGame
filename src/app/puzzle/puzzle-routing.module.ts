import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JigsawComponent} from "./jigsaw/jigsaw.component";

const routes: Routes = [
  {
    path: '',
    component: JigsawComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuzzleRoutingModule { }
