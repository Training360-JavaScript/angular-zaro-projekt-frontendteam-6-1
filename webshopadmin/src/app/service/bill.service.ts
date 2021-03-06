import { flatMap, mergeMap, Observable } from 'rxjs';
import { OrderService } from './order.service';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../model/bill';
import { CrudService } from './crud.service';
import { Order } from '../model/order';
import { CustomerService } from './customer.service';
import { ProductService } from './product.service';
import { Customer } from '../model/customer';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class BillService extends CrudService<Bill> {
  constructor(
    http: HttpClient,
    private os: OrderService,
    private cs: CustomerService,
    private ps: ProductService) {
    super(http, 'bill');
  }

  override createInstanceOfT() {
    return new Bill();
  }

  getOrder(bill: Bill): Observable<Order> {
    return this.os.getOrNew(bill.orderID);
  }

  getOrderAsync(bill$: Observable<Bill>): Observable<Order> {
    return bill$.pipe(mergeMap(bill => this.os.getOrNew(bill.orderID)));
  }
}
