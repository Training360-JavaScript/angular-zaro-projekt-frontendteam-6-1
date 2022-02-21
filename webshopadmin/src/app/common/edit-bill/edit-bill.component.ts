import { OrderService } from './../../service/order.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, map, combineLatest } from 'rxjs';
import { Bill } from 'src/app/model/bill';
import { BillService } from 'src/app/service/bill.service';
import { Product } from 'src/app/model/product';
import { ProductService } from './../../service/product.service';
import { Customer } from 'src/app/model/customer';
import { CustomerService } from './../../service/customer.service';
import { Order } from 'src/app/model/order';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

class SOrder {
  constructor(
    public id: number = 0,
    public name: string,
  ) {}
}

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.scss'],
})
export class EditBillComponent implements OnInit {
  orderControl = new FormControl();

  @Input() set billID(value: number) {
    this.setupBill(this.billService.getOrNew(value));
  }

  @Input() closeNavigatePath: string[] | null | number = -1;

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  bill: Bill | null = null;

  filteredList$: Observable<SOrder[]>;


  modalOrder: boolean = false;

  setupBill(b$: Observable<Bill>): void {
    b$.subscribe(b => {
      this.bill = b;
      this.setupOrder();
    })
  }

  getOrderName(o?: Order, c?: Customer):string {
    if (!o)
      return  '#0';
    else if (!c)
      return `#${o.id}`;
    else
    return `#${o.id} (${c.firstName} ${c.lastName})`
  }

  setupOrder() {
    if (this.bill) {
      this.orderService.get(this.bill.orderID)
      .pipe(switchMap(o => this.orderService.getCustomer(o).pipe(map(c => new SOrder(o.id, this.getOrderName(o, c))))))
      .subscribe(so => {
        this.orderControl.setValue(so);
      });
    }

    this.filteredList$ = combineLatest([
      combineLatest([
        this.orderService.getAll(),
        this.customerService.getAll(),
      ]).pipe(map (ee => {
        return ee[0].map(o => new SOrder(o.id, this.getOrderName(o, ee[1].find(c => c.id === o.customerID))));
      })),
      this.orderControl.valueChanges,
    ]).pipe(map (ee => {
      const array = ee[0];
      const value = ee[1];
      if (value?.id) {
        if (this.bill)
          this.bill.orderID = value.id;
        return array.filter(e => e.id == value.id);
      } else {
        if(this.bill)
          this.bill.orderID = 0;
        return array.filter(so => this.displayFunc(so).toLowerCase().includes(String(value).toLocaleLowerCase()));
      }
    }));


    // this.filteredList$ = combineLatest([
    //   this.orderService.getAll(),
    //   this.customerService.getAll(),
    //   this.orderControl.valueChanges
    //   ]).pipe(map(ee => {
    //     const value = ee[2];
    //     const array = ee[0].map(o => new SOrder(o.id, this.getOrderName(o, ee[1].find(c => c.id === o.customerID))));
    //     if (value?.id) {
    //       if (this.bill)
    //         this.bill.orderID = value.id;
    //       return array.filter(e => e.id == value.id);
    //     } else {
    //       if(this.bill)
    //         this.bill.orderID = 0;
    //       return array.filter(so => this.displayFunc(so).toLowerCase().includes(String(value).toLocaleLowerCase()));
    //     }
    //   }
    //   ));
  }

  constructor(
    private billService: BillService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toaster: ToastrService
  ) {
    this.setupBill(this.activatedRoute.params
      .pipe(switchMap(params => this.billService.getOrNew(params['id']))));
  }

  displayFunc(value:  SOrder | string | null): string {
    if (!value)
      return '';
    else if (typeof value === 'string')
      return value;
    else
      return value.name;
  }

  ngOnInit(): void {}

  editOrder() {
    this.modalOrder = true;
  }

  modalOrderEnd($event: Order | null): void {
    if ($event && this.bill) {
      this.bill!.orderID = $event.id;
      this.setupOrder();
    }
    this.modalOrder = false;
  }

  onSubmit(bill: Bill) {
    this.billService.createOrUpdate(bill).subscribe({
      next: (nBill) => this.onClose(true, nBill, this.bill?.id === 0),
      error: console.log,
    });
  }

  onClose(result: boolean, nBill?: Bill, isNew: boolean = false): void {
    if (result) {
      if (isNew)
        this.toaster.success(`Bill #${nBill?.id} created successfully.`);
      else this.toaster.success(`Bill #${nBill?.id} modified successfully.`);
    }
    if (this.closeNavigatePath !== null) {
      if (typeof this.closeNavigatePath === 'number')
        this.location.historyGo(this.closeNavigatePath as number);
      else this.router.navigate(this.closeNavigatePath as string[]);
    }
  }


}
