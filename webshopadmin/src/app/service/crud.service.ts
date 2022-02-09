import { Inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export abstract class CrudService<T extends {id: number} > {

  constructor(
    protected http: HttpClient,
    @Inject(String) protected endPoint: string,
    @Inject(String) protected apiUrl: string = environment.apiUrl,
  ) { }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}${this.endPoint}`);
  }

  get(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${this.endPoint}/${id}`);
  }

  delete(id: number): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${this.endPoint}/${id}`);
  }

  createOrUpdate(target: T) {
    if (target.id)
      this.update(target);
    else
      this.create(target);
  }

  create(target: T): Observable<T> {
    target.id = 0;
    return this.http.post<T>(
      `${this.apiUrl}${this.endPoint}`,
      target,
    );
  }

  update(target: T): Observable<T> {
    return this.http.patch<T>(
      `${this.apiUrl}${this.endPoint}/${target.id}`,
      target,
    );
  }
}

