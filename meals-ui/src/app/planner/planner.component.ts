import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NotificationsService } from 'angular2-notifications'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { environment } from '../../environments/environment'
import { HttpClient, HttpParams } from '@angular/common/http'
import { DishesService } from '../dishes.service'

declare var $: any

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.css'
})
export class PlannerComponent implements OnInit {

  today = new Date()
  todayCol = -1

  weekRangeLabel = ''

  week : Date[] = []
  weekLabel = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  monthLabel = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  
  dayLabel = ''
  day = new Date(this.today)

  dishType:any = {}
  dishTypeFiltered:any = {}
  mealLabel = ''
  dishKeyword = ''
  mealPlans:any = {}

  dishesSelected:any = []
  dateSelected = new Date()
  mealSelected = ''


  constructor(public dishesService: DishesService, private http: HttpClient, private notifierService: NotificationsService) {
  }

  ngOnInit() {
    this.displayCurrentWeek()
  }

  displayCurrentWeek() {
    let start = new Date(this.today)
    start.setDate(this.today.getDate() - this.today.getDay())
    this.displayWeekStartingWith(start)
  }

  displayWeekStartingWith(start: Date) {
    this.week = []
    this.todayCol = -1

    for (let i = 0; i < 7; i ++) {
      let d = new Date(start)
      d.setDate(start.getDate() + i)
      this.week.push(d)

      if (d.getTime() == this.today.getTime()) this.todayCol = i
      if (d.getTime() == this.day.getTime()) {
        this.dayLabel = `${this.monthLabel[this.day.getMonth()]} ${this.day.getDate()}, ${this.day.getFullYear()}`
      }

    }

    this.weekRangeLabel = `${this.monthLabel[this.week[0].getMonth()]} ${this.week[0].getDate()} - ${this.monthLabel[this.week[6].getMonth()]} ${this.week[6].getDate()}, ${this.week[6].getFullYear()}`

    let params = new HttpParams().set('dates', encodeURIComponent(this.week.map(d => this.getDate(d)).join(',')))
    this.http.get<any>(environment.urlPrefix + 'api/meal-plans', {params: params}).subscribe({
      next: (res: any) => {
        this.mealPlans = res
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  displayPreviousWeek() {
    let start = new Date(this.week[0])
    start.setDate(start.getDate() - 7)
    this.displayWeekStartingWith(start)
  }

  displayNextWeek() {
    let start = new Date(this.week[0])
    start.setDate(start.getDate() + 7)
    this.displayWeekStartingWith(start)
  }

  displayCurrentDay() {
    this.displayCurrentWeek()
    this.day = new Date(this.today)
  }
  
  displayPreviousDay() {
    this.day.setDate(this.day.getDate() - 1)
    if (this.day.getTime() < this.week[0].getTime()) this.displayPreviousWeek()
  }

  displayNextDay() {
    this.day.setDate(this.day.getDate() + 1)
    if (this.day.getTime() > this.week[6].getTime()) this.displayNextWeek()
  }

  selectDishType(dishType: any) {
    this.dishType = dishType
    this.dishTypeFiltered = structuredClone(dishType)
  }

  editMeal(date: Date, meal: string) {
    this.mealLabel = `${date.getFullYear()} ${this.monthLabel[date.getMonth()]} ${date.getDate()} / ${this.weekLabel[date.getDay()]} / ` + 
      (meal == 'breakfast' ? '早餐' : meal == 'lunch' ? '午餐' : meal == 'dinner' ? '晚餐' : '加餐')
    this.dishType = this.dishesService.dishes[0]
    this.dishTypeFiltered = structuredClone(this.dishesService.dishes[0])
    this.dishKeyword = ''

    this.dateSelected = date
    this.mealSelected = meal
    this.dishesSelected = structuredClone(this.getDishes(date, meal)) ?? []

    $("#mealModal").modal('show')
  }

  getDishes(date: Date, meal: string) {
    let day = this.mealPlans[this.getDate(date) as keyof typeof this.mealPlans]
    if (day == null) {
      return null
    }

    return day[meal]
  }

  getDate(date: Date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  searchDishes() {
    let filtered = structuredClone(this.dishType)
    for (let c of filtered['categories']) {
      c['meals'] = c['meals'].filter((m:string) => m.includes(this.dishKeyword))
    }
    this.dishTypeFiltered = filtered
  }

  selectDish(dish: string) {
    if (this.dishesSelected.includes(dish)) {
      this.dishesSelected = this.dishesSelected.filter((d: string) => d != dish)
    } else {
      this.dishesSelected.push(dish)
    }
  }

  updateMeal() {
    let day = this.mealPlans[this.getDate(this.dateSelected) as keyof typeof this.mealPlans]

    if (day == null) {
      day = {}
      this.mealPlans[this.getDate(this.dateSelected) as keyof typeof this.mealPlans] = day
    }

    day[this.mealSelected] = this.dishesSelected

    this.http.put<any>(environment.urlPrefix + 'api/meal-plans/' + encodeURIComponent(this.getDate(this.dateSelected)), day).subscribe({
      next: (res: any) => {
      },
      error: (error: any) => {
        this.notifierService.error('Unknown error, please try again later.')
      }
    })
  }

}
