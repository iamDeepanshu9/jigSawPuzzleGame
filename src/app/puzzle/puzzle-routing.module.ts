import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from "./game/game.component";
import {JigsawComponent} from "./jigsaw/jigsaw.component";

const routes: Routes = [
  {
    path: '',
    component: GameComponent,
  },
  {
    path: 'js',
    component: JigsawComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuzzleRoutingModule { }
