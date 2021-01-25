import { Component, OnInit } from '@angular/core';
import { InterviewService, Question } from 'src/app/services/interview.service';

@Component({
  selector: 'app-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss']
})
export class GeneralFormComponent implements OnInit {

  constructor(private interviewService: InterviewService) { }
  questions: Question[];
  currentQuestion: Question;
  index = 0;

  ngOnInit() {
    this.questions = this.interviewService.getQuestions();
    this.currentQuestion = this.questions[this.index];
  }


  onContinue() {
    this.index++;
    this.currentQuestion = this.questions[this.index];
  }
}
