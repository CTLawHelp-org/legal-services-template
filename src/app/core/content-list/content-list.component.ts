import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { environment } from '../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentListComponent implements OnInit {
  @Input() src;
  @Input() node;
  @Input() search;
  @Input() triage;
  @Input() preview;
  public variables: any;
  public adminUrl: string;
  public item: any;
  public isBrowser: any;
  public media: any;

  constructor(
    private variableService: VariableService,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId,
    private breakpointObserver: BreakpointObserver,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.media = breakpointObserver;
    iconRegistry.addSvgIcon(
      'preview',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/preview.svg'));
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.adminUrl = environment.adminUrl + '/content/proc/';
    if (this.node && this.node.length > 0) {
      this.setupNode();
    }
    if (this.src && this.src.length > 0) {
      this.setupSrc();
    }
    if (this.search && this.search.length > 0) {
      this.setupSearch();
    }
    if (this.triage && this.triage.length > 0) {
      this.setupTriage();
    }
  }

  setupNode() {
    if (this.node.length > 0) {
      const self = this;
      this.node.forEach(function (i) {
        const link = '/en/';
        if (i.node_export.field_path.length > 0) {
          i.link = link + i.node_export.field_path[0].value;
        } else if (i.node_export.field_old_path.length > 0 && self.useOld(i.node_export.field_old_path[0].value)) {
          i.link = link + i.node_export.field_old_path[0].value;
        } else {
          i.link = link + '/node/' + i.nid;
        }
        i.item_title = i.node_export.title[0].value;
        i.summary = i.node_export.body.length > 0 ? i.node_export.body[0].summary : '';
        const link_es = '/es/';
        if (i.node_export.i18n.es.field_path.length > 0) {
          i.link_es = link_es + i.node_export.i18n.es.field_path[0].value;
        } else if (i.node_export.i18n.es.field_old_path.length > 0 && self.useOld(i.node_export.i18n.es.field_old_path[0].value)) {
          i.link_es = link_es + i.node_export.i18n.es.field_old_path[0].value;
        } else {
          i.link_es = link_es + '/node/' + i.nid;
        }
        i.item_title_es = i.node_export.i18n.es.title[0].value;
        i.summary_es = i.node_export.i18n.es.body.length > 0 ? i.node_export.i18n.es.body[0].summary : '';
        // icon
        if (i.node_export.field_icon && i.node_export.field_icon.length > 0) {
          i.icon = i.node_export.field_icon[0].target_id;
        } else if (i.node_export.field_type && i.node_export.field_type.length > 0) {
          i.icon = i.node_export.field_type[0].target_id;
        }
        i.id = i.nid;
      });
      this.item = this.node[0];
    }
  }

  setupSrc() {
    if (this.src.length > 0) {
      const self = this;
      this.src.forEach(function (i) {
        const link = '/en/';
        if (i.src.field_path.length > 0) {
          i.link = link + i.src.field_path[0].value;
        } else if (i.src.field_old_path.length > 0 && self.useOld(i.src.field_old_path[0].value)) {
          i.link = link + i.src.field_old_path[0].value;
        } else {
          i.link = link + '/node/' + i.src.nid[0].value;
        }
        i.item_title = i.src.title[0].value;
        i.summary = i.src.body[0].summary;
        const link_es = '/es/';
        if (i.src.i18n.es.field_path.length > 0) {
          i.link_es = link_es + i.src.i18n.es.field_path[0].value;
        } else if (i.src.i18n.es.field_old_path.length > 0 && self.useOld(i.src.i18n.es.field_old_path[0].value)) {
          i.link_es = link_es + i.src.i18n.es.field_old_path[0].value;
          console.log(i.src.i18n.es.field_old_path[0].value);
        } else {
          i.link_es = link_es + '/node/' + i.src.nid[0].value;
        }
        i.item_title_es = i.src.i18n.es.title[0].value;
        i.summary_es = i.src.i18n.es.body.length > 0 ? i.src.i18n.es.body[0].summary : '';
        // icon
        if (i.src.field_icon && i.src.field_icon.length > 0) {
          i.icon = i.src.field_icon[0].target_id;
        } else if (i.src.field_type && i.src.field_type.length > 0) {
          i.icon = i.src.field_type[0].target_id;
        }
        i.id = i.src.nid[0].value;
      });
      this.item = this.src[0];
    }
  }

  setupSearch() {
    if (this.search.length > 0) {
      const self = this;
      this.search.forEach(function (i) {
        const link = '/en/';
        if (i.node_export.field_path.length > 0) {
          i.link = link + i.node_export.field_path[0].value;
        } else if (i.node_export.field_old_path.length > 0 && self.useOld(i.node_export.field_old_path[0].value)) {
          i.link = link + i.node_export.field_old_path[0].value;
        } else {
          i.link = link + '/node/' + i.nid;
        }
        i.item_title = i.node_export.title[0].value;
        i.summary = i.excerpt;
        const link_es = '/es/';
        if (i.node_export.i18n.es.field_path.length > 0) {
          i.link_es = link_es + i.node_export.i18n.es.field_path[0].value;
        } else if (i.node_export.i18n.es.field_old_path.length > 0 && self.useOld(i.node_export.i18n.es.field_old_path[0].value)) {
          i.link_es = link_es + i.node_export.i18n.es.field_old_path[0].value;
        } else {
          i.link_es = link_es + '/node/' + i.nid;
        }
        i.item_title_es = i.node_export.i18n.es.title[0].value;
        i.summary_es = i.excerpt;
        // icon
        if (i.node_export.field_icon && i.node_export.field_icon.length > 0) {
          i.icon = i.node_export.field_icon[0].target_id;
        } else if (i.node_export.field_type && i.node_export.field_type.length > 0) {
          i.icon = i.node_export.field_type[0].target_id;
        }
        i.id = i.nid;
      });
      this.item = this.search[0];
    }
  }

  setupTriage() {
    if (this.triage.length > 0) {
      const self = this;
      this.triage.forEach(function (i) {
        // preprocess
        i.node_export.i18n = i.i18n;
        const link = '/en/';
        if (i.node_export.type[0].target_id === 'triage_entry') {
          i.item_title = i.node_export.field_display_title.length > 0 ? i.node_export.field_display_title[0].value : '';
          i.summary = i.node_export.body.length > 0 ? i.node_export.body[0].value : '';
        } else if (i.node_export.type[0].target_id === 'page') {
          if (i.node_export.field_path.length > 0) {
            i.link = link + i.node_export.field_path[0].value;
          } else if (i.node_export.field_old_path.length > 0 && self.useOld(i.node_export.field_old_path[0].value)) {
            i.link = link + i.node_export.field_old_path[0].value;
          } else {
            i.link = link + '/node/' + i.nid;
          }
          i.item_title = i.node_export.title[0].value;
          i.summary = i.node_export.body.length > 0 ? i.node_export.body[0].summary : '';
        }
        const link_es = '/es/';
        if (i.node_export.type[0].target_id === 'triage_entry') {
          i.item_title_es = i.node_export.i18n.es.field_display_title.length > 0 ? i.node_export.i18n.es.field_display_title[0].value : '';
          i.summary_es = i.node_export.i18n.es.body.length > 0 ? i.node_export.i18n.es.body[0].value : '';
        } else if (i.node_export.type[0].target_id === 'page') {
          if (i.node_export.i18n.es.field_path.length > 0) {
            i.link_es = link_es + i.node_export.i18n.es.field_path[0].value;
          } else if (i.node_export.i18n.es.field_old_path.length > 0 && self.useOld(i.node_export.i18n.es.field_old_path[0].value)) {
            i.link_es = link_es + i.node_export.i18n.es.field_old_path[0].value;
          } else {
            i.link_es = link_es + '/node/' + i.nid;
          }
          i.item_title_es = i.node_export.i18n.es.title[0].value;
          i.summary_es = i.node_export.i18n.es.body.length > 0 ? i.node_export.i18n.es.body[0].summary : '';
        }
        // icon
        if (i.node_export.field_icon && i.node_export.field_icon.length > 0) {
          i.icon = i.node_export.field_icon[0].target_id;
        } else if (i.node_export.field_type && i.node_export.field_type.length > 0) {
          i.icon = i.node_export.field_type[0].target_id;
        }
        i.id = i.node_export.nid[0].value;
      });
      this.item = this.triage[0];
    }
  }

  useOld(path: string): boolean {
    if (path.lastIndexOf('node/', 0) === 0) {
      return false;
    } else {
      return true;
    }
  }

  scroll() {
    if (this.isBrowser) {
      setTimeout (() => {
        window.scrollTo(0, 0);
      });
    }
  }

  loadArticle(item: any): void {
    this.apiService.getNode(item.id).subscribe( result => {
      result[0].link = item.link;
      result[0].link_es = item.link_es;
      this.viewArticle(result[0]);
    });
  }

  viewArticle(item: any): void {
    let width = '95vw';
    let height = '80vh';
    if (this.isBrowser) {
      if (this.media.isMatched('(min-width: 960px)') && item.node_export.field_type[0].target_id !== '6') {
        width = '900px';
        height = '95vh';
      }
    }
    const dialogRef = this.dialog.open(ContentListDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: { node: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scroll();
      }
    });
  }

}

@Component({
  selector: 'app-content-list-dialog',
  templateUrl: './content-list.dialog.html',
})
export class ContentListDialogComponent {
  public node = [];
  public variables: any;

  constructor(
    public dialogRef: MatDialogRef<ContentListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variableService: VariableService
  ) {
    this.variables = this.variableService;
    this.node = [data.node];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  viewClick() {
    this.dialogRef.close(true);
  }

}