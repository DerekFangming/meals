import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NotificationsService } from 'angular2-notifications'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.css'
})
export class PlannerComponent implements OnInit {

  keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#', ]
  code = ''

  constructor(private http: HttpClient, private notifierService: NotificationsService) {
  }

  ngOnInit() {
    this.http.get<any>(environment.urlPrefix + 'testJson').subscribe({
      next: (res: any) => {
        console.log(res)
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  keyPressed(key: string) {
    this.code += key
  }

  deletePressed() {
    this.code = this.code.slice(0, -1);
  }

  sendPressed() {
    if (this.code == '') {
      this.notifierService.error('Code is empty')
      return
    }

    this.http.post<any>(environment.urlPrefix + 'api/send-code', {code: this.code}).subscribe({
      next: (res: any) => {
        this.notifierService.success('Code is sent')
        this.code = ''
      },
      error: (error: any) => {
        if (error.status == 429) {
          this.notifierService.error('Too many requests, please try again later.')
        } else {
          this.notifierService.error('Unknown error, please try again later.')
        }
      }
    })

  }

}
