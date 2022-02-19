import { ProductService } from './../../service/product.service';
import { CustomerService } from './../../service/customer.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { combineLatest, Observable, switchMap, map, tap } from 'rxjs';
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

  @Input() set orderID(value: number) {
    this.orderService.getOrNew(value).subscribe(this.setupOrder.bind(this));
  }

  @Input() closeNavigatePath: string[] | null | number = -1;

  @Output() close: EventEmitter<Order | null> = new EventEmitter();

  order: Order | null = null;

  product$: Observable<Product>;

  filteredProducts$: Observable<Product[]>;

  customer$: Observable<Customer>;

  filteredCustomers$: Observable<Customer[]>;

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
  ) {
    this.activatedRoute.params.pipe(switchMap(params => this.orderService.getOrNew(params['id']))).subscribe(this.setupOrder.bind(this));
   }

  customerSetup(): void {
    if (this.order) {
      this.customer$ = this.orderService.getCustomer(this.order)
        .pipe(tap(e => this.customerControl.setValue(e)));
      this.filteredCustomers$ = combineLatest([
        this.customerService.getAll(),
        this.customerControl.valueChanges
      ]).pipe(map(ee =>
        this.setupFunc<Customer>(ee[1], ee[0], this.displayCustomer, e => this.order && (this.order.customerID = e))
      ));
    }
  }

  productSetup(): void {
    if (this.order) {
      this.product$ = this.orderService.getProduct(this.order)
        .pipe(tap(e => this.productControl.setValue(e)));
      this.filteredProducts$ = combineLatest([
        this.productService.getAll(),
        this.productControl.valueChanges
        ]).pipe(map(ee =>
          this.setupFunc<Product>(ee[1], ee[0], this.displayProduct, e => this.order && (this.order.productID = e))
        ));
    }
  }

  setupFunc<T extends Customer | Product>(value: any, array: T[], displayFunc: (e: T) => string, setIDFunc: (id: number) => void):T[]  {
    if (value?.id) {
      setIDFunc(value.id);
      return array.filter(e => e.id == value.id);
    } else {
      setIDFunc(0);
      if (typeof value === 'string') {
        const phrase = value.toLowerCase();
        return array.filter(e => (displayFunc(e)).toLowerCase().includes(phrase));
      } else
        return array.slice();
    }
  }

  displayCustomer(customer: Customer | string | null): string {
    if (!customer)
      return '';
    else if (typeof customer === 'string')
      return customer;
    else
      return customer.firstName + (customer.firstName && customer.lastName ? ' ' : '') + customer.lastName;
  }

  displayProduct(product: Product | string | null): string {
    if (!product)
      return '';
    else if (typeof product === 'string')
      return product;
    else
      return `${product.name}`;
  }

  setupOrder(o: Order): void {
    this.order = o;
    this.customerSetup();
    this.productSetup();
  }

  ngOnInit(): void { }

  onSubmit(order: Order) {
    this.orderService.createOrUpdate(order).subscribe({
      next: nOrder => this.onClose(true, nOrder, this.order?.id === 0),
      error: error => this.toaster.error(error),
    });
  }

  onClose(result: boolean, nOrder?: Order, isNew: boolean = false): void {
    this.close.emit(result ? nOrder : null);
    if (result) {
      if (isNew)
        this.toaster.success(`Order #${nOrder?.id} created successfully.`);
      else
        this.toaster.success(`Order #${nOrder?.id} modified successfully.`);
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
