import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AdduserComponent } from './components/adduser/adduser.component';
import { ListusersComponent } from './components/listusers/listusers.component';
import { UpdateuserComponent } from './components/updateuser/updateuser.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'adduser',
    pathMatch:'full'
  },
  {
      path: 'adduser',
      component: AdduserComponent,
      data: {animation: 'AddUser'}
  },
  {
      path: 'listusers',
      component: ListusersComponent,
      data: {animation: 'ListUser'}
  },
  {
      path: 'updateuser',
      component: UpdateuserComponent,
      data: {animation: 'UpdateUser'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
