import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ChangePasswordInput } from './dto/change-password.input';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { PrismaService } from '../../services/prisma.service';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from '../../models/user.model';
import { UserEntity } from '../../decorators/user.decorator';
import { UserService } from '../../services/user.service';

@Resolver((of) => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(
    private userService: UserService,
    private prisma: PrismaService
  ) {}

  @Query((returns) => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput
  ) {
    return this.userService.updateUser(user.id, newUserData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.userService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }
}
