import { Pipe, PipeTransform } from '@angular/core'
import { UserModel } from '../models'

@Pipe({
  name: 'userSearch'
})
export class UserSearchPipe implements PipeTransform {

  transform(array: UserModel[], query: string): UserModel[] {
    if (!query) {
      return array
    }
    return array.filter(
      (item: UserModel) => item.displayName.toLowerCase().includes(query.toLowerCase())
    )
  }

}
