import {
  faEllipsisVertical,
  faPenAlt,
  faRightFromBracket,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  Title,
  Text,
  ActionIcon,
  Menu,
  Box,
  Stack,
  Skeleton,
  Flex,
  Modal,
  TextInput,
} from "@mantine/core";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { jwt } from "../lib/helpers/jwt.helper";
import { useToast } from "../lib/hooks/useToast";
import { authService } from "../services/auth/auth.service";
import { User } from "../services/user/entity/user.entity";
import { useUserService } from "../services/user/useUserService";
import { useProductService } from "../services/product/useProductService";
import { CreateProductDto } from "../services/product/product.dto";

type Data = {
  user: User;
};

export const getServerSideProps: GetServerSideProps<Data> = async ({ req }) => {
  const user = jwt.decode(req.cookies.access_token as string) as User;
  console.log(`user`, user);
  return {
    props: { user },
  };
};

export default function HomePage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    create: {
      run: createProduct,
      isLoading: isCreateProductLoading,
      isSuccess: isCreateProductSuccess,
      isError: isCreateProductError,
      response: createProductResponse,
    },
    update: {
      run: updateProduct,
      isLoading: isUpdateProductLoading,
      isSuccess: isUpdateProductSuccess,
      isError: isUpdateProductError,
      response: updateProductResponse,
    },
    findByUserId: {
      isLoading: isProductLoading,
      isError: isProductError,
      isSuccess: isProductSuccess,
      response: productResponse,
    },
    deleteById: {
      // isDeleteProductByIdError,
      isLoading: isDeleteProductByIdLoading,
      // isDeleteProductByIdSuccess,
      run: deleteProductById,
      response: deleteProductByIdResponse,
    },
    invalidateProductUserId,
  } = useProductService({ userId: user.id });

  const {
    findById: {
      isLoading: isUserFindByIdLoading,
      isSuccess: isUserFindByIdSuccess,
      isError: isUserFindByIdError,
      isRefetching: isUserFindByIdRefetching,
      response: userFindByIdResponse,
    },
  } = useUserService({ userId: user.id });

  const [productIdWantToDeleted, setProductIdWantToDeleted] =
    useState<string>();
  const [productIdWantToUpdated, setProductIdWantToUpdated] =
    useState<string>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const showToast = useToast();

  useEffect(() => {
    if (deleteProductByIdResponse?.isSuccess) invalidateProductUserId();
  }, [deleteProductByIdResponse?.isSuccess]);

  // logic setelah klik tambah produk
  useEffect(() => {
    if (createProductResponse) {
      setIsCreateModalOpen(false);
      if (createProductResponse.isSuccess) {
        showToast.success({
          id: "create_product",
          title: createProductResponse.message,
        });
        invalidateProductUserId();
      } else {
        showToast.error({
          id: "create_product",
          title: createProductResponse.message,
        });
      }
    }
  }, [createProductResponse]);

  // useEffect(()=> {}, [productIdWantToUpdated])

  // logic setelah klik update produk
  useEffect(() => {
    if (updateProductResponse) {
      setIsUpdateModalOpen(false);
      if (updateProductResponse.isSuccess) {
        showToast.success({
          id: "update_product",
          title: updateProductResponse.message,
        });
        invalidateProductUserId();
      } else {
        showToast.error({
          id: "update_product",
          title: updateProductResponse.message,
        });
      }
    }
  }, [updateProductResponse]);

  // logic setelah klik hapus produk
  useEffect(() => {
    if (deleteProductByIdResponse) {
      setIsDeleteModalOpen(false);
      if (deleteProductByIdResponse.isSuccess) {
        showToast.success({
          id: "delete_product",
          title: deleteProductByIdResponse.message,
        });
      } else {
        showToast.error({
          id: "delete_product",
          title: deleteProductByIdResponse.message,
        });
      }
    }
  }, [deleteProductByIdResponse]);

  return (
    <>
      <Head>
        <title>Home | GoodStore</title>
      </Head>
      <main className="profile-page py-[16px]">
        <header className="px-[16px]">
          <div className="my-container flex items-center">
            <div className="spacer grow"></div>
            <Menu shadow="xl" position="bottom-end" width="192px">
              <Menu.Target>
                <ActionIcon title="profile-menu" radius="md">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown style={{ padding: "8px" }}>
                <Menu.Item
                  color="red"
                  icon={<FontAwesomeIcon icon={faRightFromBracket} />}
                  onClick={authService.signOut}
                >
                  Keluar
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </header>

        <section className="px-[16px] mt-[16px]">
          <div className="my-container flex flex-col items-center sm:flex-row gap-[24px]">
            <Skeleton
              className="rounded-full"
              circle
              visible={!userFindByIdResponse?.data}
            >
              <Avatar
                alt="user profile pic"
                size="xl"
                color="teal"
                style={{ borderRadius: 9999 }}
              >
                {userFindByIdResponse?.data.name.charAt(0)}
              </Avatar>
            </Skeleton>

            <div className="flex flex-col items-center sm:items-start">
              {!userFindByIdResponse?.data ? (
                <Skeleton height={31} width={230} />
              ) : (
                <Title order={2} className="text-center sm:text-left">
                  {userFindByIdResponse?.data.name}
                </Title>
              )}

              {!userFindByIdResponse?.data ? (
                <Skeleton height={21} width={200} className="mt-[8px]" />
              ) : (
                <Text className="text-center sm:text-left" color="gray">
                  {userFindByIdResponse?.data.email}
                </Text>
              )}
            </div>
            <div className="hidden sm:block grow"></div>
          </div>
        </section>

        <section className="history px-[16px] mt-[32px]">
          <div className="my-container">
            <Title order={3}>Product</Title>{" "}
            <Button
              className="mt-[16px]"
              onClick={() => setIsCreateModalOpen(true)}
              size="sm"
            >
              Tambah produk
            </Button>
            <Stack className="mt-[16px]">
              {!productResponse?.data ? (
                <>
                  {Array(5)
                    .fill(undefined)
                    .map((value, index) => (
                      <Skeleton key={index} height={67.6} />
                    ))}
                </>
              ) : productResponse.data.length == 0 ? (
                <div className="bg-gray-100 py-[32px] rounded-[8px] flex flex-col items-center justify-center gap-[8px]">
                  <Text className="text-gray-500">Belum ada produk</Text>
                </div>
              ) : (
                productResponse?.data.map(product => (
                  <Box
                    key={product.id}
                    className="rounded-[8px] p-[8px] flex flex-col gap-[4px] sm:flex-row sm:items-center border shadow-md border-gray-200 border-solid"
                  >
                    <div>
                      <Text weight="bold">{product.name}</Text>
                      <Text size="md">
                        {new Date(
                          product.createdAt as unknown as string
                        ).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "long",
                        })}
                      </Text>
                    </div>

                    <div className="spacer grow"></div>
                    <div className="flex gap-[8px]">
                      <ActionIcon
                        color="gray"
                        variant="light"
                        onClick={() => {
                          setProductIdWantToUpdated(product.id as string);
                          setIsUpdateModalOpen(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faPenAlt} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => {
                          setProductIdWantToDeleted(product.id as string);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </ActionIcon>
                    </div>
                  </Box>
                ))
              )}
            </Stack>
          </div>
        </section>

        <Modal
          opened={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Hapus produk"
          withCloseButton={false}
          centered
        >
          <Text>Yakin untuk mengapus produk?</Text>
          <Flex gap="8px" justify="end" style={{ marginTop: "24px" }}>
            <Button
              variant="light"
              color="gray"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={() =>
                deleteProductById(productIdWantToDeleted as string)
              }
              color="red"
              loading={isDeleteProductByIdLoading}
            >
              Ya, hapus
            </Button>
          </Flex>
        </Modal>

        <Modal
          opened={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Tambah produk"
          withCloseButton={false}
          centered
        >
          <form
            id="create_product"
            className="flex flex-col gap-2 mt-[8px]"
            onSubmit={async event => {
              event.preventDefault();
              const form = event.target as HTMLFormElement;
              const formData = new FormData(form);
              const data = Object.fromEntries(formData.entries());
              console.log("CreateProductDto", data);
              createProduct({ userId: user.id, ...data } as CreateProductDto);
            }}
          >
            <TextInput
              label="Nama produk"
              name="name"
              placeholder="Nama produk"
              error={
                typeof createProductResponse?.errors?.name === "string"
                  ? createProductResponse?.errors?.name
                  : false
              }
              required
            />
          </form>
          <Flex gap="8px" justify="end" style={{ marginTop: "24px" }}>
            <Button
              variant="light"
              color="gray"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              form="create_product"
              type="submit"
              loading={isCreateProductLoading}
            >
              Tambah
            </Button>
          </Flex>
        </Modal>

        <Modal
          opened={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Update produk"
          withCloseButton={false}
          centered
        >
          <form
            id="update_product"
            className="flex flex-col gap-2 mt-[8px]"
            onSubmit={async event => {
              event.preventDefault();
              const form = event.target as HTMLFormElement;
              const formData = new FormData(form);
              const data = Object.fromEntries(formData.entries());
              console.log("UpdateProductDto", data);
              updateProduct(productIdWantToUpdated as string, data);
            }}
          >
            <TextInput
              label="Nama produk"
              name="name"
              defaultValue={
                productResponse?.data.find(
                  product => product.id === productIdWantToUpdated
                )?.name
              }
              placeholder="Nama produk"
              error={
                typeof createProductResponse?.errors?.name === "string"
                  ? createProductResponse?.errors?.name
                  : false
              }
              required
            />
          </form>
          <Flex gap="8px" justify="end" style={{ marginTop: "24px" }}>
            <Button
              variant="light"
              color="gray"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              form="update_product"
              type="submit"
              loading={isUpdateProductLoading}
            >
              Update
            </Button>
          </Flex>
        </Modal>
      </main>
    </>
  );
}
