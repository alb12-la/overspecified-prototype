import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum QuestionTypeEnum {
  INPUT = 'input',
  MULTIPLE_CHOICE = 'multiplechoice'
}

export interface QuestionResponse {
  question: string;
  answer: string | Array<any>;
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

export interface QuestionResponseSubmission {
  question: string;
  questionType: string;
  answer: string;
  choices?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  private localStorage: Map<string, { questionType: string, responses: Map<string, { number: number }> }> = new Map();
  public summaryData$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

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
      question: 'What color are the eyes of the most interesting person you know?',
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
   * Converts raw JSON questions into specialized question classes
   * @param jsonObj : raw json object
   */
  deserializeQuestions(jsonObj: any): any {
    // Input questions
    if (jsonObj.questionType === QuestionTypeEnum.INPUT) {
      return new QuestionObj(jsonObj.questionType, jsonObj.question, jsonObj.hint);
    }
    // Multiple choice questions
    if (jsonObj.questionType === QuestionTypeEnum.MULTIPLE_CHOICE) {
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

  submitResponse(questionResponses: QuestionResponseSubmission[]) {
    // Add response to localStorage
    questionResponses.forEach(response => {
      if (response.questionType === QuestionTypeEnum.MULTIPLE_CHOICE) {

        // Check if question exists in localStorage
        if (this.localStorage.has(response.question)) {
          // Just increment the count of how many times this choice has been selected
          const questionToUpdate = this.localStorage.get(response.question);
          const choiceToIncrement = questionToUpdate.responses.get(response.answer);
          // Increment
          choiceToIncrement.number = choiceToIncrement.number + 1;
        } else {

          // Create map to hold total count for each choice
          const map = new Map<string, { number: number }>();

          // Add each choice to map
          response.choices.forEach(choice => {
            map.set(choice, { number: 0 });
          });

          // Increment the selected answer in this response
          const increment = map.get(response.answer);
          increment.number = increment.number + 1;

          // Save to local storage
          this.localStorage.set(response.question,
            {
              responses: map,
              questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
            });
        }
      } else if (response.questionType === QuestionTypeEnum.INPUT) {

        if (this.localStorage.has(response.question)) {
          // Just increment the count of how many times this choice has been selected
          const questionToUpdate = this.localStorage.get(response.question);
          if (questionToUpdate.responses.has(response.answer)) {
            const choiceToIncrement = questionToUpdate.responses.get(response.answer);
            // Increment
            choiceToIncrement.number = choiceToIncrement.number + 1;
          } else {
            questionToUpdate.responses.set(response.answer, { number: 1 });
            console.log(questionToUpdate, 'quesiton to update');
          }
        } else {
          // Create map to hold total count for each choice
          const map = new Map<string, { number: number }>();
          // add this answer to the map
          map.set(response.answer, { number: 1 });
          this.localStorage.set(response.question,
            {
              responses: map,
              questionType: QuestionTypeEnum.INPUT
            });
        }
      }

      console.log(this.localStorage);
    });



    // Update Data
    const summaryArr: any[] = [];
    this.localStorage.forEach((v, k) => {
      // Convert choices map into an array that holds tally => Array { name:choiceName, value: totalCount }
      const d: { name: string, value: number }[] = [];
      v.responses.forEach((val, key) => {
        d.push({ name: key, value: val.number });
      });
      // Create summary data
      summaryArr.push(
        {
          question: k,
          questionType: v.questionType,
          data: d
        }
      );
      console.log('SUMMARY DAATA', summaryArr);
    });
    this.summaryData$.next(summaryArr);
  }


}
