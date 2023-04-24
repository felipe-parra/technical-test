import { baseAxios } from "../utils/axios";

interface IUser {
  username?: string;
  email?: string;
  password: string;
}

export const loginApi = async (user: IUser) => {
  let error, data;
  try {
    const res = await baseAxios({
      url: "/login/",
      method: "POST",
      data: user,
    });
    data = res.data;
    console.log({ data });
    if (data["access_token"]) {
      localStorage.setItem("access_token", data["access_token"]);
    }
  } catch (err) {
    error = "Something went wrong";
    console.error("Error sign in", { error });
  } finally {
    return {
      error,
      data,
    };
  }
};

export const signupApi = async (user: IUser) => {
  let error, data;
  try {
    const res = await baseAxios({
      url: "/signup/",
      method: "POST",
      data: user,
    });
    data = res.data;
  } catch (err) {
    error = "Something went wrong";
  } finally {
    return {
      error,
      data,
    };
  }
};
