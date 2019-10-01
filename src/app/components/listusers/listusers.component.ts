import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource,MatPaginator,MatSort } from '@angular/material';
import {MatDialog, MatDialogConfig} from "@angular/material";
import {HttpClient} from '@angular/common/http';
import {merge, Observable,Observer, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { UserUpdateComponent } from '../user-update/user-update.component'
import { Constant } from '../../constant';

@Component({
  selector: 'app-listusers',
  templateUrl: './listusers.component.html',
  styleUrls: ['./listusers.component.scss']
})
export class ListusersComponent implements AfterViewInit  {
  displayedColumns: string[] = ['identification','name', 'email','phone','created_at','updated_at','edit'];
  userDataResource: UserHttpDatabase | null;
  data: UserData[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  filterText: string;

  observable: Observable<string>;
  observer: Observer<string>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private _httpClient: HttpClient,private dialog: MatDialog) {}

  ngAfterViewInit() {

    this.observable = new Observable((observer: Observer<string>) => {
      this.observer = observer;
    });

    this.userDataResource = new UserHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.filterText = '';

    merge(this.sort.sortChange, this.paginator.page,this.observable)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.userDataResource!.getRepoIssues(
            this.sort.active, this.sort.direction, this.paginator.pageIndex,this.paginator.pageSize,this.filterText);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

  editUser(row: UserData){
    this.openDialog(row);
  }

  applyFilter(filterValue: string) {
    this.filterText = filterValue;
    this.observer.next(filterValue);
  }

  openDialog(row: any) {

    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = false;
    // dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";

    dialogConfig.data = row;

    // this.dialog.open(UserUpdateComponent, dialogConfig);
    
    const dialogRef = this.dialog.open(UserUpdateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => this.observer.next('')
    ); 
}
}

export interface UserApi {
  items: UserData[];
  total_count: number;
}

export interface UserData {
  identification: number;
  name: string;
  email: string;
  phone: number;
  created_at: Date;
  updated_at: Date;
}

/** An example database that the data source uses to retrieve data for the table. */
export class UserHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getRepoIssues(sort: string, order: string, page: number,pageSize: number,filter:string): Observable<UserApi> {
    const href = Constant.API_ENDPOINT+'/user/list';
    const requestUrl = `${href}?sort=${sort}&order=${order}&page=${page + 1}&count=${pageSize}&filter=${filter}`;

    return this._httpClient.get<UserApi>(requestUrl);
  }
}
