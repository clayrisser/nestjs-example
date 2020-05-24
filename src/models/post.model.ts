import { ObjectType } from '@nestjs/graphql';
import { Model } from './model.model';
import { User } from './user.model';

@ObjectType()
export class Post extends Model {
  title: string;
  content: string;
  published: boolean;
  author: User;
}
