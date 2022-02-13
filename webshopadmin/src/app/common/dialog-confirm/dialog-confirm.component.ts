import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string,
  content: string,
  options: {
    name: string,
    value: string,
    color?: string
  }[]
}

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
  }

}
