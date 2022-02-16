import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
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

  product$: Observable<Product> = this.activatedRoute.params.pipe(
    switchMap( params => this.productService.getOrNew(params['id']))
  )

  category$: Observable<Category> = this.productService.getCategoryAsync(this.product$);

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
  ) { }

  @Input() closeNavigatePath: string[] | null | number = -1;

  @Output() close : EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {

  }

  /* onUpdate(product: Product): void {
    this.productService.createOrUpdate(product).subscribe(
      product => this.router.navigate(['/list/product']),
      err => console.error(err)
    )
  } */

  onSubmit(product: Product) {
    this.productService.createOrUpdate(product).subscribe({
      next: () => this.onClose(true, product),
      error: console.log,
    })
  }

  onClose(result: boolean, product?: Product) {
    this.close.emit(result);
    if (result) {
      if (product?.id)
        this.toaster.success(`${product.name} has been successfully modified.`);
      else
        this.toaster.success(`${product?.name} ${product?.name} has been created successfully.`);
    }
    if (this.closeNavigatePath !== null) {
      if (typeof this.closeNavigatePath === 'number')
          this.location.historyGo(this.closeNavigatePath as number);
      else
        this.router.navigate(this.closeNavigatePath as string[]);
    }
  }


}
