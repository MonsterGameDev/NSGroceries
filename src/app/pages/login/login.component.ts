import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from './../../shared/user/user';
import { UserService } from './../../shared/user/user.service';
import { Router } from '@angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { Color } from 'tns-core-modules/color';
import { View } from 'tns-core-modules/ui/core/view';
import { TextField } from 'tns-core-modules/ui/text-field';
import { setHintColor } from './../../utils/hint-util';


@Component({
  selector: 'gr-main',
  templateUrl: './login.component.html',
  styleUrls: ['./login-common.css', './login.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('container') container: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('password') password: ElementRef;
  public isLoggingIn = true;
  public user: User;

  constructor(private userService: UserService, private router: Router, private page: Page) {
    this.user = new User();
    this.user.email = 'per@qwert.dk';
    this.user.password = 'Hello';
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.page.backgroundImage = 'res://bg_login';
  }

  public submit() {
    if (!this.user.isValidEmail()){
      alert ('please enter a valid emailaddress');
      return;
    }
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signup();
    }
  }

  public toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.setTextFieldColors();
    const container = <View>this.container.nativeElement;
    container.animate({
      backgroundColor: this.isLoggingIn? new Color('white') : new Color('#301217'),
      duration: 200
    });
  }

  private login() {
    this.userService
      .login(this.user)
      .subscribe(
        data => this.router.navigate(['/list']),
        err => alert('Unfortunately we were unable to find your account')
      );
  }

  signup() {
    this.userService.register(this.user).subscribe(
      res => {
        alert('Your account was successfully created');
        this.toggleDisplay();
      },
      err => {
        alert('Sadly we we´ent able to create your account');
      }
    );
  }

  private setTextFieldColors(){
    const emailTextField = <TextField>this.email.nativeElement;
    const passwordTextField = <TextField>this.password.nativeElement;

    const mainTextFieldColor = new Color(this.isLoggingIn? 'black' : '#C4AFB4');
    emailTextField.color = mainTextFieldColor;
    passwordTextField.color = mainTextFieldColor;

    const hintColor = new Color(this.isLoggingIn? '#ACA5A7' : '#C4AFB4');
    setHintColor({view: emailTextField, color: hintColor});
    setHintColor({view: passwordTextField, color: hintColor});
  }
}
