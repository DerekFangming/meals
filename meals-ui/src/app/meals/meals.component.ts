import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.css'
})
export class MealsComponent implements OnInit {

  time = new Date()

  constructor(private route: ActivatedRoute, private http: HttpClient, private notifierService: NotificationsService) {
  }
  
  ngOnInit() {
    this.route.params.subscribe(val => {
      console.log('123: ' + val['name'] + this.time)
    })
  }

}
