import {
  Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation
} from '@angular/core';

import { ApiService } from '../services/api.service';
import { VariableService } from '../services/variable.service';
import { isPlatformBrowser } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  private connection: any;
  public working = true;
  public title = 'Home';
  public variables: any;
  public isBrowser: any;
  public media: any;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private meta: MetaService,
    @Inject(DOCUMENT) private document: any,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.variableService.setPageTitle(this.title);
    this.meta.setTag('og:title', this.title);
    this.meta.setTag('og:url', this.document.location.href);
    this.doneLoading();
  }

  doneLoading() {
    this.working = false;
  }

}
