import { CustomerService } from './../../service/customer.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { OrderService } from 'src/app/service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/model/order';
import { Product } from 'src/app/model/product';
import { Customer } from 'src/app/model/customer';
import { Location } from '@angular/common'

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit {

  @Input() closeNavigatePath: string[] | null | number = -1;

  @Input() set orderID(value: number) {
    this.order$ = this.orderService.getOrNew(value);
  }

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();


  order$: Observable<Order> = this.activatedRoute.params.pipe(
    switchMap(params => this.orderService.getOrNew(params['id']))
  );

  product$: Observable<Product> = this.orderService.getProductAsync(
    this.order$
  );

  customer$: Observable<Customer> = this.orderService.getCustomerAsync(
    this.order$
  );

  modalCustomer: boolean = false;
  modalCustomerId: number = 0;

  constructor(
    private orderService: OrderService,
    private customerService:  CustomerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {}

  onSubmit(order: Order) {
    this.orderService.createOrUpdate(order).subscribe({
      next: () => this.onClose(true),
      error: console.log,
    });
    /* this.back(); */
  }

  onClose(result: boolean): void {
    this.close.emit(result);
    if (typeof this.closeNavigatePath === 'number')
      this.location.historyGo(this.closeNavigatePath as number);
    else
      this.router.navigate(this.closeNavigatePath as string[]);
  }


  editProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  editCustomer(customer: Customer, ): void {
    //this.router.navigate(['/customer', customer.id]);
    this.modalCustomer = true;
    this.modalCustomerId = customer.id;
  }
  changeCustomer(customer: Customer, ): void {
    this.modalCustomer = true;
    this.modalCustomerId = customer.id;
  }
  modalCustomerEnd($event: any): void {
    if ($event)
      this.customer$ = this.orderService.getCustomerAsync(this.order$);
    this.modalCustomer = false;
  }

  /* back(): void {
    this.location.back()
  } */
}
