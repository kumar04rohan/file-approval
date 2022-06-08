import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { displayModel } from '../landing-page/display.model';
import { ViewDialogComponent } from '../my-uploads/view-dialog/view-dialog.component';

@Component({
  selector: 'app-denied',
  templateUrl: './denied.component.html',
  styleUrls: ['./denied.component.css']
})
export class DeniedComponent implements OnInit {

  displayedColumns: string[] = ['name', 'version', 'view'];
  dataSource!: displayModel[];
  files:any;
  noFiles = true;
  isLoading = true;
  constructor(private httpService:HttpService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const userId = this.getUserInfo('id');
    this.httpService.getDeniedManagerFile().then((res: any) => {
      this.files = res.File;
      this.setDataSource();
      this.isLoading = false;
    });
  }

  setDataSource() {
    const dataSource = [];
    console.log(this.files.length, "len")
    if (this.files.length > 0) {
      this.noFiles = false;
      for (let data of this.files) {
        const status = this.getApprovalStatus(data.is_approved);
        const dataElement = {id: data.id, name:data.name, version:data.version, department:data.tag_id};
        dataSource.push(dataElement);
      }
      this.dataSource = dataSource;
      console.log(this.dataSource)
    }
   else {
     this.noFiles = true;
   }
  }
  
  getApprovalStatus(status:string|null) {
    if (status == null) {
      return "Pending";
    }
    else if (status == "True"){
     return "Approved";
    }
    else {
      return "Denied"
    }
  }


  getUserInfo(key: string) {
    let sessionStorageUser: any = sessionStorage.getItem('user');
    if (sessionStorageUser) {
      const user = JSON.parse(sessionStorageUser);
      const userInfo = user[key];
      return userInfo;
    } else {
      return null;
    }
  }

  openViewDialog(url: string) {
    const dialogRef = this.dialog.open(ViewDialogComponent, {
      data: { url:url },
    });
  }

  view(id:number) {

    this.httpService.getSpecificFileUrl(id)
    .then(
      (res:any) => {
        this.openViewDialog(res.File.path);
      }
    )
  }
}
