import { flatMap, mergeMap, Observable } from 'rxjs';
import { OrderService } from './order.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../model/bill';
import { CrudService } from './crud.service';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root'
})
export class BillService extends CrudService<Bill> {

  constructor(
    http: HttpClient,
    private os: OrderService,
  ) {
    super(http, 'bill');
   }

   getOrder(bill: Bill): Observable<Order> {
     return this.os.get(bill.orderID);
   }

   getOrderAsync(bill$: Observable<Bill>): Observable<Order> {
     return bill$.pipe(mergeMap(bill => this.os.get(bill.orderID)));
   }

}
