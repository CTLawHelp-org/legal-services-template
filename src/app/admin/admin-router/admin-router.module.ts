import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../modules/app.material.module';
import { CommonModule } from '@angular/common';
import { AdminDashComponent } from '../admin-dash/admin-dash.component';
import { AdminRouterRouting } from './admin-router.routing';
import { AdminLabelsComponent } from '../admin-labels/admin-labels.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { AdminBlocksComponent } from '../admin-content-lists/admin-blocks/admin-blocks.component';
import { TitleRenderComponent } from '../admin-utils/title-render/title-render.component';
import { AdminContentComponent } from '../admin-content/admin-content.component';
import { DynamicFormsPrimeNGUIModule } from '@ng-dynamic-forms/ui-primeng';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { AdminNodeBlockComponent } from '../admin-node/admin-node-block/admin-node-block.component';
import { AdminLoaderComponent } from '../admin-loader/admin-loader.component';
import { DndModule } from 'ng2-dnd';
import { AdminFormNodeRefComponent } from '../admin-node/admin-form-node-ref/admin-form-node-ref.component';
import {
  AdminNodePickerComponent,
  AdminNodePickerDialogComponent
} from '../admin-content-lists/admin-node-picker/admin-node-picker.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsPrimeNGUIModule,
    AdminRouterRouting,
    AgGridModule.withComponents([TitleRenderComponent]),
    DndModule.forRoot(),
  ],
  declarations: [
    AdminDashComponent,
    AdminLabelsComponent,
    AdminBlocksComponent,
    TitleRenderComponent,
    AdminContentComponent,
    AdminNodeBlockComponent,
    AdminLoaderComponent,
    AdminFormNodeRefComponent,
    AdminNodePickerComponent,
    AdminNodePickerDialogComponent,
  ],
  entryComponents: [
    AdminNodePickerDialogComponent,
  ]
})
export class AdminRouterModule {}
