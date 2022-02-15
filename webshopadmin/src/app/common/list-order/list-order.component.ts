import { Router } from '@angular/router';
import { Product } from './../../model/product';
import { Customer } from './../../model/customer';
import { forkJoin, Observable } from 'rxjs';
import { Order } from './../../model/order';
import { CustomerService } from './../../service/customer.service';
import { ProductService } from './../../service/product.service';
import { OrderService } from './../../service/order.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss']
})
export class ListOrderComponent implements OnInit {

  table: any = {

    title: 'Orders',

    columns: {
      id: { name: '#' },
      customerID: {
        name: 'Customer',
        value: ( customerID: number ) => {
          const find = this.customerList.find( (customer:Customer) => customer.id === customerID );
          return find?.firstName || '' + find?.lastName || '';
        }
      },
      productID: {
        name: 'Product',
        value: ( productID: number ) => {
          const find = this.productList.find( (product:Product) => product.id === productID );
          return find?.name || '';
        }
      },
      amount: { name: 'Amount', pipe: 'currency' },
      status: { name: 'Status' },
      buttons: { name: '' }
    },

    onEdit: ( order: Order ): Observable<boolean> => {
      return new Observable(
        subscriber => {
          this.router.navigate( [ '/order', order.id ] );
          subscriber.next();
          subscriber.complete();
        }
      );
    },

    onNew: (): Observable<boolean> => {
      return new Observable(
        subscriber => {
          this.router.navigate( [ '/order', 0 ] );
          subscriber.next();
          subscriber.complete();
        }
      );
    },

  };

  productList: Product[] = [];
  customerList: Customer[] = [];

  constructor(
    public customService: OrderService,
    public productService: ProductService,
    public customerService: CustomerService,
    private router: Router
  ) {
    forkJoin([
      productService.getAll(),
      customerService.getAll()
    ]).subscribe({
      next: ( value: [Product[], Customer[]] ): void => {
        this.productList = value[0];
        this.customerList = value[1];
      }
    })
  }

  ngOnInit(): void {
  }

}
