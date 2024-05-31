import { IUser } from './UserInterfaces';

export class DOUser implements IUser {
  id: string;

  constructor(data: IUser) {
    this.id = data.id;
  }
}
