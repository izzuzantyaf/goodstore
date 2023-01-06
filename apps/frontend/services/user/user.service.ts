import { ApiRoute } from "../../lib/constant";
import { fetchToServer } from "../../lib/helpers/fetcher-to-server.helper";
import { ServerResponse } from "../../lib/types/server-response.type";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entity/user.entity";

export const userService = {
  signup: (createUserDto: CreateUserDto): Promise<ServerResponse<User>> =>
    fetchToServer({
      path: ApiRoute.USER,
      method: "POST",
      body: createUserDto,
    }),
  update: (updateUserDto: UpdateUserDto): Promise<ServerResponse<User>> =>
    fetchToServer({
      path: ApiRoute.USER,
      method: "PATCH",
      body: updateUserDto,
    }),
  findById: (id: string): Promise<ServerResponse<User>> =>
    fetchToServer({
      path: ApiRoute.USER + `/${id}`,
      method: "GET",
    }),
  deleteById: (id: string): Promise<ServerResponse<User>> =>
    fetchToServer({
      path: ApiRoute.USER + `/${id}`,
      method: "DELETE",
    }),
};
