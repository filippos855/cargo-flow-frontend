import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-layout',
    imports: [RouterModule],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  collapsed = true;
  resourcesExpanded = false;

  toggleResources(): void {
    this.resourcesExpanded = !this.resourcesExpanded;
  }
}
