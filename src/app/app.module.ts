import { BrowserModule, BrowserTransferStateModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { environment } from './../environments/environment';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Angulartics2Module } from 'angulartics2';
import { MetaModule } from '@ngx-meta/core';
import { PrebootModule } from 'preboot';

import { AppComponent } from './app.component';
import { MaterialModule } from './modules/app.material.module';
import { AppRoutingModule } from './modules/app.routing.module';
import { ApiService } from './services/api.service';
import { VariableService } from './services/variable.service';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './core/menu/menu.component';
import { TriageInputComponent } from './triage/triage-input/triage-input.component';
import { ApiRouterComponent } from './api-router/api-router.component';
import { FooterComponent } from './core/footer/footer.component';
import { HighlightDirective } from './directives/highlight.directive';
import { SearchBarComponent } from './core/search-bar/search-bar.component';
import { LangSelectComponent } from './core/lang-select/lang-select.component';
import { TriageLandingComponent } from './triage/triage-landing/triage-landing.component';
import { NodeComponent } from './core/node/node.component';
import { SafeHtmlPipe } from './directives/safe-html.pipe';
import { SideMenuComponent } from './core/side-menu/side-menu.component';
import { TriageResultsComponent } from './triage/triage-results/triage-results.component';
import { TriageSummaryComponent } from './triage/triage-summary/triage-summary.component';
import { BlockComponent } from './core/block/block.component';
import { SelfHelpLandingComponent } from './blocks/self-help-landing/self-help-landing.component';
import { SelfHelpComponent } from './self-help/self-help.component';
import { PopularArticlesComponent } from './blocks/popular-articles/popular-articles.component';
import { FooterMenuComponent } from './core/footer-menu/footer-menu.component';
import { SelfHelpMenuComponent } from './blocks/self-help-menu/self-help-menu.component';
import { FeaturedSliderModule } from './blocks/featured-slider/featured-slider.module';
import { SelfHelpContentComponent } from './blocks/self-help-content/self-help-content.component';
import { SegmentsComponent } from './core/segments/segments.component';
import { SearchComponent } from './search/search.component';
import { TriageLocationComponent } from './triage/triage-location/triage-location.component';
import { TriageDialogComponent } from './triage/triage-dialog/triage-dialog.component';
import { ArticleCreditComponent } from './blocks/article-credit/article-credit.component';
import { ShareComponent, ShareDialogComponent } from './core/share/share.component';
import { TriageSaveComponent, TriageSaveDialogComponent } from './triage/triage-save/triage-save.component';
import { TriageLoadComponent } from './triage/triage-load/triage-load.component';
import { MinRouterComponent } from './min-router/min-router.component';
import { PdfDownloadComponent, PdfDownloadDialogComponent } from './core/pdf-download/pdf-download.component';
import { LoaderComponent } from './core/loader/loader.component';
import { ContentListComponent, ContentListDialogComponent } from './core/content-list/content-list.component';
import { SegmentDisplayComponent } from './core/segment-display/segment-display.component';
import { IconComponent } from './core/icon/icon.component';
import { LabelComponent } from './core/label/label.component';
import { LabelEditorComponent } from './core/label-editor/label-editor.component';
import { NodeTopComponent } from './core/node-top/node-top.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    TriageInputComponent,
    ApiRouterComponent,
    FooterComponent,
    HighlightDirective,
    SearchBarComponent,
    LangSelectComponent,
    TriageLandingComponent,
    NodeComponent,
    SafeHtmlPipe,
    SideMenuComponent,
    TriageResultsComponent,
    TriageSummaryComponent,
    BlockComponent,
    SelfHelpLandingComponent,
    SelfHelpComponent,
    PopularArticlesComponent,
    FooterMenuComponent,
    SelfHelpMenuComponent,
    SelfHelpContentComponent,
    SegmentsComponent,
    SearchComponent,
    TriageLocationComponent,
    TriageDialogComponent,
    ArticleCreditComponent,
    ShareComponent,
    ShareDialogComponent,
    TriageSaveComponent,
    TriageSaveDialogComponent,
    TriageLoadComponent,
    MinRouterComponent,
    LoaderComponent,
    PdfDownloadComponent,
    PdfDownloadDialogComponent,
    ContentListComponent,
    ContentListDialogComponent,
    SegmentDisplayComponent,
    IconComponent,
    LabelComponent,
    LabelEditorComponent,
    NodeTopComponent,
  ],
  entryComponents: [
    TriageDialogComponent,
    ShareDialogComponent,
    TriageSaveDialogComponent,
    PdfDownloadDialogComponent,
    ContentListDialogComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: environment.appId}),
    PrebootModule.withConfig({ appRoot: 'app-root', buffer: false }),
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    HttpClientXsrfModule,
    AppRoutingModule,
    AsyncLocalStorageModule,
    FeaturedSliderModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics], {
      pageTracking: {
        autoTrackVirtualPages: false
      }
    }),
    MetaModule.forRoot(),
    BrowserTransferStateModule,
  ],
  providers: [
    ApiService,
    VariableService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
