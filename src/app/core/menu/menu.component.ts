import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0}),
        animate('0.35s', style({opacity: 1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate('0.35s', style({opacity: 0}))
      ])
    ])
  ]
})
export class MenuComponent implements OnInit {
  public connection: any;
  public menu: any;
  public admin = false;
  public variables: any;
  public adminUrl: string;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.connection = this.apiService.getMenu().subscribe(data => {
      this.menu = data['main_menu'];
      this.doneLoading();
    });
    this.variables = this.variableService;
    this.adminUrl = environment.adminUrl;
  }

  doneLoading() {
    const self = this;
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.menu.forEach(function(i) {
      if (i.tid === '643' && i.term_export.field_pages_plus.length > 0) {
        i.term_export.field_pages_plus.forEach(function(term) {
          if (term.term_export && term.term_export.field_term_file.length > 0) {
            self.iconRegistry.addSvgIcon(
              'tid' + term.tid,
              self.sanitizer.bypassSecurityTrustResourceUrl(term.term_export.field_term_file[0].url));
          }
        });
      }
    });
  }

  over(item: any) {
    item.over = true;
  }

  out(item: any) {
    item.over = false;
  }

}
