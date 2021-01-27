import { Component, OnInit } from '@angular/core';
import {
  InterviewService,
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
  reviewAnswers = [];
  shouldDisplayReview = false;
  ngOnInit() {
    this.questions = this.interviewService.getQuestions();

    // Create a form group
    const group = {};
    this.questions.forEach((question, index) => {
      if (question.getQuestionType() === QuestionTypeEnum.MULTIPLE_CHOICE
        && question.getIsMultipleAnswer()) {
        group[`question-${index}`] = new FormArray([]);
      } else {
        group[`question-${index}`] = new FormControl('', Validators.required);
      }
    });

    this.interviewForm = new FormGroup(group);
    this.currentQuestion = this.questions[0];
    this.loading = false;
  }

  indexToName(index: number) {
    return `question-${index}`;
  }

  onCheckboxChange(index: number, option: string, e: any) {
    const checkArray: FormArray = this.interviewForm.get(this.indexToName(index)) as FormArray;
    if (e.checked) {
      checkArray.push(new FormControl(option));
    } else {
      checkArray.controls.forEach((item: FormControl, ii: number) => {
        if (item.value === option) {
          checkArray.removeAt(ii);
          return;
        }
      });
    }
  }

  isChecked(index: number, option: string) {
    const formControl = this.interviewForm.get(this.indexToName(index)) as FormArray;
    return formControl.controls.some(control => control.value === option);
  }

  shouldBeDisabled() {
    return !this.interviewForm.get(this.indexToName(this.index)).valid;
  }

  prepareResults() {
    const formValue = this.interviewForm.value;
    // Create submit ready objects
    Object.keys(formValue).map(key => {
      // Get index of question
      const index = key.split('-')[1];
      // Create question / answer obj
      const obj = {
        question: this.questions[index].question,
        answer: formValue[key]
      };
      this.reviewAnswers.push(obj);
    });
  }

  backToEditing() {
    this.reviewAnswers = [];
    this.shouldDisplayReview = false;
  }

  submitForm() {
    console.log('Submitting', this.reviewAnswers);
    // TODO: make this navigate to home

  }

  onChangeEventFunc(index: number, name: string, isChecked: any) {
    const arr = [];
    arr.push(name);
    const formControl = (this.interviewForm.get(this.indexToName(index)));
  }

  onContinue() {
    // If all questions have been answered, display responses review
    if (this.index === this.questions.length - 1) {
      // Prepare JSON in case user wants to submit
      this.prepareResults();
      this.shouldDisplayReview = true;
      return;
    }

    this.index++;
    this.currentQuestion = this.questions[this.index];
  }

  onBack() {
    this.index--;
    this.currentQuestion = this.questions[this.index];
  }
}
