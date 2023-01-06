import {
  ActionIcon,
  Button,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Head from "next/head";
import { CreateUserDto } from "../services/user/dto/create-user.dto";
import { useUserService } from "../services/user/useUserService";
import Link from "next/link";
import { Route } from "../lib/constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../lib/hooks/useToast";
import { useEffect, useMemo } from "react";
import { redirector } from "../lib/helpers/redirector.helper";

export default function SignUpPage() {
  const {
    signup: {
      run: signUp,
      isLoading: isSignUpLoading,
      isSuccess: isSignUpSuccess,
      response: signUpResponse,
    },
  } = useUserService();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const showToast = useMemo(() => useToast(), []);

  useEffect(() => {
    if (signUpResponse) {
      if (signUpResponse.isSuccess) {
        showToast.success({
          id: "signup",
          title: signUpResponse.message,
        });
        redirector.toLoginPage();
      } else {
        showToast.error({
          id: "signup",
          title: signUpResponse.message,
        });
      }
    }
  }, [showToast, signUpResponse]);

  return (
    <>
      <Head>
        <title>Buat akun | GoodStore</title>
      </Head>

      <main className="signup-page px-[16px] min-h-screen flex flex-col justify-center">
        <div className="my-container max-w-xs">
          <ActionIcon component={Link} href={Route.HOME} variant="light">
            <FontAwesomeIcon icon={faArrowLeft} />
          </ActionIcon>
          <Title order={2} style={{ marginTop: "16px" }}>
            Buat akun
          </Title>
          <form
            id="user_signup"
            className="flex flex-col gap-2 mt-[8px]"
            onSubmit={async event => {
              event.preventDefault();
              const form = event.target as HTMLFormElement;
              const formData = new FormData(form);
              const data = Object.fromEntries(formData.entries());
              console.log("CreateUserDto", data);
              signUp(data as CreateUserDto);
            }}
          >
            <TextInput
              label="Nama"
              name="name"
              placeholder="Nama kamu"
              error={
                typeof signUpResponse?.errors?.name === "string"
                  ? signUpResponse?.errors?.name
                  : false
              }
              required
            />
            <TextInput
              type="email"
              label="Email"
              name="email"
              placeholder="Email"
              error={
                typeof signUpResponse?.errors?.email === "string"
                  ? signUpResponse?.errors?.email
                  : false
              }
              required
            />
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Password"
              error={
                typeof signUpResponse?.errors?.password === "string"
                  ? signUpResponse?.errors?.password
                  : false
              }
              required
            />
            <Select
              label="Jenis Kelamin"
              name="gender"
              placeholder="Jenis Kelamin"
              data={[
                {
                  value: "male",
                  label: "Laki-laki",
                },
                {
                  value: "female",
                  label: "Perempuan",
                },
              ]}
              error={
                typeof signUpResponse?.errors?.gender === "string"
                  ? signUpResponse?.errors?.gender
                  : false
              }
              required
            />
          </form>
          <Button
            type="submit"
            form="user_signup"
            className="w-full mt-[16px] capitalize"
            loading={isSignUpLoading || signUpResponse?.isSuccess}
          >
            Buat akun
          </Button>
          <Text style={{ marginTop: "16px", textAlign: "center" }} fz="sm">
            Sudah punya akun?.{" "}
            <Link
              href={Route.SIGNIN}
              style={{ cursor: "pointer" }}
              className="text-blue-500 hover:underline"
            >
              Masuk
            </Link>
          </Text>
        </div>
      </main>
    </>
  );
}
