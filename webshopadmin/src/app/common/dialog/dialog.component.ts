import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  portal: ComponentPortal<any>;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.portal = new ComponentPortal(this.data.component);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}




@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h1 mat-dialog-title>Hi {{id}}</h1>
  <div mat-dialog-content>
    <p>What's your favorite animal?</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button Xmat-dialog-close="id" cdkFocusInitial>Ok</button>
  </div>`,
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
