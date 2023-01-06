import { Gender } from "../../../lib/constant";

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  gender: Gender;
};
