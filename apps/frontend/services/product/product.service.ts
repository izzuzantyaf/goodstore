import { ApiRoute } from "../../lib/constant";
import { fetchToServer } from "../../lib/helpers/fetcher-to-server.helper";
import { ServerResponse } from "../../lib/types/server-response.type";
import { CreateProductDto, UpdateProductDto } from "./product.dto";
import { Product } from "./product.entity";

export const productService = {
  create: (
    createProductDto: CreateProductDto
  ): Promise<ServerResponse<Product>> =>
    fetchToServer({
      path: ApiRoute.PRODUCT,
      method: "POST",
      body: createProductDto,
    }),
  update: (
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<ServerResponse<Product>> =>
    fetchToServer({
      path: ApiRoute.PRODUCT + `/${id}`,
      method: "PATCH",
      body: updateProductDto,
    }),
  findByUserId: (userId: string): Promise<ServerResponse<Product[]>> =>
    fetchToServer({
      path: `${ApiRoute.USER}/${userId}/products`,
      method: "GET",
    }),
  deleteById: (id: string): Promise<ServerResponse<Product>> =>
    fetchToServer({
      path: ApiRoute.PRODUCT + `/${id}`,
      method: "DELETE",
    }),
};
