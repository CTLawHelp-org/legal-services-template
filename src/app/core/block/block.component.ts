import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlockComponent implements OnInit {
  @Input() nid;
  private connection: any;
  public working = true;
  public variables: any;
  public node = [];
  public adminUrl: string;
  public adminUrl2: string;

  constructor(
    private variableService: VariableService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.connection = this.apiService.getNode(this.nid).subscribe(results => {
      this.node = results;
      this.adminUrl = environment.adminUrl + '/content/proc/' + results[0].nid;
      this.adminUrl2 = '/admin/content/' + results[0].nid;
      this.connection.unsubscribe();
      this.doneLoading();
    });
  }

  doneLoading() {
    this.working = false;
  }

  show(item: any): boolean {
    let output = false;
    if ((this.variables.lang === item.src.field_lang_status[0].value) || item.src.field_lang_status[0].value === 'both') {
      output = true;
    }
    return output;
  }

}
