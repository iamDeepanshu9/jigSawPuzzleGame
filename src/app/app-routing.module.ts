import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import('src/app/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path:'puzzle',
    loadChildren: () => import('src/app/puzzle/puzzle.module').then((m) => m.PuzzleModule),
  },
  {
    path:'',
    redirectTo:'auth',
    pathMatch:"full"
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
