import { Routes } from '@angular/router'
import { PlannerComponent } from './planner/planner.component'
import { MealsComponent } from './meals/meals.component'

export const routes: Routes = [
  { path: '', component: PlannerComponent },
  { path: 'meals/:name', component: MealsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
]
