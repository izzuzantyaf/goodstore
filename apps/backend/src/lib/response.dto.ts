interface AppResponse {
  isSuccess: boolean;
  message: string;
  data?: any;
  errors?: any;
}

/**
 * @description Class yang merepresentasikan struktur data response yang berhasil
 */
export class SuccessfulResponse implements AppResponse {
  isSuccess = true;
  message: string;
  data?: any;

  constructor(
    props: Pick<AppResponse, 'message' | 'data'> = {
      message: 'Success',
      data: null,
    },
  ) {
    const { message, data } = props;
    this.message = message;
    this.data = data;
  }
}

/**
 * @description Class yang merepresentasikan struktur data response yang gagal
 */
export class ErrorResponse implements AppResponse {
  isSuccess = false;
  message: string;
  errors?: any;

  constructor(
    props: Pick<AppResponse, 'message' | 'errors'> = {
      message: 'Failed',
      errors: null,
    },
  ) {
    const { message, errors } = props;
    this.message = message;
    this.errors = errors;
  }
}
