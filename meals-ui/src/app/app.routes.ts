import { Routes } from '@angular/router'
import { PlannerComponent } from './planner/planner.component'
import { DishesComponent } from './dishes/dishes.component'

export const routes: Routes = [
  { path: '', component: PlannerComponent },
  { path: 'dishes/:name', component: DishesComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
]
