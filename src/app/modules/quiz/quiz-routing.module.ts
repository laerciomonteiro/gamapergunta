import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChosenComponent } from './chosen/chosen.component';
import { IntervieweeComponent } from './interviewee/interviewee.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'list', component: ListComponent},
  {path: 'list/:id', component: ChosenComponent},
  {path: 'interviewee', component: IntervieweeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
