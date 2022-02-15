import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
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
  ) { }

  ngOnInit(): void {

  }

  onUpdate(product: Product): void {
    this.productService.createOrUpdate(product).subscribe(
      product => this.router.navigate(['/list/product']),
      err => console.error(err)
    )
  }

}
