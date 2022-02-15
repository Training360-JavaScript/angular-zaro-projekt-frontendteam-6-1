import { switchMap, Observable, Subscription, asyncScheduler, asapScheduler } from 'rxjs';
import { Customer } from './../../model/customer';
import { CustomerService } from './../../service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {

  @Input() closeNavigatePath: string[] | null | number = -1;

  @Input() set customerID(value: number) {
    this.customer$ = this.customerService.getOrNew(value);
  }

  @Output() close : EventEmitter<boolean> = new EventEmitter<boolean>();

  customer$: Observable<Customer> = this.activatedRoute.params
    .pipe(switchMap(e => this.customerService.getOrNew(e['id'])));

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(customer: Customer) {
    this.customerService.createOrUpdate(customer).subscribe({
      next: () => this.onClose(true),
      error: console.log,
    })
  }

  onClose(result: boolean) {
    this.close.emit(result);
    if (this.closeNavigatePath !== null) {
      if (typeof this.closeNavigatePath === 'number')
          this.location.historyGo(this.closeNavigatePath as number);
      else
        this.router.navigate(this.closeNavigatePath as string[]);
    }
  }

}
