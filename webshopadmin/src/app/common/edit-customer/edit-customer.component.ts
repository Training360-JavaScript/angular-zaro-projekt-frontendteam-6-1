import { switchMap, Observable, Subscription, asyncScheduler, asapScheduler, map } from 'rxjs';
import { Customer } from './../../model/customer';
import { CustomerService } from './../../service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {

  @Input() closeNavigatePath: string[] | null | number = -1;

  @Input() set customerID(value: number) {
    this.customer$ = this.customerService.getOrNew(value).pipe(map(e => {
      if (e.id === 0 && this.defaultName && typeof this.defaultName === 'string') {
        console.log(this.defaultName);
        const nameArray = this.defaultName.split(' ').filter(e => e && e != ' ');
        e.firstName = nameArray.shift() || '';
        e.lastName = nameArray.join(' ');
      }
      return e;
    }));
  }

  @Input() defaultName: string = '';

  @Output() close : EventEmitter<Customer | null> = new EventEmitter();

  customer$: Observable<Customer> = this.activatedRoute.params
    .pipe(switchMap(e => this.customerService.getOrNew(e['id'])));

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private location: Location,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(customer: Customer) {
    this.customerService.createOrUpdate(customer).subscribe({
      next: mCustomer => this.onClose(true, mCustomer, customer.id === 0),
      error: error => this.toaster.error(error),
    })
  }

  onClose(result: boolean, customer?: Customer, isNew: boolean = false) {
    this.close.emit(result ? customer : null);
    if (result) {
      if (isNew)
        this.toaster.success(`${customer?.firstName} ${customer?.lastName} created successfully.`);
      else
        this.toaster.success(`${customer?.firstName} ${customer?.lastName} modified successfully.`);
    }
    if (this.closeNavigatePath !== null) {
      if (typeof this.closeNavigatePath === 'number')
          this.location.historyGo(this.closeNavigatePath as number);
      else
        this.router.navigate(this.closeNavigatePath as string[]);
    }
  }

}
