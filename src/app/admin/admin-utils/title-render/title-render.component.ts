import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-title-render',
  template: `<span>{{value}}</span><a routerLink="/admin/content/{{nid}}" class="margin-left">Edit</a>`,
  styles: [``]
})
export class TitleRenderComponent implements ICellRendererAngularComp {
  params: any;
  value: any = null;
  nid: any = null;

  agInit(params: any): void {
    this.params = params;
    this.nid = this.params.data.nid;
    this.value = this.params.value.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  }

  refresh(params: any): boolean {
    this.params = params;
    this.value = this.params.value;
    return true;
  }
}
