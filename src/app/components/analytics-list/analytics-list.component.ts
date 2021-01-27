import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics-list',
  templateUrl: './analytics-list.component.html',
  styleUrls: ['./analytics-list.component.scss']
})
export class AnalyticsListComponent implements OnInit {
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
  constructor() { }

  ngOnInit() {
  }

}
