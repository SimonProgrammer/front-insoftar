import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,Validators,NgForm } from '@angular/forms';
import { AppService } from '../../app.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {

  userForm;
  submitted:boolean;

  constructor(private formBuilder: FormBuilder,private app_service:AppService) { 

    this.submitted = false;

    this.userForm = this.formBuilder.group({
      identification: ['', Validators.required],
      name: ['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      phone:['', Validators.required],
      password:['', [Validators.required, Validators.minLength(6)]],
    });

  }

  ngOnInit() {
  }

  get fi() { return this.userForm.controls; }

  onSaveUser(userData,form:NgForm){

    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
        return;
    }

    let user = new User();
    user.identification = userData["identification"];
    user.name = userData["name"];
    user.email = userData["email"];
    user.phone = userData["phone"];
    user.password = userData["password"];

    this.app_service.saveUser(user).subscribe(
      result => {

          Swal.fire({
            title: 'Success',
            text: result.message,
            type: 'success'
          }).then((result) => {
            this.userForm.reset();
            this.userForm.markAsPristine();
            this.userForm.markAsUntouched();
            form.resetForm();
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


    
    // Swal.fire('Hello world!');
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }

  hasError(controlName: string, errorName: string){
    return this.userForm.controls[controlName].hasError(errorName);
  }

}
