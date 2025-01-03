import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowComponent } from '../row/row.component';
import { PagesService } from '../../services/pages.service';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatButtonModule } from '@angular/material/button';
import { CdkContextMenuTrigger, CdkMenuItem, CdkMenu } from '@angular/cdk/menu';
import { PAGE } from '../../common/constants';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PageModel } from '../../models/PageModel';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-page',
  imports: [
    CommonModule,
    RouterModule,
    RowComponent,
    MatButtonModule,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit {

  constructor(public pagesService: PagesService, public loginService: LoginService,
    private router: Router, private dialog: MatDialog) { }

  popupPage: PageModel | null = null;

  ngOnInit(): void {
  }

  onContextMenuOpened(page: PageModel): void {
    this.popupPage = page;
  }

  navigateToPage(pagePath: string) {
    if (!pagePath) {
      throw new Error('pagePath is required');
    }
    this.router.navigate([PAGE + pagePath]);
  }

  deletePopupPage(): void {

    if (!this.popupPage) {
      throw new Error('popupPage is required');
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Page',
        question: `Are you sure you want to delete page ${this.popupPage.caption || this.popupPage.pagePath}?`,
        yes: 'Yes',
        no: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.popupPage = null;
        return;
      }
      this.pagesService.deletePage(this.popupPage!.id)
      .pipe(
        finalize(() => {
          this.popupPage = null;
        })
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
    });
  }


}
