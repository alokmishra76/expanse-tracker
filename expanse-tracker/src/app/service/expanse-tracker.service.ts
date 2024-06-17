import { Injectable } from '@angular/core';
import { Expanse } from '../model/expanse.model';

@Injectable({
  providedIn: 'root'
})
export class ExpanseTrackerService {
  expanseList: Expanse[] = [];

  constructor() { }

  public getAllExpanse() {
    return localStorage.getItem('expanseList');
  }

  public addNewExpanse(expanseDetails: Expanse[]) {
    localStorage.setItem('expanseList', JSON.stringify(expanseDetails));
  }

  public deleteExpanse(filterList: Expanse[]) {
    localStorage.setItem('expanseList', JSON.stringify(filterList));
  }

  public updateExpanse(expanseDetails: Expanse[]) {
    localStorage.setItem('expanseList', JSON.stringify(expanseDetails));
  }
}
