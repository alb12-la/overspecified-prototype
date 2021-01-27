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
  data = [
    {
      title: {
        text: 'Question-01',
        subtext: 'Mocking Data',
        x: 'center'
      },
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
          data: [
            { value: 33, name: 'It is blue because it is blue.' },
            { value: 52, name: 'Many science, such wow, very fascinate.', },
            { value: 14, name: 'What really _is_ blue?' },
          ]
        }
      ]
    },
    {
      title: {
        text: 'Question-01',
        subtext: 'Mocking Data',
        x: 'center'
      },
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
          data: [
            { value: 33, name: 'It is blue because it is blue.' },
            { value: 52, name: 'Many science, such wow, very fascinate.', },
            { value: 14, name: 'What really _is_ blue?' },
          ]
        }
      ]
    },
    {
      title: {
        text: 'Question-01',
        subtext: 'Mocking Data',
        x: 'center'
      },
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
          data: [
            { value: 33, name: 'It is blue because it is blue.' },
            { value: 52, name: 'Many science, such wow, very fascinate.', },
            { value: 14, name: 'What really _is_ blue?' },
          ]
        }
      ]
    },
    {
      title: {
        text: 'Question-01',
        subtext: 'Mocking Data',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      calculable: true,
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }]
    }
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


  chartGenerator(question) {
    if (question.questionType === QuestionTypeEnum.MULTIPLE_CHOICE) {
      console.log('Generating multiple choice chart');
      return {
        title: {
          text: question.question,
          x: 'center'
        },
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
      };
    } else if (question.questionType === QuestionTypeEnum.INPUT) {
      console.log('Generating an INPUT chart');
      console.log('input?', question.data.map(d =>  d.name ) );
      return {
        title: {
          text: question.quesiton,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        calculable: true,
        xAxis: {
          type: 'category',
          data: question.data.map(d =>  d.name )
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: question.data.map(d =>  d.value ),
          type: 'bar'
        }]
      };
    }
  }

}
