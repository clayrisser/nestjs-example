import { ObjectType, registerEnumType, HideField } from '@nestjs/graphql';
import { Model } from './model.model';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role'
});

@ObjectType()
export class User extends Model {
  email: string;
  firstname?: string;
  lastname?: string;
  role: Role;

  @HideField()
  password: string;
}
