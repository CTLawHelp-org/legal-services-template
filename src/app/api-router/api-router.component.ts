import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { ApiService } from '../services/api.service';
import { VariableService } from '../services/variable.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { Angulartics2 } from 'angulartics2';
import { MetaService } from '@ngx-meta/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-api-router',
  templateUrl: './api-router.component.html',
  styleUrls: ['./api-router.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApiRouterComponent implements OnInit, OnDestroy {
  private connection: any;
  public node = [];
  private id = '';
  private path: string;
  private paths: any = [];
  private old_paths: any = [];
  private url: string;
  public working = true;
  private subscription: any;
  public media: any;
  private lang: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    private angulartics2: Angulartics2,
    private meta: MetaService,
    @Inject(DOCUMENT) private document: any,
    private renderer2: Renderer2
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.load();

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.load();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.meta.removeTag('property="og:description"');
  }

  load() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.path = this.router.url;
    this.lang = typeof this.variableService.lang === 'undefined' ? 'en' : this.variableService.lang;
    if (this.id !== '' && this.isNumeric(this.id)) {
      this.loadNode(false);
    } else {
      // not an ID, continue as a path
      if (this.router.url.match(/^\/en\//) === null && this.router.url.match(/^\/es\//) === null) {
        const new_url = '/' + this.lang + this.router.url;
        this.url = this.router.url.substring(1);
        this.path = new_url;
        this.location.replaceState(this.path);
      } else {
        this.url = this.router.url.substring(4);
      }
      this.connection = this.apiService.getPaths().subscribe(data => {
        this.paths = data;
        this.checkPaths();
      });
    }
  }

  checkPaths() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    const self = this;
    let found = false;
    this.paths.forEach(function(i) {
      if (i.path === self.url) {
        found = true;
        self.id = i.nid;
      }
    });
    if (found) {
      this.loadNode(false);
    } else {
      this.connection = this.apiService.getOldPaths().subscribe(data => {
        this.old_paths = data;
        this.checkOldPaths();
      });
    }
  }

  checkOldPaths() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    const self = this;
    let found = false;
    this.old_paths.forEach(function(i) {
      if (i.old_path === self.url) {
        found = true;
        self.id = i.nid;
      }
    });
    if (found) {
      this.loadNode(true);
    } else {
      // Page not found - Send to error page / home
      const er = this.lang + '/home';
      this.router.navigate([er]);
    }
  }

  loadNode(usePath: boolean) {
    this.connection = this.apiService.getNode(this.id).subscribe(data => {
      this.node = data;
      this.variableService.setPageTitle(this.decodeTitle(this.node[0].title));
      this.meta.setTag('og:title', this.decodeTitle(this.node[0].title));
      this.meta.setTag('og:url', this.document.location.href);
      if (this.node[0].node_export.body.length > 0
        && typeof this.node[0].node_export.body[0].summary !== 'undefined'
        && this.node[0].node_export.body[0].summary !== null) {
        this.meta.setTag('og:description', this.htmlToPlain(this.node[0].node_export.body[0].summary));
      }
      const dimensions = {};
      // analytics for field_reporting
      if (this.node[0].node_export.field_reporting && this.node[0].node_export.field_reporting.length > 0) {
        const output = [];
        this.node[0].node_export.field_reporting.forEach(function (i) {
          output.push(i.name);
        });
        dimensions['dimension1'] = output.join(';');
      }
      // analytics for field_nsmi
      if (this.node[0].node_export.field_nsmi && this.node[0].node_export.field_nsmi.length > 0) {
        const output = [];
        this.node[0].node_export.field_nsmi.forEach(function (i) {
          output.push(i.target_id);
        });
        dimensions['dimension2'] = output.join(';');
      }
      // analytics for field_type
      if (this.node[0].node_export.field_type && this.node[0].node_export.field_type.length > 0) {
        dimensions['dimension3'] = this.node[0].node_export.field_type[0].name;
      }
      // analytics for Page content ID
      if (this.node[0].node_export.type[0].target_id === 'page') {
        dimensions['dimension4'] = this.node[0].nid;
      }
      this.angulartics2.setUserProperties.next(dimensions);
      if (usePath && this.node[0].node_export.field_path && this.node[0].node_export.field_path.length > 0) {
        this.path = '/' + this.lang + '/' + this.node[0].node_export.field_path[0].value;
        this.location.replaceState(this.path);
      }
      this.angulartics2.pageTrack.next({ path: this.path });
      this.doneLoading();
    });
  }

  doneLoading() {
    this.angulartics2.setUserProperties.next({});
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.working = false;
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
  }

  decodeTitle(str: string): string {
    return str.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  }

  htmlToPlain(str: string): string {
    return str.replace(/<.*?>/g, '');
  }

  isValidNode(): boolean {
    if (this.node[0].nid === '663' || this.node[0].nid === '664'
      || this.node[0].nid === '670' || this.node[0].nid === '723') {
      return true;
    } else {
      return false;
    }
  }

}
