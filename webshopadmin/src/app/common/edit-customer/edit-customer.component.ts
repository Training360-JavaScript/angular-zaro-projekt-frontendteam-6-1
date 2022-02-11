import { switchMap, Observable, Subscription, asyncScheduler, asapScheduler } from 'rxjs';
import { Customer } from './../../model/customer';
import { CustomerService } from './../../service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {

  @Input() set customerID(value: number) {
    this.customer$ = this.customerService.getOrNew(value);
  }

  customer$: Observable<Customer> = this.activatedRoute.params
    .pipe(switchMap(e => this.customerService.getOrNew(e['id'])));

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(customer: Customer) {
    this.customerService.createOrUpdate(customer).subscribe({
      next: () => this.router.navigate(['/']),
      error: console.log,
    })
  }

}
