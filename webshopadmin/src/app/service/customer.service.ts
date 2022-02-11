import { Address } from './../model/address';
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

  override createInstanceOfT() { return new Customer(); }

  override inputTransform(c: Customer ): Customer {
    if ( c && typeof c.address === 'string') {
      const strAddr = c.address as string;
      const addr = new Address();
      const strAddrArray: string[] = strAddr.split(' ');
      addr.zip = strAddrArray.shift() || '';
      addr.street = strAddrArray.join(' ');
      c.address = addr;
    }
      return c;
  }

}
