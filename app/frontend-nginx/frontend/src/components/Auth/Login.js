import React, { useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../axios.config";
import { login } from "../../store/features/userSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

let schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().min(6).max(8).required(),
});

function Login() {
  const { t } = useTranslation();
  const [loginError, setLoginError] = useState(""); // NEW: Error state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (data) => {
    setLoginError(""); // Clear previous errors
    axiosInstance
      .post("/auth/login", data)
      .then((response) => {
        dispatch(login(response.data.user));
        navigate("/disease-detection");
      })
      .catch((error) => {
        // NEW: Catch block sets the error message
        setLoginError("Entered username or password is wrong - please check again.");
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <form
      className="flex flex-col gap-5 w-full mx-auto"
      autoComplete="true"
      onSubmit={handleSubmit(submitHandler)}
    >
      {/* NEW: Error Banner */}
      {loginError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium text-center">
          {loginError}
        </div>
      )}

      <div>
        <label className="block">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-400 block text-sm font-medium text-slate-200">
            {t("description.auth.0")}
          </span>
          <input
            type="text"
            name="username"
            className={`mt-1 px-4 py-3 bg-slate-900/80 text-slate-100 border shadow-sm border-slate-700 placeholder-slate-500 focus:outline-none block w-full rounded-xl sm:text-sm focus:ring-1 transition-colors ${
              errors?.username
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "focus:border-amber-300 focus:ring-amber-300"
            }`}
            placeholder="Enter username"
            {...register("username")}
          />
        </label>
        {errors?.username && (
          <p className="text-red-400 text-xs italic mt-1 ml-2">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-400 block text-sm font-medium text-slate-200">
            {t("description.auth.1")}
          </span>
          <input
            type="password"
            name="password"
            className={`mt-1 px-4 py-3 bg-slate-900/80 text-slate-100 border shadow-sm border-slate-700 placeholder-slate-500 focus:outline-none block w-full rounded-xl sm:text-sm focus:ring-1 transition-colors ${
              errors?.password
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "focus:border-amber-300 focus:ring-amber-300"
            }`}
            placeholder="******"
            {...register("password")}
          />
        </label>
        {errors?.password && (
          <p className="text-red-400 text-xs italic mt-1 ml-2">{errors.password.message}</p>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <input
          type="submit"
          value={t("description.auth.3")}
          className="h-12 w-full bg-gradient-to-r from-amber-300 to-orange-500 text-slate-950 rounded-xl font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] cursor-pointer transition-all"
        />
      </div>
    </form>
  );
}

export default Login;