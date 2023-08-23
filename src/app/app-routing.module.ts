import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./services/auth.guard";


const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import('src/app/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path:'puzzle',
    canActivate:[AuthGuard],
    loadChildren: () => import('src/app/puzzle/puzzle.module').then((m) => m.PuzzleModule),
  },
  {
    path:'user',
    canActivate:[AuthGuard],
    loadChildren: () => import('src/app/user/user.module').then((m) => m.UserModule),
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
