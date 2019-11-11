import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule, MatTableModule, MatCheckboxModule, MatToolbarModule, MatListModule } from '@angular/material'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RightsGridComponent } from './rights-grid/rights-grid.component';
import { GroupRightsComponent } from './group-rights/group-rights.component';
import { UserRightsComponent } from './user-rights/user-rights.component';
import { UsersComponent } from './users/users.component';
import { GroupsComponent } from './groups/groups.component'

@NgModule({
  declarations: [
    AppComponent,
    RightsGridComponent,
    GroupRightsComponent,
    UserRightsComponent,
    UsersComponent,
    GroupsComponent,
  ],
  imports: [
    HttpClientModule,
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
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
