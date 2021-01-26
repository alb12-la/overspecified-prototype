import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  InterviewService,
  QuestionObj,
  MultipleChoiceQuestion,
  QuestionTypeEnum,
  displayQuestion
} from 'src/app/services/interview.service';

import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

// Error when invalid control is dirty or touched 
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (control && control.invalid) && (control.dirty || control.touched);
  }
}

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
  matcher = new MyErrorStateMatcher();

  ngOnInit() {
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

  indexToName(index: number) {
    return `question-${index}`;
  }

  onChangeEventFunc(index: number, name: string, isChecked: any) {
    const arr = [];
    arr.push(name);
    const formControl = (this.interviewForm.get(this.indexToName(index)));
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
