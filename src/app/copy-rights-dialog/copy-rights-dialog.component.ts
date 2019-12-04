import { Component, OnInit, Inject } from '@angular/core'
import { map, startWith } from 'rxjs/operators'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { GroupModel } from '../models'
import { RightsService } from '../services/rights.service'

@Component({
  selector: 'app-copy-rights-dialog',
  templateUrl: './copy-rights-dialog.component.html',
  styleUrls: ['./copy-rights-dialog.component.scss']
})
export class CopyRightsDialogComponent implements OnInit {
  myControl = new FormControl()
  groups: GroupModel[]
  selected: GroupModel
  filteredOptions: Observable<GroupModel[]>

  constructor(
    public dialogRef: MatDialogRef<CopyRightsDialogComponent>,
    private service: RightsService,
    @Inject(MAT_DIALOG_DATA) public source: GroupModel
  ) { }


  ngOnInit() {
    this.service.groups.subscribe(groups => this.groups = groups)
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.groupName),
        map(name => name ? this._filter(name) : this.groups.slice())
      )
  }

  private _filter(value: string): GroupModel[] {
    return this.groups.filter((option: GroupModel) => option.groupName.toLowerCase().includes(value.toLowerCase()))
  }

  public displayFn(options: GroupModel[]): (id: number) => string | null {
    return (id: number) => {
      const correspondingOption = Array.isArray(options) ? options.find(option => option.groupId === id) : null
      return correspondingOption ? correspondingOption.groupName : ''
    }
  }

  public selectGroup(id: number) {
    this.selected = this.groups.find(e => e.groupId === id)
  }

  onCancelClick(): void {
    this.dialogRef.close()
  }
}
