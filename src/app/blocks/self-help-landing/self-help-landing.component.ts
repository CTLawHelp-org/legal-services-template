import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-self-help-landing',
  templateUrl: './self-help-landing.component.html',
  styleUrls: ['./self-help-landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelfHelpLandingComponent implements OnInit {
  private connection: any;
  public working = true;
  public variables: any;
  public nsmi = [];

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.variables = this.variableService;
    this.connection = this.apiService.getNSMI().subscribe(results => {
      this.nsmi = results.nsmi;
      this.doneLoading();
    });
  }

  doneLoading() {
    const self = this;
    this.nsmi.forEach(function(i) {
      if (i.term_export.field_term_file.length > 0) {
        self.iconRegistry.addSvgIcon(
          'tid' + i.id,
          self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_term_file[0].url));
      }
    });
    this.working = false;
    if (this.connection) {
      this.connection.unsubscribe();
    }
  }

}
