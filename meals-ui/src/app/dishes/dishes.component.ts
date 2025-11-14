import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DishesService } from '../dishes.service';
import { environment } from '../../environments/environment';

declare var $: any

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './dishes.component.html',
  styleUrl: './dishes.component.css'
})
export class DishesComponent implements OnInit {

  dishes: any = {}
  dishesEdited: any = {}

  editing = false

  constructor(private route: ActivatedRoute, private http: HttpClient, public dishesService: DishesService, private notifierService: NotificationsService) {
  }
  
  ngOnInit() {
    this.route.params.subscribe(val => {
      this.editing = false

       this.dishesService.getAllDishes().subscribe({
        next: (res: any) => {
          this.dishes = this.dishesService.dishes.filter(d => d['id'] == val['id'])[0]
        },
        error: (error: any) => {
          console.log(error)
        }
      })

      
    })
  }

  editDishes() {
    this.dishesEdited = structuredClone(this.dishes)
    this.editing = true
  }

  cancelEditingDishes() {
    this.editing = false
  }

  addDish(c: any, i: number) {
    let dish = $(`#new-dish-${i}`).val().trim()

    if (dish == '') {
      this.notifierService.error('菜名不能为空')
      return
    } else if (c['dishes'].includes(dish)) {
      this.notifierService.error('菜名不能重复')
      return
    }

    c['dishes'].push(dish)
    $(`#new-dish-${i}`).val('')
  }

  deleteDish(c: any, i: number) {
    c['dishes'].splice(i, 1)
  }

  saveDishes() {
    this.http.put<any>(environment.urlPrefix + 'api/dishes/' + this.dishesEdited.id, this.dishesEdited).subscribe({
      next: (res: any) => {
        this.dishes = this.dishesEdited
        for (const d of this.dishesService.dishes) {
          if (d['id'] == this.dishes.id) {
            d['categories'] = this.dishes.categories
            break
          }
        }

        this.editing = false
      },
      error: (error: any) => {
        this.notifierService.error('Unknown error, please try again later.')
      }
    })
  }

  trackByFn(index: any, item: any) {
    return index
  }

}
