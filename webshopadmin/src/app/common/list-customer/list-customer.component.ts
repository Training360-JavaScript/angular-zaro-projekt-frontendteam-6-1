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

    onDelete( Customer: Customer ): Observable<boolean> {
      return new Observable(
        subscriber => {
          setTimeout(
            () => {
              subscriber.next( Math.random() < 0.5 );
              subscriber.complete();
            }, 1000
          );
        }
      );
    },

    onEdit: ( customer: Customer ): Observable<boolean> => {
      this.router.navigate( [ '/customer', customer.id] );
      return new Observable();
    }
  };

  constructor(
    public customService: CustomerService,
    private router: Router
  ) {
    customService.getAll();
  }

  ngOnInit(): void {
  }

}






