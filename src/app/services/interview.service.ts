import { Injectable } from '@angular/core';

export interface Question {
  question: string;
  isMultipleChoice: boolean;
  isMultipleAnswer: boolean;
  inputType: string;
  choices: string[];
  hint?: string;
}

export interface QuestionResponse {
  question: string;
  answer: string;
}


@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  mockQuestions: Question[] = [
    {
      question: 'Why is the sky blue?',
      isMultipleChoice: true,
      isMultipleAnswer: false,
      inputType: null,
      choices: [
        'It is blue because it is blue.',
        'Many science, such wow, very fascinate.',
        'What really _is_ blue?'
      ]
    },
    {
      question: 'When you come to a fork in the road, and there are no options left, which way do you go?',
      isMultipleChoice: true,
      isMultipleAnswer: false,
      inputType: null,
      choices: [
        'left',
        'counter-left',
      ]
    }, {
      question: 'What color are the eyes of the most interesting person you know (select all that apply)',
      isMultipleChoice: true,
      isMultipleAnswer: true,
      inputType: null,
      choices: [
        'brown',
        'blue',
        'green',
        'gold',
        'red',
        'black',
        'white',
        'other',
      ]
    },
    {
      question: 'Examine your surroundings. How many green things do you see?',
      isMultipleChoice: false,
      isMultipleAnswer: false,
      inputType: 'number',
      choices: null,
      hint: '6'
    },
    {
      question: 'What did/would you name your first pet goat?',
      isMultipleChoice: false,
      isMultipleAnswer: false,
      inputType: 'string',
      choices: null,
      hint: 'Goaty McGoatface'
    }
  ];

  constructor() {
    console.log('CONSTRUCT Interview service');
  }

  getQuestions() {
    return this.mockQuestions;
  }

}
