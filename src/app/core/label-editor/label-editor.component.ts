import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VariableService } from '../../services/variable.service';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-label-editor',
  templateUrl: './label-editor.component.html',
  styleUrls: ['./label-editor.component.scss']
})
export class LabelEditorComponent implements OnInit {
  public variables: any;
  public labels = [];

  constructor(
    private variableService: VariableService,
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    const self = this;
    if (this.variables.labelMap[this.variables.labelComp] && this.variables.labelMap[this.variables.labelComp].length > 0) {
      this.variables.labelMap[this.variables.labelComp].forEach(function (item) {
        const obj = {
          id: item,
          src: JSON.parse(JSON.stringify(self.variables.site_vars[item]))
        };
        self.labels.push(obj);
      });
    }
    if (this.variables.labelMap['root'] && this.variables.labelMap['root'].length > 0) {
      this.variables.labelMap['root'].forEach(function (item) {
        const obj = {
          id: item,
          src: JSON.parse(JSON.stringify(self.variables.site_vars[item]))
        };
        self.labels.push(obj);
      });
    }
  }

  resetItem(item: any) {
    item.src = JSON.parse(JSON.stringify(this.variables.site_vars[item.id]));
  }

  saveItem(item: any) {
    item.working = true;
    const data = {
      _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/variables'}},
      description: [{value: item.src.desc, format: 'full_html'}]
    };
    this.apiService.updateTerm(item.src.tid, data, this.variables.token).subscribe( result => {
      data.description = [{value: item.src.es.desc, format: 'full_html'}];
      this.apiService.updateTermES(item.src.tid, data, this.variables.token).subscribe( result_es => {
        item.working = false;
      });
    });
  }

}
