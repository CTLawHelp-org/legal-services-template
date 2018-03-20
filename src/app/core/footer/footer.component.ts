import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { VariableService } from '../../services/variable.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {
  public variables: any;

  constructor(
    private apiService: ApiService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private variableService: VariableService
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
  }

}
