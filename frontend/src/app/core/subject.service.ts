import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Subject {
  id: string;
  name: string;
  description?: string | null;
}

/**
 * Talks to the /subjects API. The auth interceptor adds the token
 * automatically, so we just make the request.
 */
@Injectable({ providedIn: 'root' })
export class SubjectService {
  constructor(private readonly http: HttpClient) {}

  list(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${environment.apiUrl}/subjects`);
  }

  create(name: string, description?: string): Observable<Subject> {
    return this.http.post<Subject>(`${environment.apiUrl}/subjects`, {
      name,
      description,
    });
  }
}
