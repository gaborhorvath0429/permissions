import { Pipe, PipeTransform } from '@angular/core'
import { UserDTO } from '../backend'

@Pipe({
  name: 'userSearch'
})
export class UserSearchPipe implements PipeTransform {

  transform(array: UserDTO[], query: string): UserDTO[] {
    if (!query) {
      return array
    }
    return array.filter(
      (item: UserDTO) => item.displayName.toLowerCase().includes(query.toLowerCase())
    )
  }

}
