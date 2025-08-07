import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { SimpleNotificationsModule } from 'angular2-notifications'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SimpleNotificationsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

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

  currentTab = 'planner'
  
  constructor(private router: Router){}

  ngOnInit() {
  }

  goToTab(tabName: string) {
    this.currentTab = tabName

    if (this.currentTab == 'planner') {
      this.router.navigate(['/'])
    } else {
      this.router.navigate(['/meals/' + this.currentTab])
    }
  }

}
