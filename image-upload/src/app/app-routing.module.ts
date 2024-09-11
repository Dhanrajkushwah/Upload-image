import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UploadComponent } from './upload/upload.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  imports: [
      RouterModule.forRoot([
          { path: '', component: HomeComponent},
          { path: 'register', component: RegisterComponent},
          { path: 'login', component: LoginComponent},
          { path: 'upload', component: UploadComponent},
          { path: 'contact', component: ContactComponent}
      ],  { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
