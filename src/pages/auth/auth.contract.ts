import { UserRoles, type Gender } from "../../config/constants";
import * as Yup from "yup"
export interface IRegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRoles;
  gender: Gender | null;
  phone: string;
  address: string;
  image: any;
}

export const RegisterDefaultValues = {
      name: "",
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRoles.CUSTOMER,
      gender: null,
      phone: '',
      address: '',
      image: null

    }
export const RegisterDTO = Yup.object({
  name: Yup.string().min(2).max(50).required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.ref('password'),
  role: Yup.string().matches(/^(customer|seller)$/).default(UserRoles.CUSTOMER),
  gender: Yup.string().matches(/^(male|female|other)$/),
  phone: Yup.string().optional().nullable(),
  address: Yup.string().optional().nullable(),
  image: Yup.mixed().nullable()
})