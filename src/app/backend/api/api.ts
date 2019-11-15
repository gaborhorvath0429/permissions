export * from './group.service';
import { GroupService } from './group.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [GroupService, UserService];
