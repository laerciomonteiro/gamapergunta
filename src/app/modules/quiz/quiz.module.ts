import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuizRoutingModule } from './quiz-routing.module';
import { ChosenComponent } from './chosen/chosen.component';
import { IntervieweeComponent } from './interviewee/interviewee.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [ChosenComponent, IntervieweeComponent, ListComponent],
  imports: [
    CommonModule,
    QuizRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class QuizModule { }
