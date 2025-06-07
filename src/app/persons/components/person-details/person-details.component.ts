import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent {
  person!: Person;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private personService: PersonService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.personService.getPersonById(id);
    if (found) {
      this.person = { ...found };
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.personService.updatePerson(this.person);
    this.isEditing = false;
    alert('Persoana a fost salvată.');
  }

  goBack(): void {
    this.location.back();
  }
}
