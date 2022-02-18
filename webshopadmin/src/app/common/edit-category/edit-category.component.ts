import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
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
    private location: Location,
    private toaster: ToastrService,
  ) { }

  @Input() closeNavigatePath: string[] | null | number = -1;

  @Output() close : EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {

  }
  /* onUpdate(category: Category): void {
    this.categoryService.createOrUpdate(category).subscribe(
      category => this.router.navigate(['/list/category']),
      err => console.error(err)
    )
  } */

  onUpdate(category: Category) {
    this.categoryService.createOrUpdate(category).subscribe({
      next: () => this.onClose(true, category),
      error: console.log,
    })
  }

  onClose(result: boolean, category?: Category) {
    this.close.emit(result);
    if (result) {
      if (category?.id)
        this.toaster.success(`${category.name} has been successfully modified.`);
      else
        this.toaster.success(`${category?.name} ${category?.name} has been created successfully.`);
    }
    if (this.closeNavigatePath !== null) {
      if (typeof this.closeNavigatePath === 'number')
          this.location.historyGo(this.closeNavigatePath as number);
      else
        this.router.navigate(this.closeNavigatePath as string[]);
    }
  }


}
