import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent {
  company!: Company;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private companyService: CompanyService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.companyService.getCompanyById(id);
    if (found) {
      this.company = { ...found };
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.companyService.updateCompany(this.company);
    this.isEditing = false;
    alert('Firma a fost salvată.');
  }

  goBack(): void {
    this.location.back();
  }
}
