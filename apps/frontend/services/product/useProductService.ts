import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "./product.service";
import { UpdateProductDto } from "./product.dto";

export function useProductService(
  options: {
    userId?: string;
    productId?: string;
  } = {}
) {
  const { userId, productId } = options;
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: productService.create,
  });

  const findByUserIdQuery = useQuery({
    queryKey: ["product_by_user_id", userId],
    queryFn: () => productService.findByUserId(userId as string),
    enabled: userId === null || userId === undefined ? false : true,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updateProductDto,
    }: {
      id: string;
      updateProductDto: UpdateProductDto;
    }) => productService.update(id, updateProductDto),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productService.deleteById(id),
  });

  return {
    create: {
      run: createMutation.mutate,
      isLoading: createMutation.isLoading,
      isError: createMutation.isError,
      isSuccess: createMutation.isSuccess,
      response: createMutation.data,
    },
    update: {
      run: updateMutation.mutate,
      isLoading: updateMutation.isLoading,
      isError: updateMutation.isError,
      isSuccess: updateMutation.isSuccess,
      response: updateMutation.data,
    },
    findByUserId: {
      isLoading: findByUserIdQuery.isLoading,
      isError: findByUserIdQuery.isError,
      isSuccess: findByUserIdQuery.isSuccess,
      isRefetching: findByUserIdQuery.isRefetching,
      response: findByUserIdQuery.data,
    },
    deleteById: {
      run: deleteProductMutation.mutate,
      isLoading: deleteProductMutation.isLoading,
      isError: deleteProductMutation.isError,
      isSuccess: deleteProductMutation.isSuccess,
      response: deleteProductMutation.data,
    },
    invalidateProductUserId: () => {
      queryClient.invalidateQueries({
        queryKey: ["product_by_user_id"],
      });
    },
  };
}
