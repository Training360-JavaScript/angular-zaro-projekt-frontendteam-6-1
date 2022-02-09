import { switchMap, Observable } from 'rxjs';
import { Customer } from './../../model/customer';
import { CustomerService } from './../../service/customer.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {

  customers$: Observable<Customer[]> = this.cs.getAll();

  customer$: Observable<Customer> = this.ac.params
    .pipe(switchMap(e => this.cs.get(e['id'])));

  constructor(
    private ac: ActivatedRoute,
    private cs: CustomerService,
  ) { }

  ngOnInit(): void {
  }

}
