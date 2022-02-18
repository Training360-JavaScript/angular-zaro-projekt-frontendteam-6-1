import { ProductService } from './../../service/product.service';
import { CustomerService } from './../../service/customer.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { combineLatest, Observable, Subject, switchMap, map, startWith, tap } from 'rxjs';
import { OrderService } from 'src/app/service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/model/order';
import { Product } from 'src/app/model/product';
import { Customer } from 'src/app/model/customer';
import { Location } from '@angular/common'
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit {

  customerControl = new FormControl();
  productControl = new FormControl();

  @Input() closeNavigatePath: string[] | null | number = -1;

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  order: Order | null = null;

  product$: Observable<Product> | null = null;

  filteredProducts$: Observable<Product[]> | null = null;

  customer$: Observable<Customer> | null = null;

  filteredCustomers$: Observable<Customer[]> | null = null;

  customerSetup(): void {
    if (this.order) {
      this.customer$ = this.orderService.getCustomer(this.order)
        .pipe(tap(e => this.customerControl.setValue(this.displayCustomer(e))));
      this.filteredCustomers$ = combineLatest([
        this.customerService.getAll(),
        this.customerControl.valueChanges.pipe(map(e => this.displayCustomer(e)))
        ]).pipe(map(ee => ee[0]
          .filter(e => (this.displayCustomer(e)).toLowerCase().includes(ee[1].toLowerCase()))));
    }
  }

  productSetup(): void {
    if (this.order) {
      this.product$ = this.orderService.getProduct(this.order)
        .pipe(tap(e => this.productControl.setValue(this.displayProduct(e))));
      this.filteredProducts$ = combineLatest([
        this.productService.getAll(),
        this.productControl.valueChanges.pipe(map(e => this.displayProduct(e)))
        ]).pipe(map(ee => ee[0]
          .filter(e => (this.displayProduct(e)).toLowerCase().includes(ee[1].toLowerCase()))));
    }
  }

  modalCustomer: boolean = false;

  modalProduct: boolean = false;

  constructor(
    private orderService: OrderService,
    private customerService:  CustomerService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toaster: ToastrService,
  ) { }

  displayCustomer(customer: Customer | string | null): string {
    if (!customer)
      return '';
    else if (typeof customer === 'string')
      return customer;
    else
      return `${customer.firstName} ${customer.lastName}`;
  }

  displayProduct(product: Product | string | null): string {
    if (!product)
      return '';
    else if (typeof product === 'string')
      return product;
    else
      return `${product.name}`;
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(switchMap(params => this.orderService.getOrNew(params['id']))).subscribe(e => {
      this.order = e;
      this.customerSetup();
      this.productSetup();
    });

    this.customerControl.valueChanges.subscribe(e => {
      if (e && e?.id && this.order)
        this.order.customerID = e?.id;
    })

    this.productControl.valueChanges.subscribe(e => {
      if (e && e?.id && this.order)
        this.order.productID = e?.id;
    })
  }

  onSubmit(order: Order) {
    this.orderService.createOrUpdate(order).subscribe({
      next: () => this.onClose(true),
      error: console.log,
    });
  }

  onClose(result: boolean): void {
    this.close.emit(result);
    if (result) {
      if (this.order?.id)
        this.toaster.success(`Order #${this.order?.id} modified successfully.`);
      else
        this.toaster.success(`Order #${this.order?.id} created successfully.`);
    }
    if (this.closeNavigatePath !== null) {
      if (typeof this.closeNavigatePath === 'number')
          this.location.historyGo(this.closeNavigatePath as number);
      else
        this.router.navigate(this.closeNavigatePath as string[]);
    }
  }


  editProduct(): void {
    this.modalProduct = true;
  }

  modalProductEnd($event: any): void {
    if ($event)
      this.productSetup();
    this.modalProduct = false;
  }

  editCustomer(): void {
    this.modalCustomer = true;
  }

  modalCustomerEnd($event: Customer | null): void {
    if ($event && this.order) {
      this.order.customerID = $event.id;
      this.customerSetup();
    }
    this.modalCustomer = false;
  }

}
