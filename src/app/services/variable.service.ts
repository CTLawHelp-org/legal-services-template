import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';

import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatIconRegistry } from '@angular/material';
import { isPlatformBrowser } from '@angular/common';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MetaService } from '@ngx-meta/core';

@Injectable()
export class VariableService {
  public site_title: string;
  public site_vars = {};
  public lang: string;
  public auth = false;
  public token: string;
  public adminTitle: string;
  public labelEdit = false;
  public labelComp: string;
  public labelMap = {};
  public working = true;
  public varDone = false;
  public authSubject = new Subject();
  private isBrowser: any;
  public langSubject = new Subject();
  public varSubject = new Subject();
  public issuesSubject = new Subject();
  public locationSubject = new Subject();
  public statusSubject = new Subject();
  public getlocSubject = new Subject();

  constructor(
    private titleService: Title,
    private apiService: ApiService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId,
    private meta: MetaService
  ) {
    // set defaults
    this.site_title = 'Legal Services Template';
    this.isBrowser = isPlatformBrowser(platformId);
    const self = this;
    const types = this.apiService.getPageTypes();
    const icons = this.apiService.getIcons();
    const vars = this.apiService.getVars();
    const user = this.apiService.getUser();
    const user2 = this.apiService.getUser2();

    const con = forkJoin([types, icons, vars, user, user2]).subscribe( results => {
      // Page type icons
      results[0].forEach(function(i) {
        if (i.term_export.field_term_file.length > 0) {
          self.iconRegistry.addSvgIcon(
            'tid' + i.tid,
            self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_term_file[0].url));
        }
      });
      // Bulk Icons
      results[1].forEach(function(i) {
        if (i.term_export.field_term_file.length > 0) {
          self.iconRegistry.addSvgIcon(
            'tid' + i.tid,
            self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_term_file[0].url));
        }
      });
      // Site variables
      results[2]['vars'].forEach(function(i) {
        self.site_vars[i.name] = i;
      });
      this.site_title = this.site_vars['site_title']['desc'];
      // site wide meta tags
      this.meta.setTag('og:site_name', this.site_title);
      this.meta.setTag('twitter:card', 'summary');
      if (isPlatformBrowser(platformId)) {
        const lang = sessionStorage.getItem('lang');
        if (lang !== null) {
          this.lang = lang;
        } else {
          this.lang = 'en';
        }
      } else {
        this.lang = 'en';
      }
      // Check for user account
      if (results[3] === results[4]) {
        this.token = results[3];
        this.getUserAccount();
      } else {
        this.varDone = true;
        this.authSubject.next(this.auth);
        this.varSubject.next();
      }
    });
  }

  getUserAccount() {
    this.apiService.getAccount().subscribe( results => {
      if (results[0].user_export.roles[0].target_id === 'administrator') {
        this.auth = true;
      }
      this.varDone = true;
      this.authSubject.next(this.auth);
      this.varSubject.next();
    });
  }

  hasAuth(): Observable<any> {
    if (this.varDone) {
      const sub = new Subject();
      this.returnService(sub, this.auth);
      return sub.asObservable();
    } else {
      return this.authSubject.asObservable();
    }
  }

  returnService(subject: Subject<any>, value: any) {
    setTimeout (() => {
      subject.next(value);
      subject.complete();
    });
  }

  // HTML Title / Meta
  setPageTitle(title: string) {
    this.titleService.setTitle(title + ' | ' + this.site_title);
  }

  // Language
  setLanguage(opt: string): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('lang', opt);
    }
    setTimeout (() => {
      this.langSubject.next();
      sub.next();
      sub.complete();
    });
    return sub;
  }

  // User Status
  setStatus(status: any): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('status', JSON.stringify(status));
    }
    setTimeout (() => {
      this.statusSubject.next(status);
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getStatus(): Observable<any> {
    const sub = new Subject();
    let data = [];
    if (this.isBrowser) {
      const val = sessionStorage.getItem('status');
      if (val !== null) {
        data = JSON.parse(val);
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // User Issues
  setIssues(issue: any): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('issues', JSON.stringify(issue));
    }
    setTimeout (() => {
      this.issuesSubject.next(issue);
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getIssues(): Observable<any> {
    const sub = new Subject();
    let data = [];
    if (this.isBrowser) {
      const val = sessionStorage.getItem('issues');
      if (val !== null) {
        data = JSON.parse(val);
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // User In State
  setState(state: boolean): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('state', JSON.stringify(state));
    }
    setTimeout (() => {
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getState(): Observable<any> {
    const sub = new Subject();
    let data = false;
    if (this.isBrowser) {
      const val = sessionStorage.getItem('state');
      if (val === 'true') {
        data = true;
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // User Location
  setLocation(loc: any): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('location', JSON.stringify(loc));
    }
    setTimeout (() => {
      this.locationSubject.next(loc);
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getLocation(): Observable<any> {
    const sub = new Subject();
    let data = {
      zipcode: '',
      city: '',
      county: ''
    };
    if (this.isBrowser) {
      const val = sessionStorage.getItem('location');
      if (val !== null) {
        data = JSON.parse(val);
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // Get Location
  setGetLoc(loc: boolean): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('getloc', JSON.stringify(loc));
    }
    setTimeout (() => {
      this.getlocSubject.next(loc);
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getGetLoc(): Observable<any> {
    const sub = new Subject();
    let data = false;
    if (this.isBrowser) {
      const val = sessionStorage.getItem('getloc');
      if (val === 'true') {
        data = true;
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // Searches
  setSearch(search: any): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('search', JSON.stringify(search));
    }
    setTimeout (() => {
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getSearch(): Observable<any> {
    const sub = new Subject();
    let data = [];
    if (this.isBrowser) {
      const val = sessionStorage.getItem('search');
      if (val !== null) {
        data = JSON.parse(val);
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

}
