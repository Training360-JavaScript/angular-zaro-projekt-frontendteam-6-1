import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { Category } from 'src/app/model/category';
import { Product } from 'src/app/model/product';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  @Input() closeNavigatePath: string[] | null | number = -1;

  @Input() set productID(value: number) {
    this.product$ = this.productService.getOrNew(value)
      .pipe(map( e => {
        if (e.id === 0 && this.defaultName)
          e.name = this.defaultName;
        return e;
      }));
  }

  @Input() defaultName: string = '';

  @Output() close : EventEmitter<Product | null> = new EventEmitter();

  product$: Observable<Product>;

  categories$: Observable<Category[]> = this.categoryService.getAll()

  titleWhenEdit: string = 'Product details'
  titleWhenCreate: string = 'Add a product'

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toaster: ToastrService,
  ) {
    this.product$ = this.activatedRoute.params.pipe(switchMap(params => this.productService.getOrNew(params['id'])));
   }

  ngOnInit(): void {

  }

  onSubmit(product: Product) {
    this.productService.createOrUpdate(product).subscribe({
      next: nProduct => this.onClose(true, nProduct),
      error: error => this.toaster.error(error),
    })
  }

  onClose(result: boolean, product?: Product, isNew: boolean = false) {
    this.close.emit(result ? product : null);
    if (result) {
      if (isNew)
        this.toaster.success(`${product?.name} ${product?.name} has been created successfully.`);
      else
        this.toaster.success(`${product?.name} has been successfully modified.`);
    }
    if (this.closeNavigatePath !== null) {
      if (typeof this.closeNavigatePath === 'number')
          this.location.historyGo(this.closeNavigatePath as number);
      else
        this.router.navigate(this.closeNavigatePath as string[]);
    }
  }


}
