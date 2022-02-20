import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, switchMap, map, tap } from 'rxjs';
import { Bill } from 'src/app/model/bill';
import { BillService } from 'src/app/service/bill.service';
import { Product } from 'src/app/model/product';
import { ProductService } from './../../service/product.service';
import { Customer } from 'src/app/model/customer';
import { CustomerService } from './../../service/customer.service';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.scss'],
})
export class EditBillComponent implements OnInit {
  customerControl = new FormControl();
  productControl = new FormControl();

  @Input() set billID(value: number) {
    this.billService.getOrNew(value).subscribe(this.setupBill.bind(this));
  }

  @Input() closeNavigatePath: string[] | null | number = -1;

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  bill: Bill | null = null;
  order: Order | null = null;

  // előző kód átnevezve párhuzamos működéshez
  billBasic$: Observable<Bill> = this.activatedRoute.params.pipe(
    switchMap((params) => this.billService.getOrNew(params['id']))
  );
  orderBasic$: Observable<Order> = this.billService.getOrderAsync(
    this.billBasic$
  );
  customerBasic$: Observable<Customer> = this.orderService.getCustomerAsync(
    this.orderBasic$
  );
  productBasic$: Observable<Product> = this.orderService.getProductAsync(
    this.orderBasic$
  );
  // előző kód vége

  product$: Observable<Product>;
  filteredProducts$: Observable<Product[]>;

  customer$: Observable<Customer>;
  filteredCustomers$: Observable<Customer[]>;

  modalCustomer: boolean = false;
  modalProduct: boolean = false;

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
    this.activatedRoute.params
      .pipe(switchMap((params) => this.billService.getOrNew(params['id'])))
      .subscribe(this.setupBill.bind(this));
    this.activatedRoute.params
      .pipe(switchMap((params) => this.orderService.getOrNew(params['id'])))
      .subscribe(this.setupOrder.bind(this));
  }

  customerSetup(): void {
    if (this.order) {
      this.customer$ = this.orderService
        .getCustomer(this.order)
        .pipe(tap((e) => this.customerControl.setValue(e)));
      this.filteredCustomers$ = combineLatest([
        this.customerService.getAll(),
        this.customerControl.valueChanges,
      ]).pipe(
        map((ee) =>
          this.setupFunc<Customer>(
            ee[1],
            ee[0],
            this.displayCustomer,
            (e) => this.order && (this.order.customerID = e)
          )
        )
      );
    }
  }

  productSetup(): void {
    if (this.order) {
      this.product$ = this.orderService
        .getProduct(this.order)
        .pipe(tap((e) => this.productControl.setValue(e)));
      this.filteredProducts$ = combineLatest([
        this.productService.getAll(),
        this.productControl.valueChanges,
      ]).pipe(
        map((ee) =>
          this.setupFunc<Product>(
            ee[1],
            ee[0],
            this.displayProduct,
            (e) => this.order && (this.order.productID = e)
          )
        )
      );
    }
  }

  setupFunc<T extends Customer | Product>(
    value: any,
    array: T[],
    displayFunc: (e: T) => string,
    setIDFunc: (id: number) => void
  ): T[] {
    if (value?.id) {
      setIDFunc(value.id);
      return array.filter((e) => e.id == value.id);
    } else {
      setIDFunc(0);
      if (typeof value === 'string') {
        const phrase = value.toLowerCase();
        return array.filter((e) =>
          displayFunc(e).toLowerCase().includes(phrase)
        );
      } else return array.slice();
    }
  }

  displayCustomer(customer: Customer | string | null): string {
    if (!customer) return '';
    else if (typeof customer === 'string') return customer;
    else
      return (
        customer.firstName +
        (customer.firstName && customer.lastName ? ' ' : '') +
        customer.lastName
      );
  }

  displayProduct(product: Product | string | null): string {
    if (!product) return '';
    else if (typeof product === 'string') return product;
    else return `${product.name}`;
  }

  setupBill(b: Bill): void {
    this.bill = b;
    this.customerSetup();
    this.productSetup();
  }

  setupOrder(o: Order): void {
    this.order = o;
    this.customerSetup();
    this.productSetup();
  }

  ngOnInit(): void {}

  onSubmit(bill: Bill) {
    this.billService.createOrUpdate(bill).subscribe({
      next: (nBill) => this.onClose(true, nBill, this.bill?.id === 0),
      error: console.log,
    });
  }

  onClose(result: boolean, nBill?: Bill, isNew: boolean = false): void {
    /* this.close.emit(result ? nBill : null ); */
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

  // előző kód átnevezve
  editOrderBasic(order: Order): void {
    this.router.navigate(['/order', order.id]);
  }

  editProductBasic(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }
  editCustomerBasic(customer: Customer): void {
    this.router.navigate(['/customer', customer.id]);
  }
  /*  back(): void {
    this.location.back();
  } */
  // előző kód vége

  editProduct(): void {
    this.modalProduct = true;
  }

  modalProductEnd($event: Product | null): void {
    if ($event && this.order) {
      this.order!.productID = $event.id;
      this.productSetup();
    }
    this.modalProduct = false;
  }

  editCustomer(): void {
    this.modalCustomer = true;
  }

  modalCustomerEnd($event: Customer | null): void {
    if ($event && this.order) {
      this.order!.customerID = $event.id;
      this.customerSetup();
    }
    this.modalCustomer = false;
  }
}
