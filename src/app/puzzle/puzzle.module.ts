import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuzzleRoutingModule } from './puzzle-routing.module';
import { GameComponent } from './game/game.component';
import { JigsawComponent } from './jigsaw/jigsaw.component';
import {MaterialModule} from "../material/material.module";


@NgModule({
  declarations: [
    GameComponent,
    JigsawComponent
  ],
    imports: [
        CommonModule,
        PuzzleRoutingModule,
        MaterialModule
    ]
})
export class PuzzleModule { }
