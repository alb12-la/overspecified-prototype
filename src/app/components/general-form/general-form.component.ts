import { Component, OnInit } from '@angular/core';
import { InterviewService, QuestionObj, MultipleChoiceQuestion } from 'src/app/services/interview.service';

@Component({
  selector: 'app-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss']
})
export class GeneralFormComponent implements OnInit {

  constructor(private interviewService: InterviewService) { }
  questions: QuestionObj[];
  currentQuestion: QuestionObj | MultipleChoiceQuestion;
  index = 0;

  ngOnInit() {
    console.log(this.interviewService.getQuestions());
    this.questions = this.interviewService.getQuestions();
    this.currentQuestion = this.questions[this.index];
  }


  onContinue() {
    this.index++;
    this.currentQuestion = this.questions[this.index];
  }
}
