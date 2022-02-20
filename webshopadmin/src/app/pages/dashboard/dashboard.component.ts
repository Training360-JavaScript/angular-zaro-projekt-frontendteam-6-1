import { Customer } from './../../model/customer';
import { Category } from './../../model/category';
import { CategoryService } from './../../service/category.service';
import { Order } from './../../model/order';
import { BillService } from './../../service/bill.service';
import { OrderService } from './../../service/order.service';
import { CustomerService } from './../../service/customer.service';
import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';
import { zip } from 'rxjs';
import { Product } from 'src/app/model/product';
import { EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';

import LinearGradient from 'zrender/lib/graphic/LinearGradient';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  CustomerTheme = {
    color: [
      '#9C27B0',
      '#7B1FA2',
      '#6A1B9A',
    ],  chord: {
      padding: 0,
  }
  }

  ProductTheme = {
    color: [
      '#4CAF50',
      '#2c722f',
      '#2c722f',
    ], chord: {
      padding: 0,
  }
  }

  OrderTheme = {
    color: [
      '#FF9800',
      '#FFAB40',
      '#F57C00',
    ], chord: {
      padding: 0,
  }
  }

  BillTheme = {
    color: [
      '#F44336',
      '#C62828',
      '#FF5252',
    ],
    chord: {
      padding: 0,
  } }

  theme: string | ThemeOption;

  constructor(
    private ps: ProductService,
    private cas: CategoryService,
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
    zip(this.ps.getAll(), this.cs.getAll(), this.os.getAll(), this.bs.getAll(), this.cas.getAll()).subscribe({
      next: value => {
        const products = value[0];
        const customers = value[1];
        const orders = value[2];
        const bills = value[3];
        const categories = value[4];
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
        //this.chartData.data[0] = ['c', 111];
        this.chartDataProducts = this.getPieChartData([
          ['Inactive', this.info.allProducts - this.info.activeProducts],
          ['Active', this.info.activeProducts],
        ]);
        this.chartDataCustomers = this.getPieChartData([
          ['Inactive', this.info.allCustomer - this.info.activeCustomer],
          ['Active', this.info.activeCustomer],
        ]);
        this.chartDataOrders = this.getPieChartData([
          ['New', this.info.newOrder],
          ['Paid', this.info.paidOrder],
          ['Shipped', this.info.shippedOrder],
        ]);
        this.chartDataOrdersAmount = this.getPieChartData([
          ['New', this.info.newOrderAmount],
          ['Paid', this.info.paidOrderAmount],
          ['Shipped', this.info.shippedOrderAmount],
        ]);
        this.chartDataBills = this.getPieChartData([
          ['New', this.info.newBill],
          ['Paid', this.info.paidBill],
        ]);
        this.chartDataBillsAmount = this.getPieChartData([
          ['New', this.info.newBillAmount],
          ['Paid', this.info.paidBillAmount],
        ]);

        this.setOptionSalesByCategory( categories, products, orders );
        this.setOptionSalesByTopCustomer( customers, products, orders );
      }
    })
  }

  chartDataProducts:EChartsOption | null = null;
  chartDataCustomers:EChartsOption | null = null;
  chartDataOrders:EChartsOption | null = null;
  chartDataOrdersAmount:EChartsOption | null = null;
  chartDataBills:EChartsOption | null = null;
  chartDataBillsAmount:EChartsOption | null = null;

  getPieChartData(data: [string, number][]): EChartsOption {
    const sum:number = data.reduce((prev, e) => prev += e[1], 0);
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      calculable: true,
      series: [
        {
          center: ['50%', '50%'],
          radius: ['20%', '75%'],
          roseType: 'radius',
          data: data.map(e => ({
            name: `${e[0]}\n(${(e[1] / sum * 100).toFixed(1)}%)`,
            value: e[1],
            label: {position: 'inner'},
          })),
          type: 'pie',
        },
      ],
    }
  }

  setOptionSalesByCategory( categories: Category[], products: Product[], orders: Order[] ) {

    const sortCategory = (a:Category,b:Category) => b.name.localeCompare(a.name);

    const data = categories.sort(sortCategory).map( category =>
      products
        .filter( product => product.catID === category.id )
        .map( product =>
          orders
            .filter( order => order.productID === product.id )
            .map( order => order.amount * product.price )
        )
        .flat()
        .reduce( (p,c)=>p+c )
    );

    const xAxisData = categories.sort(sortCategory).map(
      c => (c.name.length <= 6) ? c.name : c.name.substring(0,6)+'.' );

    this.optionsSalesByCategory = {
      tooltip: {
        trigger: 'item',
      },
      xAxis: {
        data: xAxisData,
        axisLabel: {
          inside: !true,
          color: '#999',
        },
        axisTick: {
          show: !false,
        },
        axisLine: {
          show: !false,
        },
      },
      yAxis: {
        axisLabel: {
          color:"#999"
        },
      },
      series: [
        {
          type: 'bar',
          itemStyle: {
            color: new LinearGradient( 0, 0, 0, 1, [
              { offset: 0, color: '#ffb746' },
              { offset: 0.5, color: '#ffa726' },
              { offset: 1, color: '#ffa726' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: '#ffa726'
            }
          },
          data
        },
      ],
    };
  }


  setOptionSalesByTopCustomer( customers: Customer[], products: Product[], orders: Order[] ) {

    const dataCustomer = customers
      .map( customer => {
        return {
          id: customer.id,
          name: `${customer.firstName} ${customer.lastName}`,
          total:
            orders
            .filter( order => order.customerID === customer.id )
            .flat()
            .map( order =>
              products
              .filter( product => product.id === order.productID )
              .map( product => product.price * order.amount )
            )
            .flat()
            .reduce( (p,c)=>p+c, 0 )
        }
      })
      .sort( (c1,c2) => {
        return c2.total-c1.total;
      });

    const customerYAxis = dataCustomer.slice( 0, 10 ).map( d => d.name ).reverse();
    const customerData = dataCustomer.slice( 0, 10 ).map( d => d.total ).reverse();

    this.optionsSalesByTopCustomer =
      {
        tooltip: {
          trigger: 'item',
        },
        yAxis: {
          data: customerYAxis,
          axisLabel: {
            inside: !true,
            color: '#999',
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
          },
        },
        xAxis: {
          axisLabel: {
            color: '#999',
          },
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: new LinearGradient( 0, 0, 0, 1, [
                { offset: 0, color: '#ffb746' },
                { offset: 0.5, color: '#ffa726' },
                { offset: 1, color: '#ffa726' },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: '#ffa726'
              }
            },
            data: customerData
          },
        ],
      };
  }

  ngOnInit(): void {
    this.initInfo();
  }

  optionsSalesByCategory: EChartsOption;
  optionsSalesByTopCustomer: EChartsOption;

}
