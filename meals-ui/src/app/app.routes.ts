import { Routes } from '@angular/router'
import { PlannerComponent } from './planner/planner.component'

export const routes: Routes = [
  { path: '', component: PlannerComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
]
