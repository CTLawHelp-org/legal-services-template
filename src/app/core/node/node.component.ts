import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { environment } from './../../../environments/environment';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ApiService } from '../../services/api.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { animate, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('contentAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          animate('0.3s', style({ opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class NodeComponent implements OnInit {
  @Input() curNode;
  public variables: any;
  public adminUrl: string;
  public media: any;
  public working = true;
  public isBrowser: any;

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
    private breakpointObserver: BreakpointObserver,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.media = breakpointObserver;
    iconRegistry.addSvgIcon(
      'print',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/print.svg'));
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.adminUrl = environment.adminUrl + '/content/proc/' + this.curNode[0].nid;
    this.working = false;
  }

  showCredit(): boolean {
    let output = false;
    if (this.curNode[0].node_export.field_reporting && this.curNode[0].node_export.field_reporting.length > 0) {
      this.curNode[0].node_export.field_reporting.forEach(function (i) {
        if (i.target_id === '642') {
          output = true;
        }
      });
    }
    return output;
  }

  print() {
    if (this.isBrowser) {
      window.print();
    }
  }

}
