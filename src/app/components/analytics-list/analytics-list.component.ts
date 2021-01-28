import { Component, OnInit } from '@angular/core';
import { InterviewService, QuestionTypeEnum } from 'src/app/services/interview.service';

export interface ChartDataObj {
  question: string;
  questionType: string;
  data: { name: string, value: number }[];
}

@Component({
  selector: 'app-analytics-list',
  templateUrl: './analytics-list.component.html',
  styleUrls: ['./analytics-list.component.scss']
})
export class AnalyticsListComponent implements OnInit {
  constructor(private interviewService: InterviewService) { }
  chartData = [];

  ngOnInit() {
    this.interviewService.summaryData$.subscribe((summaryData) => {
      // Update chartData anytime
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

  /**
   * Generates an eCharts object from chartData
   */
  chartGenerator(chartData: ChartDataObj): object {
    if (chartData.questionType === QuestionTypeEnum.MULTIPLE_CHOICE) {
      // Create a pie chart
      return {
        question: chartData.question,
        questionType: chartData.questionType,
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
              data: chartData.data
            }
          ]
        }

      };
    } else if (chartData.questionType === QuestionTypeEnum.INPUT) {
      // Create a Bar Chart
      return {
        question: chartData.question,
        questionType: chartData.questionType,
        options: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          calculable: true,
          xAxis: {
            type: 'category',
            data: chartData.data.map(d => d.name)
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: chartData.data.map(d => d.value),
            type: 'bar'
          }]
        }
      };
    }
  }
}
