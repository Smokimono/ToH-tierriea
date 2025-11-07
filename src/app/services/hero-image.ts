import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeroImageService {
  private baseUrl = 'http://localhost:3001';
  constructor(private http: HttpClient) {}

  uploadHeroImage(heroId: string, file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ photoURL: string }>(`${this.baseUrl}/api/heroes/${heroId}/photo`, form)
      .pipe(map(r => r.photoURL));
  }

  deleteHeroImage(heroId: string, url: string) : Observable<void> {
    const u = encodeURIComponent(url);
    return this.http.delete<void>(`${this.baseUrl}/api/heroes/${heroId}/photo?url=${u}`);
  }
}
