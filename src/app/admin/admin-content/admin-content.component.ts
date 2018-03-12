import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminContentComponent implements OnInit {
  public working = true;
  public variables: any;
  public id: any;
  public node = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.load();
  }

  load() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== '' && this.isNumeric(this.id)) {
      this.apiService.getNodeAdmin(this.id).subscribe( data => {
        this.node = data;
        this.working = false;
      });
    } else {
      // new
    }
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
  }

}
