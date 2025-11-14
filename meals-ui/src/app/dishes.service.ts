import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom, Observable } from 'rxjs'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DishesService {

  constructor(private http: HttpClient) { }

  dishes: any[] = []

  getAllDishes(): Observable<any> {
    return new Observable(observer => {
      if (this.dishes.length != 0) {
        console.log("============================ Returning dishes from memory")
        observer.next(this.dishes)
        return
      }

      console.log("============================ Returning dishes from calling API")
      this.http.get<any>(environment.urlPrefix + 'api/dishes').subscribe({
        next: (res: any) => {
          this.dishes = res
          return observer.next(this.dishes)
        },
        error: (error: any) => {
          return observer.error(error)
        }
      })
    })
  }
}
