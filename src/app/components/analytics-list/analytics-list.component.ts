import { Component, OnInit } from '@angular/core';
import { InterviewService, QuestionTypeEnum } from 'src/app/services/interview.service';

@Component({
  selector: 'app-analytics-list',
  templateUrl: './analytics-list.component.html',
  styleUrls: ['./analytics-list.component.scss']
})
export class AnalyticsListComponent implements OnInit {
  constructor(private interviewService: InterviewService) { }
  chartData = [];

  // TODO REMOVE MOCK BELOW
  data = [
    this.chartGenerator({
      question: 'When you come to a fork in the road, and there are no options left, which way do you go?',
      questionType: 'multiplechoice',
      data: [
        {
          name: 'left',
          value: 1
        },
        {
          name: 'counter-left',
          value: 0
        }
      ]
    })
  ];


  ngOnInit() {
    this.interviewService.summaryData$.subscribe((summaryData) => {
      console.log('LATEST', summaryData);
      summaryData.forEach(question => {
        // Generate a chart
        this.chartData.push(this.chartGenerator(question));
      });

    });
  }

  questionTypeToString(questionType: QuestionTypeEnum) {
    switch (questionType) {
      case QuestionTypeEnum.MULTIPLE_CHOICE:
        return 'Multiple Choice';
      case QuestionTypeEnum.INPUT:
        return 'User Input';
      default:
        return '';
    }
  }


  chartGenerator(question) {
    if (question.questionType === QuestionTypeEnum.MULTIPLE_CHOICE) {
      console.log('Generating from', JSON.stringify(question))
      console.log('Generating multiple choice chart');
      return {
        question: question.question,
        questionType: question.questionType,
        options: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          calculable: true,
          series: [
            {
              name: 'Answer',
              type: 'pie',
              radius: [30, 110],
              data: question.data
            }
          ]
        }

      };
    } else if (question.questionType === QuestionTypeEnum.INPUT) {
      console.log('Generating an INPUT chart');
      return {
        question: question.question,
        questionType: question.questionType,
        options: {
          title: {
            text: question.question,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          calculable: true,
          xAxis: {
            type: 'category',
            data: question.data.map(d => d.name)
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: question.data.map(d => d.value),
            type: 'bar'
          }]
        }
      };
    }
  }

}
