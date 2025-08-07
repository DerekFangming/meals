import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  constructor(private http: HttpClient) { }

  getAllMeals() {
    return {
      postpartum: [{ name: '馒头' }, { name: '包子' }, { name: '小米粥' }]
    }
  }
}
