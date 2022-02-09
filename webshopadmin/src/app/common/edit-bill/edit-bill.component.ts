import { Component, OnInit } from '@angular/core';
import { BillService } from 'src/app/service/bill.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Bill } from 'src/app/model/bill';
import { Order } from 'src/app/model/order';

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.scss']
})
export class EditBillComponent implements OnInit {

  bill$: Observable<Bill> = this.activatedRoute.params.pipe(
    switchMap(params => this.billService.get(params['id']))
  );

  order$: Observable<Order> = this.billService.getOrderAsync(this.bill$)

  constructor(
    private billService: BillService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onUpdate(bill: Bill): void {
    this.billService.update(bill).subscribe(
      (bill) => this.router.navigate(['/']),
      (err) => console.error(err)
    );
  }
}
