import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  f!:FormGroup;
  constructor(private authService:AuthenticationService,private router:Router) { }

  ngOnInit(): void {
  }
  onLogin(dataForm:any){
  this.authService.login(dataForm.username,dataForm.password);
  if(this.authService.isAuthenticated){
    this.authService.saveAuthenticatedUser();
    this.router.navigateByUrl('');
  }
  }
}
