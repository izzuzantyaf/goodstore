import { ApiRoute } from "../../lib/constant";
import { removeAccessTokenFromCookie } from "../../lib/helpers/cookie.helper";
import { fetchToServer } from "../../lib/helpers/fetcher-to-server.helper";
import { ServerResponse } from "../../lib/types/server-response.type";
import { SignInDto } from "./dto/signin.dto";

export const authService = {
  signIn: ({
    username,
    password,
  }: SignInDto): Promise<ServerResponse<{ access_token: string }>> =>
    fetchToServer({
      path: ApiRoute.SIGNIN,
      method: "POST",
      body: {
        username,
        password,
      },
    }),
  signOut: () => {
    removeAccessTokenFromCookie();
    location.reload();
  },
};
