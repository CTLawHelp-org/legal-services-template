import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-form-node-ref',
  templateUrl: './admin-form-node-ref.component.html',
  styleUrls: ['./admin-form-node-ref.component.scss']
})
export class AdminFormNodeRefComponent implements OnInit {
  @Input() src;
  private copy: any;

  constructor() { }

  ngOnInit() {}

}
