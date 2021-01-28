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
  originalQuestion: displayQuestion;
  answer: string;
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

  getQuestions(): Promise<displayQuestion[]> {
    const typedQuestions: displayQuestion[] = [];
    this.mockQuestions.forEach(obj => {
      typedQuestions.push(this.deserializeQuestions(obj));
    });

    // Simulate server latency with 1s delay
    return new Promise(resolve => {
      setTimeout(() => resolve(typedQuestions), 1000);
    });
  }

  submitResponse(questionResponses: QuestionResponseSubmission[]) {

    /**
     * The following, is a function to reliably store + update interview results
     */
    questionResponses.forEach(response => {
      /**
       * The question was of type MULTIPLE CHOICE
       */
      if (response.originalQuestion.getQuestionType() === QuestionTypeEnum.MULTIPLE_CHOICE) {

        // Check if question exists in localStorage
        if (this.localStorage.has(response.originalQuestion.getQuestion())) {

          // If has multiple answers, check each answer item
          if (response.originalQuestion.getIsMultipleAnswer()) {
            const answerArr: Array<any> = response.answer as unknown as Array<any>;
            answerArr.forEach(ans => {
              // Increment total count of how many times this answer has been selected
              const questionToUpdate = this.localStorage.get(response.originalQuestion.getQuestion());
              const choiceToIncrement = questionToUpdate.responses.get(ans);
              // Increment
              choiceToIncrement.number = choiceToIncrement.number + 1;
            });
          } else {
            // If just a single answer
            // Just increment the count of how many times this choice has been selected
            const questionToUpdate = this.localStorage.get(response.originalQuestion.getQuestion());
            const choiceToIncrement = questionToUpdate.responses.get(response.answer);
            // Increment
            choiceToIncrement.number = choiceToIncrement.number + 1;
          }
        } else {
          // Question is not in local storage, create an entry for it
          // Create map to hold total count for each choice
          const map = new Map<string, { number: number }>();

          // Add each choice to map
          response.originalQuestion.getChoices().forEach(choice => {
            map.set(choice, { number: 0 });
          });

          // If multiple answers are allowed, loop through answer and increment if it was selected
          if (response.originalQuestion.getIsMultipleAnswer()) {
            const answerArr: Array<any> = response.answer as unknown as Array<any>;
            answerArr.forEach(ans => {
              const increment = map.get(ans);
              increment.number = increment.number + 1;
            });
          } else {
            // Increment the selected answer in this response
            const increment = map.get(response.answer);
            increment.number = increment.number + 1;
          }

          // Save to local storage
          this.localStorage.set(response.originalQuestion.getQuestion(),
            {
              responses: map,
              questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
            });
        }
      } else if (response.originalQuestion.getQuestionType() === QuestionTypeEnum.INPUT) {

        /**
         * The question was of type USER INPUT
         */

        if (this.localStorage.has(response.originalQuestion.getQuestion())) {
          // Just increment the count of how many times this choice has been selected
          const questionToUpdate = this.localStorage.get(response.originalQuestion.getQuestion());
          if (questionToUpdate.responses.has(response.answer)) {
            const choiceToIncrement = questionToUpdate.responses.get(response.answer);
            // Increment
            choiceToIncrement.number = choiceToIncrement.number + 1;
          } else {
            questionToUpdate.responses.set(response.answer, { number: 1 });
          }
        } else {
          // Create map to hold total count for each choice
          const map = new Map<string, { number: number }>();
          // add this answer to the map
          map.set(response.answer, { number: 1 });
          // Save to local storage
          this.localStorage.set(response.originalQuestion.getQuestion(),
            {
              responses: map,
              questionType: QuestionTypeEnum.INPUT
            });
        }
      }
      // This has been purposefully left active to show how local storage works
      console.log('Local storage has been updated', this.localStorage);
    });


    // Extract all data from localStorage for an array containing tallied data for graph creation
    const summaryArr: any[] = [];
    this.localStorage.forEach((v, k) => {
      // Convert choices map into an array that holds tally i.e (  questionName  => [ { name:choiceName, value: totalCount } ] )
      const dataArr: { name: string, value: number }[] = [];
      v.responses.forEach((val, key) => {
        dataArr.push({ name: key, value: val.number });
      });
      // Create summary data
      summaryArr.push(
        {
          question: k,
          questionType: v.questionType,
          data: dataArr
        }
      );
    });

    // Emit this updated data to the analytics that is subscribed to this BehaviorSubject
    this.summaryData$.next(summaryArr);
  }
}
