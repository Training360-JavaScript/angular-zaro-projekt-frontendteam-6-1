import { Inject, Injectable, Pipe } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { asyncScheduler, map, Observable, OperatorFunction, timer, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

declare const window: any;

const timer$: Array<Subscription | boolean> = [];
const spinnerDiv = window.document.querySelector('.spinner');

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

  hideDiv(index: number): OperatorFunction<T[],T[]> {
    return map( (list:T[]): T[] => {
      console.log('töröl',index);
      (timer$[index] as Subscription).unsubscribe();
      console.log(timer$);
      // delete timer$[index];
      timer$[index] = false;
      console.log(timer$);
      // ha nincs már aktív letöltés
      if ( ! timer$.some( (x) => x ) )
        spinnerDiv.style.display = 'none';
      return list;
    });
  }

  getNewTimer() {
    timer$.push( timer(10).subscribe( () => {
      spinnerDiv.style.display = 'flex';
    }));
    const index = timer$.length-1;
    const unsubAndHide = this.hideDiv(index)
    console.log('add',index,`${this.apiUrl}${this.endPoint}`);
    console.log(timer$);
    return { unsubAndHide };
  }

  getAll(): Observable<T[]> {

    const { unsubAndHide } = this.getNewTimer();

    return this.http.get<T[]>(`${this.apiUrl}${this.endPoint}`)
      .pipe(
        unsubAndHide,
        this.inputTransform ? map( list => list.map( this.inputTransform! ) ) : map( list => list )
      );
  }

  getAllFiltered(filterFunc: (value: T, index: number, array: T[]) => unknown, thisArg?: any) : Observable<T[]> {
    return this.getAll().pipe(map(list => list.filter(filterFunc)))
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

