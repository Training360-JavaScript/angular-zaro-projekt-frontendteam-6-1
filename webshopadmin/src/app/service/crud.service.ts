import { Inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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

  protected inputTransform?(target: T): T;
  protected outputTransform?(target: T): T;

  getAll(): Observable<T[]> {
    if (this.inputTransform)
      return this.http.get<T[]>(`${this.apiUrl}${this.endPoint}`)
        .pipe(map(list => list.map(e => this.inputTransform!(e))))
    else
      return this.http.get<T[]>(`${this.apiUrl}${this.endPoint}`);
  }

  get(id: number): Observable<T> {
    if (this.inputTransform)
    return this.http.get<T>(`${this.apiUrl}${this.endPoint}/${id}`)
      .pipe(map( e => this.inputTransform!(e)));
    else
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
    const filteredTarget = this.outputTransform ? this.outputTransform(target) : target;
    filteredTarget.id = 0;
    const retVal = this.http.post<T>(
      `${this.apiUrl}${this.endPoint}`,
      filteredTarget,
    );
    if (this.inputTransform)
      return retVal.pipe(map(e => this.inputTransform!(e)));
    else
      return retVal;
  }

  update(target: T): Observable<T> {
    const filteredTarget = this.outputTransform ? this.outputTransform(target) : target;
    const retVal = this.http.patch<T>(
      `${this.apiUrl}${this.endPoint}/${filteredTarget.id}`,
      filteredTarget,
    );
    if (this.inputTransform)
      return retVal.pipe(map(e => this.inputTransform!(e)));
    else
      return retVal;
  }
}

