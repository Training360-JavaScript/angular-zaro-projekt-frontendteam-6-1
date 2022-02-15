import { Component, Input, OnInit } from '@angular/core';
import { BillService } from 'src/app/service/bill.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Bill } from 'src/app/model/bill';
import { Product } from 'src/app/model/product';
import { Customer } from 'src/app/model/customer';
import { Order } from 'src/app/model/order';
import { Location } from '@angular/common'
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.scss'],
})
export class EditBillComponent implements OnInit {
  @Input() set billID(value: number) {
    this.bill$ = this.billService.getOrNew(value);
  }

  bill$: Observable<Bill> = this.activatedRoute.params.pipe(
    switchMap((params) => this.billService.getOrNew(params['id']))
  );

  order$: Observable<Order> = this.billService.getOrderAsync(this.bill$);

  product$: Observable<Product> = this.orderService.getProductAsync(
    this.order$
  );

  customer$: Observable<Customer> = this.orderService.getCustomerAsync(
    this.order$
  );

  constructor(
    private billService: BillService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {}

  onSubmit(bill: Bill) {
    this.billService.createOrUpdate(bill).subscribe({
      error: console.log,
    });
    this.back();
  }

  onUpdate(bill: Bill): void {
    this.billService.update(bill).subscribe(
      (bill) => this.router.navigate(['/']),
      (err) => console.error(err)
    );
  }

  editOrder(order: Order): void {
    this.router.navigate(['/order', order.id]);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/customer', customer.id]);
  }

  back(): void {
    this.location.back();
  }
}
