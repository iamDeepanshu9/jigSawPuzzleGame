import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {ApiHandleService} from "../services/api-handle.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public displayedColumns = ['sno', 'date', 'score', 'timeTaken'];
  public userDetails$$ = new BehaviorSubject([1]);
  public currentGameData$$ = new BehaviorSubject(null);
  constructor(private authService: AuthService, private router: Router, private apiHandleService: ApiHandleService) {

  }

  public ngOnInit(): void {
    // this.apiHandleService.userData$().subscribe((res) => {
    //   if(res){
    //     this.userDetails$$.next(res)
    //   }
    // },(error) => {
    //   this.userDetails$$.next([]);
    // })
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.currentGameData$$.next({time:navigation.extras.state.time, steps:navigation.extras.state.steps})
    }
  }

  public logOut() {
    this.authService.logout();
    this.router.navigate(['/auth', 'login']);
  }

  public userDetail() {
    this.router.navigate(['user'])
  }

  public puzzle() {
    this.router.navigate(['puzzle'])
  }
}
