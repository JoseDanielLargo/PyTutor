import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SubjectService, Subject } from '../../core/subject.service';

/**
 * The main page after logging in. It shows who you are and lists your subjects
 * (fetched from the API using your token). It also lets you add a subject, so
 * you can see the full create -> list round trip in the browser.
 */
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly subjects = signal<Subject[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  newSubjectName = '';

  constructor(
    readonly auth: AuthService,
    private readonly subjectService: SubjectService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading.set(true);
    this.subjectService.list().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load subjects.');
        this.loading.set(false);
      },
    });
  }

  addSubject(): void {
    const name = this.newSubjectName.trim();
    if (!name) return;
    this.subjectService.create(name).subscribe({
      next: (subject) => {
        this.subjects.update((list) => [...list, subject]);
        this.newSubjectName = '';
      },
      error: () => this.error.set('Could not add subject.'),
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
