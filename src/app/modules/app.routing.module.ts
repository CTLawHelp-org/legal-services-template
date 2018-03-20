import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApiRouterComponent } from '../api-router/api-router.component';
import { MinRouterComponent } from '../min-router/min-router.component';
import { SearchComponent } from '../search/search.component';
import { TriageLandingComponent } from '../triage/triage-landing/triage-landing.component';
import { SelfHelpComponent } from '../self-help/self-help.component';
import { TriageLoadComponent } from '../triage/triage-load/triage-load.component';
import { TriageResultsComponent } from '../triage/triage-results/triage-results.component';
import { HomeComponent } from '../home/home.component';

const appRoutes: Routes = [
  {
    path: 'en',
    data: { message: 'en' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'legal-help', component: TriageLandingComponent },
      { path: 'legal-help/view/:id', component: TriageLandingComponent },
      { path: 'legal-help/results', component: TriageResultsComponent },
      { path: 'legal-help/results/:id', component: TriageResultsComponent },
      { path: 'saved/legal-help/:status/:id', component: TriageLoadComponent },
      { path: 'get-help', redirectTo: '/en/legal-help', pathMatch: 'full' },
      { path: 'self-help', component: ApiRouterComponent },
      { path: 'self-help/:id', component: SelfHelpComponent },
      { path: 'self-help-guides/elder-law', redirectTo: '/en/self-help/537', pathMatch: 'full' },
      { path: 'node/:id', component: ApiRouterComponent },
      { path: 'min/view/:id', component: MinRouterComponent },
      { path: 'search', component: SearchComponent },
      { path: 'search/:id', component: SearchComponent },
      { path: '**', component: ApiRouterComponent }
    ]
  },
  {
    path: 'es',
    data: { message: 'es' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'legal-help', component: TriageLandingComponent },
      { path: 'legal-help/view/:id', component: TriageLandingComponent },
      { path: 'legal-help/results', component: TriageResultsComponent },
      { path: 'legal-help/results/:id', component: TriageResultsComponent },
      { path: 'saved/legal-help/:status/:id', component: TriageLoadComponent },
      { path: 'get-help', redirectTo: '/es/legal-help', pathMatch: 'full' },
      { path: 'self-help', component: ApiRouterComponent },
      { path: 'self-help/:id', component: SelfHelpComponent },
      { path: 'self-help-guides/elder-law', redirectTo: '/es/self-help/537', pathMatch: 'full' },
      { path: 'node/:id', component: ApiRouterComponent },
      { path: 'min/view/:id', component: MinRouterComponent },
      { path: 'search', component: SearchComponent },
      { path: 'search/:id', component: SearchComponent },
      { path: '**', component: ApiRouterComponent }
    ]
  },
  { path: 'admin', loadChildren: 'app/admin/admin-router/admin-router.module#AdminRouterModule' },
  { path: '', redirectTo: '/en/home', pathMatch: 'full' },
  { path: 'node/:id', redirectTo: '/en/node/:id', pathMatch: 'full' },
  { path: 'min/view/:id', redirectTo: '/en/min/view/:id', pathMatch: 'full' },
  { path: 'search', redirectTo: '/en/search', pathMatch: 'full' },
  { path: 'search/:id', redirectTo: '/en/search/:id', pathMatch: 'full' },
  { path: 'self-help/:id', redirectTo: '/en/self-help/:id', pathMatch: 'full' },
  { path: 'self-help-guides/elder-law', redirectTo: '/en/self-help/537', pathMatch: 'full' },
  { path: 'legal-help/view/:id', redirectTo: '/en/legal-help/view/:id', pathMatch: 'full' },
  { path: 'legal-help/results/:id', redirectTo: '/en/legal-help/results/:id', pathMatch: 'full' },
  { path: 'get-help', redirectTo: '/en/legal-help', pathMatch: 'full' },
  { path: '**', component: ApiRouterComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false, initialNavigation: 'enabled' }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
