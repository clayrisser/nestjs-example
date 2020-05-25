import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver
} from '@nestjs/graphql';
import { Auth } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { User } from '../../models/user.model';

@Resolver((of) => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation((returns) => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const token = await this.auth.createUser(data);
    return { token };
  }

  @Mutation((returns) => Auth)
  async login(@Args('data') { email, password }: LoginInput) {
    const token = await this.auth.login(email.toLowerCase(), password);
    return { token };
  }

  @ResolveField('user', (returns) => User)
  async user(@Parent() auth: Auth) {
    return this.auth.getUserFromToken(auth.token);
  }
}
