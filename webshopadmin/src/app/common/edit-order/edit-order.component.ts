import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { OrderService } from 'src/app/service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/model/order';
import { Product } from 'src/app/model/product';
import { Customer } from 'src/app/model/customer';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit {

  @Input() closeNavigatePath: string[] | null = ['/order/list'];

  @Input() set orderID(value: number) {
    this.order$ = this.orderService.getOrNew(value);
  }

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();


  order$: Observable<Order> = this.activatedRoute.params.pipe(
    switchMap(params => this.orderService.get(params['id']))
  );

  product$: Observable<Product> = this.orderService.getProductAsync(
    this.order$
  );

  customer$: Observable<Customer> = this.orderService.getCustomerAsync(
    this.order$
  );

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(order: Order) {
    this.orderService.createOrUpdate(order).subscribe({
      next: () => this.onClose(true),
      error: console.log,
    });
  }

  onClose(result: boolean): void {
    this.close.emit(result);
    if (this.closeNavigatePath && this.closeNavigatePath.length)
      this.router.navigate(this.closeNavigatePath);
  }

  editCustomer(customer: Customer, ): void {
    this.router.navigate(['/customer', customer.id]);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }
}
