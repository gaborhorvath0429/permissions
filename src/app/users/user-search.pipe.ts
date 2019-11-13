import { Pipe, PipeTransform } from '@angular/core'
import { UserData } from '../services/rights.service'

@Pipe({
  name: 'userSearch'
})
export class UserSearchPipe implements PipeTransform {

  transform(array: UserData[], query: string): UserData[] {
    if (!query) {
      return array
    }
    return array.filter(
      (item: UserData) => item.name.toLowerCase().includes(query.toLowerCase())
    )
  }

}
