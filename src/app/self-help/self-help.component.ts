import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../services/variable.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MatIconRegistry } from '@angular/material';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Angulartics2 } from 'angulartics2';
import { MetaService } from '@ngx-meta/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-self-help',
  templateUrl: './self-help.component.html',
  styleUrls: ['./self-help.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelfHelpComponent implements OnInit, OnDestroy {
  public working = true;
  public variables: any;
  public media: any;
  private subscription: any;
  private connection: any;
  private id: string;
  private nsmi: any;
  public term: any;
  public content = [];
  public isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private variableService: VariableService,
    private apiService: ApiService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private angulartics2: Angulartics2,
    private meta: MetaService,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId,
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.load();

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  load() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== '' && this.isNumeric(this.id)) {
      this.loadTerm();
    }
  }

  loadTerm() {
    const self = this;
    this.connection = this.apiService.getNSMI().subscribe(data => {
      if (data.nsmi.length > 0) {
        data.nsmi.forEach(function(i) {
          if (self.id === i.tid) {
            self.term = i;
            self.variableService.setPageTitle(i.name);
            self.meta.setTag('og:title', i.name);
            self.meta.setTag('og:url', self.document.location.href);
            if (i.term_export.field_term_file.length > 0) {
              self.iconRegistry.addSvgIcon(
                'tid' + i.tid,
                self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_term_file[0].url));
            }
            self.loadContent();
          }
        });
      }
    });
  }

  loadContent() {
    if (this.term.children.length > 0) {
      const self = this;
      const obs = [];
      this.term.children.forEach(function(i) {
        obs.push(self.apiService.getNSMIContent(i.tid));
      });
      this.connection = forkJoin(obs).subscribe(data => {
        this.term.children.forEach(function(i, index) {
          i.content = data[index];
          i.content_en = 0;
          i.content_es = 0;
          i.content.forEach(function(cont) {
            if (cont.node_export.field_lang_status[0].value === 'en' || cont.node_export.field_lang_status[0].value === 'both') {
              i.content_en++;
            }
            if (cont.node_export.field_lang_status[0].value === 'es' || cont.node_export.field_lang_status[0].value === 'both') {
              i.content_es++;
            }
          });
        });
        this.doneLoading();
      });
    } else {
      this.connection = this.apiService.getNSMIContent(this.id).subscribe(data => {
        this.term.content = data;
        this.doneLoading();
      });
    }
  }

  doneLoading() {
    this.angulartics2.pageTrack.next({ path: this.router.url });
    this.connection.unsubscribe();
    this.working = false;
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
  }

  showContent(item: any) {
    item.show = !item.show;
  }

}
