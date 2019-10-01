import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormBuilder,Validators,NgForm,FormGroup } from '@angular/forms';
import { AppService } from '../../app.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  form: FormGroup;
  id_user:number;
  identification:number;
  name:string;
  email:string;
  phone:number;
  password:string;
  submitted:boolean;
  @ViewChild('userEditForm',{static: false}) userEditForm:NgForm;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UserUpdateComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private app_service:AppService) {

          this.submitted = false;
          this.id_user = data.id;
          this.identification = data.identification;
          this.name = data.name;
          this.email = data.email;
          this.phone = data.phone;
          this.password = data.password;
    }

    ngOnInit() {
        this.form = this.fb.group({
          id_user: [this.id_user],
          identification: [this.identification, Validators.required],
          name: [this.name, Validators.required],
          email:[this.email, [Validators.required, Validators.email]],
          phone:[this.phone, Validators.required],
          password:[this.password, [Validators.required, Validators.minLength(6)]],
        });
    }

    save() {
        this.userEditForm.ngSubmit.emit();
        // this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    get fi() { return this.form.controls; }

    onSaveUser(userData,form:NgForm){

      this.submitted = true;
  
      // stop here if form is invalid
      if (this.userEditForm.invalid) {
          return;
      }

      let user = new User();
      user.id = userData["id_user"];
      user.identification = userData["identification"];
      user.name = userData["name"];
      user.email = userData["email"];
      user.phone = userData["phone"];
      user.password = userData["password"];

      this.app_service.editUser(user).subscribe(
        result => {

            Swal.fire({
              title: 'Success',
              text: result.message,
              type: 'success'
            }).then((result) => {
              this.userEditForm.reset();
              form.resetForm();
              this.dialogRef.close();
              this.submitted = false;
            });

        },
        error => {
          let data_error = <any>error;
          if(data_error.status == 422){
            let array_errors = [];
            for(let prop in data_error.error.errors){
              array_errors = array_errors.concat(data_error.error.errors[prop]);
            }

            let list = document.createElement('ul') as HTMLUListElement;

            for (let i = 0; i < array_errors.length; i++) {

              var item = document.createElement('li') as HTMLLIElement;
              item.appendChild(document.createTextNode(array_errors[i]));
              list.appendChild(item);
            }

            Swal.fire({
              title: 'Oops...',
              text: 'You will not be able to recover this imaginary file!',
              type: 'error',
              html: list
            })
          }
          else if(data_error.status == 500){
            Swal.fire('Oops...', 'Something went wrong!', 'error');
          }
        }
      );
  }


}
