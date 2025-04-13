import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from './task.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="completed-container">
      <h2>Completed Tasks</h2>
      <ul *ngIf="completedTasks.length > 0">
        <li *ngFor="let task of completedTasks">{{ task.title }}</li>
      </ul>
      <p *ngIf="completedTasks.length === 0">No completed tasks yet.</p>
      <button routerLink="/main" class="btn btn-secondary">Back to Tasks</button>
    </div>
  `,
  styles: [`
    .completed-container {
      padding: 20px;
    }
    .btn-secondary {
      margin-top: 20px;
      background-color: gray;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
    }
  `]
})
export class CompletedTasksComponent implements OnInit {
  completedTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.completedTasks = tasks.filter(task => task.completed);
    });
  }
}
