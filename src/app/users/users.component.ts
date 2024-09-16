import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskApiService } from '../services/task-api.service';
import { UserService } from '../services/user.service';
import { TaskAPI } from '../models/task-api.model';
import { AuthService } from '../services/auth.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  taskForm: FormGroup;
  users: any[] = [];
  userSelected: any = false;
  userSelectedDisplay: any = false;
  createdTasks: TaskAPI[] = [];
  assignedTasks: TaskAPI[] = [];
  userConnectedId: string;

  constructor(
    private fb: FormBuilder,
    private taskApiService: TaskApiService,
    private userService: UserService,
    private authService: AuthService
  ){
    this.userConnectedId = this.authService.getId() || "";
    this.taskForm = this.fb.group({
      uid: ["", Validators.required]
    });

    this.loadUsers();
  }

  onSelectionChange(uid: number) {
    this.userSelectedDisplay = this.users.find(user => user.uid === uid);
  }
  loadUsers(){
    this.userService.getAllUsers().subscribe(
      (res)=>{
        this.users = res.allUsers;
      }
    );
  }
  fetchTasks(uid: string){
    this.taskApiService.getTasksAssignedToUser("",uid).subscribe(
      (res)=>{
        this.assignedTasks = res.allTasks;
      }
    )
    this.taskApiService.getTasksCreatedByUser("",uid).subscribe(
      (res)=>{
        this.createdTasks = res.allTasks;
      }
    )
  }

  showTasks(){
    if(this.taskForm.valid){
      const {uid} = this.taskForm.value;
      this.fetchTasks(uid);
      this.users.forEach(user => {
        if(user.uid == uid){
          this.userSelected = user;
        }
      });
    }
  }
  changeStatus(task: TaskAPI){
    this.taskApiService.updateTaskStatus("", task.taskUid, !task.done).subscribe(
      () => {
        this.fetchTasks(this.userSelected.uid);
      }
    );
  }

  deleteTask(task: TaskAPI){
    this.taskApiService.deleteTask("", task.taskUid).subscribe(
      ()=>{
        this.fetchTasks(this.userSelected.uid);
      }
    );
  }

}
