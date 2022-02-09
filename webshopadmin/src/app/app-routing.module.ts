import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditBillComponent } from './common/edit-bill/edit-bill.component';
import { EditCategoryComponent } from './common/edit-category/edit-category.component';
import { EditCustomerComponent } from './common/edit-customer/edit-customer.component';
import { EditOrderComponent } from './common/edit-order/edit-order.component';
import { EditProductComponent } from './common/edit-product/edit-product.component';

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
    path: "**",
    redirectTo: ""
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
