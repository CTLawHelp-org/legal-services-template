import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { GridOptions } from 'ag-grid';
import { TitleRenderComponent } from '../../admin-utils/title-render/title-render.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-blocks',
  templateUrl: './admin-blocks.component.html',
  styleUrls: ['./admin-blocks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminBlocksComponent implements OnInit, AfterViewInit {
  public working = true;
  public blocks = [];
  public gridOptions: GridOptions;
  public columns = [];
  public variables: any;
  @ViewChild('agGrid') agGrid;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private router: Router,
  ) {
    this.gridOptions = <GridOptions>{
      floatingFilter: true,
      enableFilter: true,
      enableSorting: true,
      rowSelection: 'multiple',
      rowHeight: 50,
      headerHeight: 50,
      floatingFiltersHeight: 50,
      enableColResize: true,
      frameworkComponents: {
        'titleRenderer': TitleRenderComponent
      }
    };
  }

  ngOnInit() {
    this.variables = this.variableService;
  }

  ngAfterViewInit() {
    this.load();
  }

  load() {
    this.variables.adminTitle = 'Blocks';
    const conn = this.apiService.getContentAdmin('block').subscribe( result => {
      this.blocks = result;
      this.columns = [
        {
          headerName: 'Title',
          field: 'title',
          width: 450,
          minWidth: 350,
          filter: 'agTextColumnFilter',
          suppressMenu: true,
          floatingFilterComponentParams: { suppressFilterButton: true },
          cellRenderer: 'titleRenderer',
        },
        {
          headerName: 'Language',
          width: 125,
          maxWidth: 125,
          minWidth: 125,
          valueGetter: this.getLang,
          suppressMenu: true,
          floatingFilterComponentParams: { suppressFilterButton: true },
        },
      ];
      this.working = false;
      this.agGrid.api.sizeColumnsToFit();
      this.agGrid.api.doLayout();
      conn.unsubscribe();
    });
  }

  getNid(params: any): any {
    return params.data.node_export.nid[0].value;
  }

  getLang(params: any): any {
    return params.data.node_export.field_lang_status[0].value;
  }

}
