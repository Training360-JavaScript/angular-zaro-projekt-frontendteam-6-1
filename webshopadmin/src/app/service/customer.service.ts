import { HttpClient } from '@angular/common/http';
import { Customer } from './../model/customer';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends CrudService<Customer> {

  constructor(
    http: HttpClient
  ) {
    super(http, 'customer');
   }
}
