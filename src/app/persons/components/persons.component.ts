import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PersonService } from '../services/person.service';
import { Person } from '../models/person.model';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {
  persons: Person[] = [];

  constructor(
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.persons = this.personService.getPersons();
  }

  viewPerson(person: Person): void {
    this.router.navigate(['/resources/persons', person.id]);
  }

  addPerson(): void {
    alert('Funcționalitatea de adăugare persoană va fi implementată.');
  }
}
