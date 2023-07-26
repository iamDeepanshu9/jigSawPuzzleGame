import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Route, Router, Routes} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private sbs: MatSnackBar) {
  }
  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.formGroup = this.fb.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required]],
    })
  }

  signUpButtonHandle() {
    this.router.navigate(['/','auth','sign-up'],{
      replaceUrl: true,
    })
  }

  loginButtonHandle() {
    if(this.formGroup.valid){
      console.log(this.formGroup.value);
      if(this.formGroup.value.username === 'test@test.com' && this.formGroup.value.password === '1234'){
        this.sbs.open('Login SuccessFully');
        this.router.navigate(['/', 'puzzle'],{
          replaceUrl: true,
        })
      }else {
        this.sbs.open('Invalid Credentials');
      }
    }
  }
}
