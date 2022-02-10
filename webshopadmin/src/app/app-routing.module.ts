// import { Observable } from 'rxjs';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditBillComponent } from './common/edit-bill/edit-bill.component';
import { EditCategoryComponent } from './common/edit-category/edit-category.component';
import { EditCustomerComponent } from './common/edit-customer/edit-customer.component';
import { EditOrderComponent } from './common/edit-order/edit-order.component';
import { EditProductComponent } from './common/edit-product/edit-product.component';
import { ListBillComponent } from './common/list-bill/list-bill.component';
import { ListCategoryComponent } from './common/list-category/list-category.component';
import { ListCustomerComponent } from './common/list-customer/list-customer.component';
import { ListOrderComponent } from './common/list-order/list-order.component';
import { ListProductComponent } from './common/list-product/list-product.component';


const routes: Routes = [
  {
    path: "",
    component: DashboardComponent
  },
  {
    path: "bill/:id",
    component: EditBillComponent,
  },
  {
    path: "category/:id",
    component: EditCategoryComponent,
  },
  {
    path: "customer/:id",
    component: EditCustomerComponent,
  },
  {
    path: "order/:id",
    component: EditOrderComponent,
  },
  {
    path: "product/:id",
    component: EditProductComponent,
  },
  {
    path: "category",
    component: EditCategoryComponent,
  },
  {
    path: "list/bill",
    component: ListBillComponent,
  },
  {
    path: "list/category",
    component: ListCategoryComponent,
  },
  {
    path: "list/customer",
    component: ListCustomerComponent,
  },
  {
    path: "list/order",
    component: ListOrderComponent,
  },
  {
    path: "list/product",
    component: ListProductComponent,
  },
  {
    path: "**",
    redirectTo: ""
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
