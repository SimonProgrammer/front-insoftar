import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { IConfig } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, 
        MatIconModule, 
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatCardModule } from  '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { AdduserComponent } from './components/adduser/adduser.component';
import { ListusersComponent } from './components/listusers/listusers.component';
import { UpdateuserComponent } from './components/updateuser/updateuser.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    AppComponent,
    AdduserComponent,
    ListusersComponent,
    UpdateuserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot(options)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
