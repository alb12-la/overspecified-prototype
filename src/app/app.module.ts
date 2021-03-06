import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InterviewService } from './services/interview.service';
import { A11yModule } from '@angular/cdk/a11y';

// Material imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './components/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HomeComponent } from './components/home/home.component';
import { GeneralFormComponent } from './components/general-form/general-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxEchartsModule } from 'ngx-echarts';
import { AnalyticsListComponent } from './components/analytics-list/analytics-list.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import * as echarts from 'echarts';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GeneralFormComponent,
    AnalyticsListComponent,
    AutofocusDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    A11yModule,
    NgxEchartsModule.forRoot({ echarts })
  ],
  providers: [InterviewService],
  bootstrap: [AppComponent]
})
export class AppModule { }
