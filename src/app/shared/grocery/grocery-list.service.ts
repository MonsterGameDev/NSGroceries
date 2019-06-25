import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Config } from './../config';
import { Grocery } from './grocery';

@Injectable()
export class GroceryListService {
  private baseUrl = Config.apiUrl + 'appdata/' + Config.appKey + '/Groceries';

  constructor(private http: HttpClient) {}

  public load(): Observable<Grocery[]> {
    return this.http
      .get(this.baseUrl, {
        headers: this.getCommonHeaders()
      })
      .pipe(
        map((data: any[]) => {

          const groceryList: Grocery[] = data
            .sort((a, b) => {
              return a._kmd.lmt > b._kmd.lmt? -1 : 1
            })
            .map(
                g => new Grocery(g._id, g.Name)
            );
          return groceryList;
        }),
        catchError(err => this.errorHandler(err))
      );
  }

  public delete(item: Grocery) {
    return this.http.delete(
      this.baseUrl + '/' + item.id,
      {headers: this.getCommonHeaders()}
    )
    .pipe(
      map((data: any )=> data),
      catchError(err => this.errorHandler(err))
    );
  }

  public add(name: string) {
      return this.http.post(
          this.baseUrl,
          JSON.stringify({Name: name}),
          {headers: this.getCommonHeaders()}
      )
      .pipe(
          map((data: any) => {
              return new Grocery(data._id, name)
          }),
          catchError(
              err => this.errorHandler(err)
          )
      )
  }

  private getCommonHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Kinvey ' + Config.token
    });
  }

  private errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }
}
