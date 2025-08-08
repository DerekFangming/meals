import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NotificationsService } from 'angular2-notifications'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { environment } from '../../environments/environment'
import { HttpClient, HttpParams } from '@angular/common/http'
import { MealsService } from '../meals.service'

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

  mealLabel = ''
  mealCategory = {name: '', label: ''}
  mealPlans = {}

  constructor(public mealsService: MealsService, private http: HttpClient, private notifierService: NotificationsService) {
  }

  ngOnInit() {
    this.displayCurrentWeek()
    console.log(this.mealsService.getAllMeals())
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
      let day = new Date(start)
      day.setDate(start.getDate() + i)
      this.week.push(day)

      if (day.getTime() == this.today.getTime()) this.todayCol = i
    }

    this.weekRangeLabel = `${this.monthLabel[this.week[0].getMonth()]} ${this.week[0].getDate()} - ${this.monthLabel[this.week[6].getMonth()]} ${this.week[6].getDate()}, ${this.week[6].getFullYear()}`

    let params = new HttpParams().set('dates', this.week.map(d => this.getDate(d)).join(','))
    this.http.get<any>(environment.urlPrefix + 'api/meal-plans', {params: params}).subscribe({
      next: (res: any) => {
        this.mealPlans = res
      },
      error: (error: any) => {
        this.notifierService.error('Unknown error, please try again later.')
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

  selectMealCategory(category: any) {
    this.mealCategory = category
  }

  editMeal(date: Date, meal: string) {
    console.log(date + ' - ' + meal)
    
    this.mealLabel = `${date.getFullYear()} ${this.monthLabel[date.getMonth()]} ${date.getDate()} / ${this.weekLabel[date.getDay()]} / ` + 
      (meal == 'breakfast' ? '早餐' : meal == 'lunch' ? '午餐' : meal == 'dinner' ? '晚餐' : '加餐')
    this.mealCategory = this.mealsService.categories[0]


    $("#mealModal").modal('show')
  }

  getMeals(date: Date, meal: string) {
    // let d = 
    // console.log(d)
    // console.log(this.mealPlans)

    let day = this.mealPlans[this.getDate(date) as keyof typeof this.mealPlans]
    if (day == null) {
      return null
    }

    // if (day[meal]) {
    //   // if (checkExists) return true
      
    //   return day[meal]
    // }

    return day[meal]

    // return date.getFullYear() == d.getFullYear() && date.getMonth() == d.getMonth() && date.getDate() == d.getDate()
  }

  getDate(date: Date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }


    // this.http.get<any>(environment.urlPrefix + 'testJson').subscribe({
    //   next: (res: any) => {
    //     console.log(res)
    //   },
    //   error: (error: any) => {
    //     console.log(error)
    //   }
    // })
  // keyPressed(key: string) {
  //   this.code += key
  // }

  // deletePressed() {
  //   this.code = this.code.slice(0, -1);
  // }

  // sendPressed() {
  //   if (this.code == '') {
  //     this.notifierService.error('Code is empty')
  //     return
  //   }

  //   this.http.post<any>(environment.urlPrefix + 'api/send-code', {code: this.code}).subscribe({
  //     next: (res: any) => {
  //       this.notifierService.success('Code is sent')
  //       this.code = ''
  //     },
  //     error: (error: any) => {
  //       if (error.status == 429) {
  //         this.notifierService.error('Too many requests, please try again later.')
  //       } else {
  //         this.notifierService.error('Unknown error, please try again later.')
  //       }
  //     }
  //   })

  // }

}
