import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Route, Router, Routes} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {SnackBarService} from "../../services/snackbar.service";
import {ApiHandleService} from "../../services/api-handle.service";
import {UserLoginRequestBody} from "../auth.interface";
import * as events from "events";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  signUpFormGroup: FormGroup;
  @ViewChild('loginButton') private loginButtonElement: ElementRef;
  @ViewChild('loginBox') private loginContainer: ElementRef;
  constructor(private fb: FormBuilder,
              private router: Router,
              private sbs: SnackBarService,
              private authService: AuthService,
              private apiHandleService: ApiHandleService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/', 'puzzle'], {
        replaceUrl: true,
      })
    }
    this.createForm();
  }

  createForm() {
    this.loginFormGroup = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })

    this.signUpFormGroup = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      username: ['',[Validators.required]],
      password: ['',[Validators.required]],
    })
  }


  signUpButtonHandle() {
    if(this.signUpFormGroup.valid){
      console.log(this.signUpFormGroup.value);
      const requestBody = this.signUpFormGroup.value
      this.apiHandleService.signUp$(requestBody).subscribe((res) => {
        if (!!res) {
          this.sbs.showMessage('Sign-Up SuccessFully');
          this.toggleLogin();
          this.signUpFormGroup.reset();
          this.loginFormGroup.reset();
        }
      }, (err) => {
        this.sbs.showError('Invalid Credentials | Something Went Wrong');
      })
    }else{
      this.signUpFormGroup.markAsTouched();
      this.sbs.showError('Fill Form Properly')
    }
  }

  loginButtonHandle() {
    this.authService.login();
    if (this.loginFormGroup.valid) {
      const requestBody = this.loginFormGroup.value as UserLoginRequestBody;

      this.apiHandleService.login$(requestBody).pipe().subscribe((res) => {
        console.log(res);
        if (res) {
          this.sbs.showMessage('Login SuccessFully');
          this.authService.login();
          this.router.navigate(['/', 'puzzle'], {
            replaceUrl: true,
          })
          this.signUpFormGroup.reset();
          this.loginFormGroup.reset();
        }
      }, (err) => {
        this.sbs.showError('Invalid Credentials | Something Went Wrong');
      })
    }
  }

  handleButtonSwitch(button: string){

    const loginBtn = document.getElementById('loginContainer');
    const signupBtn = document.getElementById('signupContainer');
    if(button === 'login'){
        if(loginBtn.classList.contains('slide-up')){
          console.log('login has slid-up');
          loginBtn.classList.remove('slide-up');
          signupBtn.classList.add('slide-up');
        }else{
          console.log('login has not slid-up', loginBtn);
          loginBtn.classList.add('slide-up');
          signupBtn.classList.remove('slide-up');
        }
    }else{
      if(signupBtn.classList.contains('slide-up')){
        loginBtn.classList.add('slide-up');
        signupBtn.classList.remove('slide-up');
      }else{
        loginBtn.classList.remove('slide-up');
        signupBtn.classList.add('slide-up');
      }
    }

    this.cdr.detectChanges();
  }

  toggleLogin(){
    const loginBtn = document.getElementById('loginContainer');
    const signupBtn = document.getElementById('signupContainer');
    loginBtn.classList.remove('slide-up');
    signupBtn.classList.add('slide-up');
  }

  protected readonly event = event;
}
