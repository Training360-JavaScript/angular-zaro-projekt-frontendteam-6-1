import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  titleWhenEdit: string = 'Category details'
  titleWhenCreate: string = 'Add a category'

  category$: Observable<Category> = this.activatedRoute.params.pipe(
    switchMap( params => this.categoryService.getOrNew(params['id']))
  )


  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {

  }

  onUpdate(category: Category): void {
    this.categoryService.createOrUpdate(category).subscribe(
      category => this.router.navigate(['/list/category']),
      err => console.error(err)
    )
  }


}
