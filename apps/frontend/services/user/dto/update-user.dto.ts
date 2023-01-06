import { Gender } from "../../../lib/constant";

export type UpdateUserDto = {
  name?: string;
  gender?: Gender;
};
