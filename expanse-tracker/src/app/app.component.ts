import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpanseTrackerService } from './service/expanse-tracker.service';
import { Expanse, tableRows } from './model/expanse.model';
import { CommonModule } from '@angular/common';
import {v4 as uuidv4} from 'uuid';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'expanse-tracker';
  expanseTrackerForm: FormGroup;
  tableRows = tableRows;
  expanseTrackerList: any;
  update: boolean = false;
  totalIncome: number = 0;
  totalExpanse: number = 0;
  remaining: number = 0;
  canvas: any;
  ctx: any;
  @ViewChild('myChart') myChart: any;
  isEditMode: boolean = false;

  constructor(
    private expanseService: ExpanseTrackerService
  ) {
    this.expanseTrackerForm = new FormGroup({
      id: new FormControl(this.generateUniqueId()),
      expanseType: new FormControl("", Validators.required),
      expanseCategory: new FormControl(""),
      amount: new FormControl(0, Validators.compose([Validators.required])),
      description: new FormControl("", Validators.required),
      date: new FormControl("", Validators.required)
    })
  }


  get expanseType() {
    return this.expanseTrackerForm.value['expanseType'] === 'Expanse'
  }


  ngAfterViewInit(): void {
     this.canvas = this.myChart.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    let myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ['green', 'red', 'blue'],
        datasets: [{
          data:[this.totalIncome,this.totalExpanse,this.remaining],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  get isFromValid() {
     return this.expanseTrackerForm.valid
  }

  ngOnInit(): void {
    this.getAllExpanseList();
    this.generateUniqueId();
    this.calculateBudget();
  }

  private getAllExpanseList() {
    this.expanseTrackerList = this.expanseService.getAllExpanse();
    this.expanseTrackerList = JSON.parse(this.expanseTrackerList);
  }

  private generateUniqueId() {
    let myuuid = uuidv4();
    return myuuid
  }

  public clearForm() {
    this.expanseTrackerForm = new FormGroup({
      id: new FormControl(this.generateUniqueId()),
      expanseType: new FormControl("", Validators.required),
      expanseCategory: new FormControl(""),
      amount: new FormControl(0, Validators.compose([Validators.required])),
      description: new FormControl("", Validators.required),
      date: new FormControl("", Validators.required)
    })
    this.isEditMode = false;
  }
 
  public addUser() {
    const expanseInfo: Expanse = this.expanseTrackerForm.value;
    if(!this.expanseTrackerList) {
      const newExpanseList: Expanse[] = [];
      newExpanseList.push(expanseInfo);
      this.expanseService.addNewExpanse(newExpanseList)
    } else {
      const oldExpanseList = this.expanseTrackerList;
      oldExpanseList.push(expanseInfo);
      this.expanseService.addNewExpanse(oldExpanseList);
    }
    this.clearForm();
    this.getAllExpanseList();
    this.calculateBudget();
  }

  public updateExpanse() {
    this.isEditMode = true;
    let updateExpanse: Expanse = this.expanseTrackerForm.value;
    const updatedExpanseList = this.expanseTrackerList.map((data: Expanse) => {
     if(data.id === updateExpanse.id) {
       return {
         ...data,
         expanseType: updateExpanse.expanseType,
         amount: updateExpanse.amount,
         description: updateExpanse.description,
         date: updateExpanse.date
       }
     } else{
       return data;
     }
    })
    this.expanseService.updateExpanse(updatedExpanseList);
    this.clearForm();
    this.getAllExpanseList();
    this.calculateBudget();
    this.isEditMode = false;
  }

  public editUser(expanse: Expanse) {
    this.isEditMode = true;
    this.expanseTrackerForm.setValue({
     id: expanse.id,
     expanseType: expanse.expanseType,
     amount: expanse.amount,
     description: expanse.description,
     date: expanse.date,
     expanseCategory: expanse.expanseCategory || ""
    });
  }

  get isFromMode() {
    return !this.isEditMode ? "Save" : "Update"
  }

  deleteUser(expanse: Expanse) {
    const result = window.confirm(`Are you Sure You want to delete`);
    if(result === true) {
      const filterList = this.expanseTrackerList.filter((res: Expanse) => res.id !== expanse.id);
      this.expanseService.deleteExpanse(filterList)
      this.getAllExpanseList();
      this.calculateBudget()
    }
  }

  calculateIncome(incomes: Expanse[]) {
    this.totalIncome = incomes.reduce((n, {amount}) => n + amount, 0);
  }

  calculateExpanse(expanse: Expanse[]) {
    this.totalExpanse = expanse.reduce((n, {amount}) => n + amount, 0);
  }

  get calculateRemaining() {
    return this.totalIncome - this.totalExpanse
  }

  calculateBudget() {
    const income = this.expanseTrackerList.filter((expanse: Expanse) => expanse.expanseType === 'Income');
    this.calculateIncome(income);
    const expanse = this.expanseTrackerList.filter((expanse: Expanse) => expanse.expanseType === 'Expanse');
    this.calculateExpanse(expanse)
  }
}
