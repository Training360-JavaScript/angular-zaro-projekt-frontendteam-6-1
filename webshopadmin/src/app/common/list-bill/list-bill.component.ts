import { Order } from './../../model/order';
import { Customer } from './../../model/customer';
import { Product } from './../../model/product';
import { forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CustomerService } from './../../service/customer.service';
import { ProductService } from './../../service/product.service';
import { OrderService } from './../../service/order.service';
import { BillService } from './../../service/bill.service';
import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/model/bill';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-list-bill',
  templateUrl: './list-bill.component.html',
  styleUrls: ['./list-bill.component.scss']
})
export class ListBillComponent implements OnInit {


  table: any = {

    title: 'Bills',

    columns: {
      id: { name: '#' },
      orderID: {
        name: 'OrderID',
        value: ( orderID: number ) : SafeHtml => {

          if (!this.orderList) return 'x';

          const order = this.orderList.find( (order:Order) => order.id === orderID );
          if ( order ) {
            const customer = this.customerList.find( (customer: Customer ) => customer.id === order.customerID );
            const product = this.productList.find( (product: Product ) => product.id === order.productID );
            const s:string='asas';
            return [
              orderID,
              (product?.name ?? ''),
              [ customer?.firstName ?? '', ' ', customer?.lastName ?? '' ].join(' ')
            ].join(' / ');
          }
          return [
            orderID
          ].join(' / ');
        } },
      amount: { name: 'Amount' },
      status: { name: 'Status' },
      buttons: { name: '' },
    },

    onEdit: ( bill: Bill ): Observable<boolean> => {
      return new Observable(
        subscriber => {
          this.router.navigate( [ '/bill', bill.id ] );
          subscriber.next();
          subscriber.complete();
        }
      );
    },

    onNew: (): Observable<boolean> => {
      return new Observable(
        subscriber => {
          this.router.navigate( [ '/bill', 0 ] );
          subscriber.next();
          subscriber.complete();
        }
      );
    },

  };

  productList: Product[];
  customerList: Customer[];
  orderList: Order[];

  constructor(
    public customService: BillService,
    public orderService: OrderService,
    public productService: ProductService,
    public customerService: CustomerService,
    private _sanitizer: DomSanitizer,
    private router: Router
  ) {
    forkJoin([
      productService.getAll(),
      customerService.getAll(),
      orderService.getAll()
    ]).subscribe({
      next: ( value: [Product[], Customer[], Order[]] ): void => {
        this.productList = value[0];
        this.customerList = value[1];
        this.orderList = value[2];
      }
    })
  }

  ngOnInit(): void {
  }

}

