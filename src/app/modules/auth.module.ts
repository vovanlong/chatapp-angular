import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthTabsComponent } from '../components/auth-tabs/auth-tabs.component';
import { SignupComponent } from '../components/signup/signup.component';
import { LoginComponent } from '../components/login/login.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AuthTabsComponent, SignupComponent, LoginComponent],
  exports: [AuthTabsComponent, SignupComponent, LoginComponent]
})
export class AuthModule {}
