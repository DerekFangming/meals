import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  constructor(private http: HttpClient) { }

  // categories = [{
  //   label: '月子餐 delete',
  //   name: 'postpartum'
  // },{
  //   label: '健康饮食 delete',
  //   name: 'healthy'
  // },{
  //   label: '大鱼大肉 delete',
  //   name: 'meaty'
  // }]

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

  meals = []

  getAllMeals(): Observable<any> {

    // if (this.meals != null) {
    //   console.log('Reading cache')
    //   return new Observable(observer => {
    //     observer.complet(this.meals)
    //   })
    // }

    // console.log('Reading source')

    // // let res = await firstValueFrom(this.http.get<any>(environment.urlPrefix + 'api/meals'))

    // let ob = new Observable<any>()

    // this.http.get<any>(environment.urlPrefix + 'api/meals').subscribe({
    //   next: (res: any) => {
    //     this.meals = res
    //     return new Observable(observer => observer.next(this.meals))
    //   },
    //   error: (error: any) => {
    //     return new Observable(error => error)
    //   }
    // })

    return new Observable(observer => {
      if (this.meals.length != 0) {
        console.log('Reading cache')
        observer.next(this.meals)
        return
      }

      console.log('Reading source')
      this.http.get<any>(environment.urlPrefix + 'api/meals').subscribe({
        next: (res: any) => {
          this.meals = res
          return observer.next(this.meals)
        },
        error: (error: any) => {
          return observer.error(error)
        }
      })
    })
  }
}
