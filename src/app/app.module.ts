import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule, MatTableModule, MatCheckboxModule, MatToolbarModule, MatListModule,
  MatTreeModule, MatIconModule, MatButtonModule, MatSelectModule, MatRadioModule,
  MatDialogModule, MatDatepickerModule, MatNativeDateModule,
  MatSnackBarModule, MatBadgeModule, MatAutocompleteModule } from '@angular/material'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RightsGridComponent } from './rights-grid/rights-grid.component'
import { GroupRightsComponent } from './group-rights/group-rights.component'
import { UserRightsComponent } from './user-rights/user-rights.component'
import { UsersComponent } from './users/users.component'
import { GroupsComponent } from './groups/groups.component'
import { UserSearchPipe } from './users/user-search.pipe'
import { SaveDialogComponent } from './save-dialog/save-dialog.component'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material'
import { ApiModule, BASE_PATH } from './backend'
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { CopyRightsDialogComponent } from './copy-rights-dialog/copy-rights-dialog.component'
import { environment } from 'src/environments/environment'

const DATE_FORMAT = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}

@NgModule({
  declarations: [
    AppComponent,
    RightsGridComponent,
    GroupRightsComponent,
    UserRightsComponent,
    UsersComponent,
    GroupsComponent,
    UserSearchPipe,
    SaveDialogComponent,
    SettingsDialogComponent,
    CopyRightsDialogComponent,
  ],
  imports: [
    HttpClientModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatListModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatAutocompleteModule
  ],
  entryComponents: [SaveDialogComponent, SettingsDialogComponent, CopyRightsDialogComponent],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT},
    {provide: BASE_PATH, useValue: environment.apiUrl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
