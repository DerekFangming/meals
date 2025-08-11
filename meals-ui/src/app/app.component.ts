import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { NotificationsService, SimpleNotificationsModule } from 'angular2-notifications'
import { MealsService } from './meals.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SimpleNotificationsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // categories = [{
  //   label: '月子餐1',
  //   name: 'postpartum'
  // },{
  //   label: '健康饮食2',
  //   name: 'healthy'
  // },{
  //   label: '大鱼大肉3',
  //   name: 'meaty'
  // }]
  
  meals = []

  currentTab = 'planner'
  
  constructor(private mealsService: MealsService, private router: Router, private notifierService: NotificationsService){}

  ngOnInit() {
    this.mealsService.getAllMeals().subscribe({
      next: (res: any) => {
        this.meals = res
      },
      error: (error: any) => {
        this.notifierService.error('Unknown error, please try again later.')
      }
    })
  }

  goToTab(tabName: any) {
    this.currentTab = tabName

    if (this.currentTab == 'planner') {
      this.router.navigate(['/'])
    } else {
      this.router.navigate(['/meals/' + this.currentTab])
    }
  }

}
