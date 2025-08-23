import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { NotificationsService, SimpleNotificationsModule } from 'angular2-notifications'
import { DishesService } from './dishes.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SimpleNotificationsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  meals = []

  currentTab = 'planner'
  
  constructor(private mealsService: DishesService, private router: Router, private notifierService: NotificationsService){}

  ngOnInit() {
    this.mealsService.getAllDishes().subscribe({
      next: (res: any) => {
        this.meals = res
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  goToTab(tabName: any) {
    this.currentTab = tabName

    if (this.currentTab == 'planner') {
      this.router.navigate(['/'])
    } else {
      this.router.navigate(['/dishes/' + this.currentTab])
    }
  }

}
