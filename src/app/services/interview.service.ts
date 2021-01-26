import { Injectable } from '@angular/core';

export enum QuestionTypeEnum {
  INPUT = 'input',
  MULTIPLE_CHOICE = 'multiplechoice'
}

export interface QuestionResponse {
  question: string;
  answer: string;
}

export class QuestionObj {
  constructor(
    private questionType: 'input' | 'multiplechoice',
    private question: string,
    private hint?: string,
    public answer?: string,
  ) { }

  getQuestion() {
    return this.question;
  }

  getQuestionType() {
    return this.questionType;
  }

  getHint() {
    return this.hint;
  }
}

export class MultipleChoiceQuestion extends QuestionObj {
  private isMultipleAnswer: boolean;
  private choices: string[];
  public answer?: string;

  constructor(
    questionType: 'input' | 'multiplechoice',
    question: string,
    isMultipleAnswer: boolean,
    choices: string[],
    hint?: string,
    answer?: string,
  ) {
    super(questionType, question, hint, answer);
    this.isMultipleAnswer = isMultipleAnswer;
    this.choices = choices;
  }

  getIsMultipleAnswer() {
    return this.isMultipleAnswer;
  }

  getChoices() {
    return this.choices;
  }
}

export type displayQuestion = QuestionObj & MultipleChoiceQuestion;

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  mockQuestions: any[] = [
    {
      questionType: 'multiplechoice',
      question: 'Why is the sky blue?',
      hint: null,
      isMultipleAnswer: false,
      choices: [
        'It is blue because it is blue.',
        'Many science, such wow, very fascinate.',
        'What really _is_ blue?'
      ]
    },
    {
      questionType: 'multiplechoice',
      question: 'When you come to a fork in the road, and there are no options left, which way do you go?',
      isMultipleAnswer: false,
      choices: [
        'left',
        'counter-left',
      ]
    },
    {
      questionType: 'multiplechoice',
      question: 'What color are the eyes of the most interesting person you know (select all that apply)',
      isMultipleAnswer: true,
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
      questionType: 'input',
      question: 'Examine your surroundings. How many green things do you see?',
      hint: '6'
    },
    {
      questionType: 'input',
      question: 'What did/would you name your first pet goat?',
      hint: 'Goaty McGoatface'
    }
  ];

  constructor() { }

  /**
   * Converts raw JSON questions into specialized questions
   * @param jsonObj : raw json object
   */
  deserializeQuestions(jsonObj: any): any {
    // Input questions
    if (jsonObj.questionType === QuestionTypeEnum.INPUT) {
      console.log('INPUT QUESTION FOUND');
      return new QuestionObj(jsonObj.questionType, jsonObj.question, jsonObj.hint);
    }
    // Multiple choice questions
    if (jsonObj.questionType === QuestionTypeEnum.MULTIPLE_CHOICE) {
      console.log('Multiple choice question born');
      return new MultipleChoiceQuestion(
        jsonObj.questionType,
        jsonObj.question,
        jsonObj.isMultipleAnswer,
        jsonObj.choices,
        jsonObj.hint,
        jsonObj.answer
      );
    }
  }

  getQuestions() {
    const typedQuestions: displayQuestion[] = [];
    this.mockQuestions.forEach(obj => {
      typedQuestions.push(this.deserializeQuestions(obj));
    });
    console.log('questions', typedQuestions);
    return typedQuestions;
  }
}
