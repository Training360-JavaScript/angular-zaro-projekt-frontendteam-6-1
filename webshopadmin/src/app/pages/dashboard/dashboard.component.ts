
declare let google: any;
import { Order } from './../../model/order';
import { BillService } from './../../service/bill.service';
import { OrderService } from './../../service/order.service';
import { CustomerService } from './../../service/customer.service';
import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';
import { merge, zip } from 'rxjs';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private ps: ProductService,
    private cs: CustomerService,
    private os: OrderService,
    private bs: BillService,
  ) { }

  info = {
    allProducts: 0,
    activeProducts: 0,
    allCustomer: 0,
    activeCustomer: 0,
    allOrder: 0,
    newOrder: 0,
    shippedOrder: 0,
    paidOrder: 0,
    allOrderAmount: 0,
    newOrderAmount: 0,
    shippedOrderAmount: 0,
    paidOrderAmount: 0,
    allBill: 0,
    newBill: 0,
    paidBill: 0,
    allBillAmount: 0,
    newBillAmount: 0,
    paidBillAmount: 0,
  }

  initInfo() {
    zip(this.ps.getAll(), this.cs.getAll(), this.os.getAll(), this.bs.getAll()).subscribe({
      next: value => {
        const products = value[0];
        const customers = value[1];
        const orders = value[2];
        const bills = value[3];
        const productsOfOrders: Product[] = orders.map(o => products.find(p => p.id === o.productID) || new Product);
        this.info.allCustomer = customers.length;
        this.info.activeCustomer = customers.reduce((prev, e) => e.active ? prev + 1: prev, 0);
        this.info.allProducts = products.length;
        this.info.activeProducts = products.reduce((prev, e) => e.active ? prev + 1: prev, 0);
        this.info.allOrder = orders.length;
        this.info.newOrder = orders.reduce((prev, e) => e.status.toLowerCase() == 'new' ? prev + 1 : prev, 0);
        this.info.shippedOrder = orders.reduce((prev, e) => e.status.toLowerCase() == 'shipped' ? prev + 1 : prev, 0);
        this.info.paidOrder = orders.reduce((prev, e) => e.status.toLowerCase() == 'paid' ? prev + 1 : prev, 0);
        this.info.allOrderAmount = orders.reduce((prev, e, idx) =>
          prev + e.amount * productsOfOrders[idx].price, 0);
        this.info.newOrderAmount = orders.reduce((prev, e, idx) =>
          e.status.toLowerCase() == 'new' ? prev + e.amount * productsOfOrders[idx].price : prev, 0);
        this.info.shippedOrderAmount = orders.reduce((prev, e, idx) =>
          e.status.toLowerCase() == 'shipped' ? prev + e.amount * productsOfOrders[idx].price : prev, 0);
        this.info.paidOrderAmount = orders.reduce((prev, e, idx) =>
          e.status.toLowerCase() == 'paid' ? prev + e.amount * productsOfOrders[idx].price : prev, 0);
        this.info.allBill = bills.length;
        this.info.newBill = bills.reduce((prev, e) => e.status.toLowerCase() == 'new' ? prev + 1 : prev, 0);
        this.info.paidBill = bills.reduce((prev, e) => e.status.toLowerCase() == 'paid' ? prev + 1 : prev, 0);
        this.info.allBillAmount = bills.reduce((prev, e) => prev + e.amount, 0);
        this.info.newBillAmount = bills.reduce((prev, e) => e.status.toLowerCase() == 'new' ? prev + e.amount : prev, 0);
        this.info.paidBillAmount = bills.reduce((prev, e) => e.status.toLowerCase() == 'paid' ? prev + e.amount : prev, 0);
      }
    })
  }


  ngOnInit(): void {
    this.initInfo();
  }

}
