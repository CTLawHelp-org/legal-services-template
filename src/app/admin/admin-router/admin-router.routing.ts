import { NgModule } from '@angular/core';
import { AdminDashComponent } from '../admin-dash/admin-dash.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminLabelsComponent } from '../admin-labels/admin-labels.component';
import { AdminBlocksComponent } from '../admin-content-lists/admin-blocks/admin-blocks.component';
import { AdminContentComponent } from '../admin-content/admin-content.component';
import { VariableService } from '../../services/variable.service';
import { CanActivateGuard } from '../../services/app.activate-guard.service';

const routes: Routes = [
  { path: '', component: AdminDashComponent, children: [
      { path: 'labels', component: AdminLabelsComponent },
      { path: 'blocks', component: AdminBlocksComponent },
      { path: 'content/:id', component: AdminContentComponent },
    ], canActivate: [CanActivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CanActivateGuard,
    VariableService
  ],
})
export class AdminRouterRouting {}
