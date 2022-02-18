import { Product } from './../model/product';
import { Customer } from './../model/customer';
import { ProductService } from './product.service';
import { CustomerService } from './customer.service';
import { Order } from './../model/order';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Observable, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends CrudService<Order> {

  constructor(
    http: HttpClient,
    private cs: CustomerService,
    private ps: ProductService
  ) {
    super(http, 'order');
  }

  override createInstanceOfT() { return new Order(); }

  getCustomer(order: Order): Observable<Customer> {
    return this.cs.getOrNew( order.customerID);
  }

  getCustomerAsync(order$: Observable<Order>): Observable<Customer> {
    return order$.pipe(mergeMap(order => this.cs.getOrNew(order.customerID)));
  }

  getProduct(order: Order): Observable<Product> {
    return this.ps.getOrNew( order.productID);
  }

  getProductAsync(order$: Observable<Order>): Observable<Product> {
    return order$.pipe(mergeMap(order => this.ps.getOrNew(order.productID)));
  }

}
