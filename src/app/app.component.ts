import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { VariableService } from './services/variable.service';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('logoAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          animate('0.3s', style({ opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: any;
  public searching = false;
  public variables: any;
  public working = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document,
    private route: ActivatedRoute,
    private router: Router,
    private variableService: VariableService,
  ) {
    this.variables = this.variableService;
  }

  ngOnInit() {
    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.scroll();
      }
    });

    this.variableService.varSubject.subscribe( () => {
      this.setLang();
    });
  }

  setLang() {
    if (this.route.children.length > 0) {
      this.route.children[0].data.subscribe(d => {
        if (d.message && (d.message !== this.variables.lang)) {
          this.variables.lang = d.message;
          this.variableService.setLanguage(d.message).subscribe(() => {
            if (this.variables.varDone) {
              this.working = false;
            }
          }, () => {
            console.log('langrouter error');
          });
        } else {
          if (this.variables.varDone) {
            this.working = false;
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  scroll() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout (() => {
        window.scrollTo(0, 0);
      });
    }
  }

}
