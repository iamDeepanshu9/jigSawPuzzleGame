import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuzzleRoutingModule } from './puzzle-routing.module';
import { GameComponent } from './game/game.component';


@NgModule({
  declarations: [
    GameComponent
  ],
  imports: [
    CommonModule,
    PuzzleRoutingModule
  ]
})
export class PuzzleModule { }
