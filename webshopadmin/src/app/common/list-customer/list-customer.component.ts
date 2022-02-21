import { Address } from './../../model/address';
import { Router } from '@angular/router';
import { CustomerService } from './../../service/customer.service';
import { Customer } from './../../model/customer';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.scss']
})
export class ListCustomerComponent implements OnInit {

  table: any = {

    title: 'Customers',

    columns: {
      id: { name: 'Id' },
      firstName: { name: 'First Name' },
      lastName: {
        name: 'Last Name',
        pipe: 'upperCase'
      },
      email: { name: 'Email' },
      address: {
        name: 'Address',
        value( data: Address ) {
          return `${data.street}, ${data.zip}, ${data.city}, ${data.country}`;
        }
      },
      active: {
        name: 'Active',
        // value(data:boolean) { return data ? '+' : '-'; },
        type: 'boolean'
      },
      buttons: { name: '' }
    },

    onEdit: ( customer: Customer ): Observable<boolean> => {
      return new Observable(
        subscriber => {
          this.router.navigate( [ '/customer', customer.id ] );
          subscriber.next();
          subscriber.complete();
        }
      );
    },

    onNew: (): Observable<boolean> => {
      return new Observable(
        subscriber => {
          this.router.navigate( [ '/customer', 0 ] );
          subscriber.next();
          subscriber.complete();
        }
      );
    },

  };

  constructor(
    public customService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}






