export * from './groupApiController.service';
import { GroupApiControllerService } from './groupApiController.service';
export * from './homeController.service';
import { HomeControllerService } from './homeController.service';
export * from './rightApiController.service';
import { RightApiControllerService } from './rightApiController.service';
export * from './systemApiController.service';
import { SystemApiControllerService } from './systemApiController.service';
export * from './userApiController.service';
import { UserApiControllerService } from './userApiController.service';
export const APIS = [GroupApiControllerService, HomeControllerService, RightApiControllerService, SystemApiControllerService, UserApiControllerService];
