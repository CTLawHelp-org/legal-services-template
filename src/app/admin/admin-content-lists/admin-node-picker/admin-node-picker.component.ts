import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { VariableService } from '../../../services/variable.service';

@Component({
  selector: 'app-admin-node-picker',
  templateUrl: './admin-node-picker.component.html',
  styleUrls: ['./admin-node-picker.component.scss']
})
export class AdminNodePickerComponent implements OnInit {
  @Input() src;
  @Input() type;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  addContent(type: string): void {
    const width = '95vw';
    const height = '80vh';
    const dialogRef = this.dialog.open(AdminNodePickerDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: { type: type }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}

@Component({
  selector: 'app-admin-node-picker-dialog',
  templateUrl: './admin-node-picker.dialog.html',
})
export class AdminNodePickerDialogComponent implements OnInit {
  public variables: any;

  constructor(
    public dialogRef: MatDialogRef<AdminNodePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variableService: VariableService
  ) { }

  ngOnInit() {
    this.variables = this.variableService;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
