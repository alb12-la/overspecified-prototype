import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  InterviewService,
  QuestionObj,
  MultipleChoiceQuestion,
  QuestionTypeEnum,
  displayQuestion
} from 'src/app/services/interview.service';

import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss']
})
export class GeneralFormComponent implements OnInit {
  interviewForm: FormGroup;
  QuestionTypeEnum = QuestionTypeEnum;
  constructor(
    private interviewService: InterviewService,
    private fb: FormBuilder,
  ) { }
  questions: displayQuestion[];
  currentQuestion: displayQuestion;
  index = 0;
  loading = true;

  ngOnInit() {
    console.log(this.interviewService.getQuestions());
    this.questions = this.interviewService.getQuestions();

    // Create a form group
    const group = {};
    this.questions.forEach((question, index) => {
      group[`question-${index}`] = new FormControl('', Validators.required);
    });

    this.interviewForm = new FormGroup(group);
    this.currentQuestion = this.questions[0];
    this.loading = false;
  }

  onContinue() {
    this.index++;
    this.currentQuestion = this.questions[this.index];
  }

  onBack() {
    this.index--;
    this.currentQuestion = this.questions[this.index];
  }
}
