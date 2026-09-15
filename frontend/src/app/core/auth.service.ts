import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

/** Shape of the logged-in user the API returns. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'TUTOR' | 'ADMIN';
}

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

const TOKEN_KEY = 'pytutor_token';
const USER_KEY = 'pytutor_user';

/**
 * AuthService is the frontend's gateway to authentication.
 *
 * - login() calls the API, then saves the token + user in localStorage so the
 *   session survives a page refresh.
 * - The token is what the interceptor attaches to every future request.
 * - We expose the current user as a signal so components update reactively.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  // A "signal" is Angular's reactive value: when it changes, the UI updates.
  private readonly userSignal = signal<AuthUser | null>(this.loadUser());
  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userSignal() !== null);

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.accessToken);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          this.userSignal.set(res.user);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }
}
