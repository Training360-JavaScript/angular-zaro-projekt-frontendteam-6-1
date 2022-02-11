import { Inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { asapScheduler, asyncScheduler, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CrudService<T extends {id: number} > {

  constructor(
    protected http: HttpClient,
    @Inject(String) protected endPoint: string,
    @Inject(String) protected apiUrl: string = environment.apiUrl,
  ) { }

  protected inputTransform?(target: T): T;
  protected outputTransform?(target: T): T;
  protected createInstanceOfT?(): T;

  getAll(): Observable<T[]> {
    if (this.inputTransform)
      return this.http.get<T[]>(`${this.apiUrl}${this.endPoint}`)
        .pipe(map(list => list.map(e => this.inputTransform!(e))))
    else
      return this.http.get<T[]>(`${this.apiUrl}${this.endPoint}`);
  }

  getOrNew(id: number): Observable<T> {
    if ( ( !id || !parseInt(String(id)) ) && this.createInstanceOfT)
      return new Observable<T>(subscriber =>
          asyncScheduler.schedule(() =>
          subscriber.next(this.createInstanceOfT!())));
    else
      return this.get(id);
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

  createOrUpdate(target: T): Observable<T> {
    if (target.id)
      return this.update(target);
    else
      return this.create(target);
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

