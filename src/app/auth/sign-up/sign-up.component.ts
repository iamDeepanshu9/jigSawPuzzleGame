import {Component, OnInit} from '@angular/core';
// import {UserService} from "../../services/user.service";
import Keyboard from "simple-keyboard";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private sbs: MatSnackBar) {
  }
  ngOnInit() {
  this.createForm();
  }

  createForm(){
    this.formGroup = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      username: ['',[Validators.required]],
      password: ['',[Validators.required]],
    })
  }


  signUpButtonHandle() {
    if(this.formGroup.valid){
      console.log(this.formGroup.value);
    }
  }

  loginButtonHandle() {
    this.router.navigate(['/','auth','login'],{
      replaceUrl: true,
    })
  }

}
