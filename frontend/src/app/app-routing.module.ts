// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DietaryFormComponent } from './components/dietary-form/dietary-form.component';
import { ChatlistComponent } from './chat-components/chatlist/chatlist.component';
import { ChatComponent } from './chat-components/chat/chat.component';
import { authGuard } from './guard/auth.guard';
import { userExistsGuard } from './guard/user-exists.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Landing page as default route
  { path: 'dietary-form', component: DietaryFormComponent, canActivate: [authGuard, userExistsGuard] },
  { path: 'chatlist', component: ChatlistComponent, canActivate: [authGuard] },
  { path: 'chat/:chatid', component: ChatComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
