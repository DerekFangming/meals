import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  constructor(private http: HttpClient) { }

  categories = [{
    label: '月子餐',
    name: 'postpartum'
  },{
    label: '健康饮食',
    name: 'healthy'
  },{
    label: '大鱼大肉',
    name: 'meaty'
  }]

  // getMealCategories() {
  //   return [{
  //   label: '月子餐',
  //   name: 'postpartum'
  // },{
  //   label: '健康饮食',
  //   name: 'healthy'
  // },{
  //   label: '大鱼大肉',
  //   name: 'meaty'
  // }]
  // }

  getAllMeals() {
    return {
      postpartum: [{ name: '馒头' }, { name: '包子' }, { name: '小米粥' }]
    }
  }
}
