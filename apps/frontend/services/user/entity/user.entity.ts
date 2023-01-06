import { Gender } from "../../../lib/constant";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  gender: Gender;
  createdAt?: string;
  updatedAt?: string;
};
