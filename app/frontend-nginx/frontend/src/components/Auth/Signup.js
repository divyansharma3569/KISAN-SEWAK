import React, { useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../axios.config";
import { signup } from "../../store/features/userSlice";
import { useDispatch } from "react-redux";

const phoneRegex = /^\d{10}$/;

// REMOVED 'type' from required validation since we do it secretly now!
let schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  username: yup.string().required(),
  phone: yup.string().required().matches(phoneRegex, "Phone number must be 10 digits"),
  password: yup.string().min(6).max(8).required(),
});

function Signup() {
  const { t } = useTranslation();
  const [signupError, setSignupError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (data) => {
    setSignupError("");
    
    // SECRETLY add the type so the backend is happy!
    data.type = "farmer"; 

    axiosInstance
      .post("auth/account", data)
      .then((response) => {
        dispatch(signup(response.data.user));
        navigate("/disease-detection");
      })
      .catch((error) => {
        setSignupError("Failed to register. Username or phone may already exist.");
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <form
      className="flex flex-col gap-4 w-full mx-auto"
      autoComplete="true"
      onSubmit={handleSubmit(submitHandler)}
    >
      {signupError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium text-center">
          {signupError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-400 block text-sm font-medium text-slate-200">
              {t("description.auth.4")}
            </span>
            <input
              type="text"
              className={`mt-1 px-3 py-2.5 bg-slate-900/80 text-slate-100 border border-slate-700 focus:outline-none block w-full rounded-xl sm:text-sm focus:ring-1 transition-colors ${
                errors?.firstName ? "border-red-400 focus:ring-red-500" : "focus:border-amber-300 focus:ring-amber-300"
              }`}
              placeholder="First"
              {...register("firstName")}
            />
          </label>
        </div>

        <div>
          <label className="block">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-400 block text-sm font-medium text-slate-200">
              {t("description.auth.5")}
            </span>
            <input
              type="text"
              className={`mt-1 px-3 py-2.5 bg-slate-900/80 text-slate-100 border border-slate-700 focus:outline-none block w-full rounded-xl sm:text-sm focus:ring-1 transition-colors ${
                errors?.lastName ? "border-red-400 focus:ring-red-500" : "focus:border-amber-300 focus:ring-amber-300"
              }`}
              placeholder="Last"
              {...register("lastName")}
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-400 block text-sm font-medium text-slate-200">
            {t("description.auth.0")}
          </span>
          <input
            type="text"
            className={`mt-1 px-3 py-2.5 bg-slate-900/80 text-slate-100 border border-slate-700 focus:outline-none block w-full rounded-xl sm:text-sm focus:ring-1 transition-colors ${
              errors?.username ? "border-red-400 focus:ring-red-500" : "focus:border-amber-300 focus:ring-amber-300"
            }`}
            placeholder="Username"
            {...register("username")}
          />
        </label>
        {errors?.username && <p className="text-red-400 text-xs italic mt-1 ml-2">{errors.username.message}</p>}
      </div>

      <div>
        <label className="block">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-400 block text-sm font-medium text-slate-200">
            {t("description.auth.6")}
          </span>
          {/* Phone input now takes full width since 'type' dropdown is gone! */}
          <input
            type="text"
            className={`mt-1 px-3 py-2.5 bg-slate-900/80 text-slate-100 border border-slate-700 focus:outline-none block w-full rounded-xl sm:text-sm focus:ring-1 transition-colors ${
              errors?.phone ? "border-red-400 focus:ring-red-500" : "focus:border-amber-300 focus:ring-amber-300"
            }`}
            placeholder="10-digit number"
            {...register("phone")}
          />
        </label>
        {errors?.phone && <p className="text-red-400 text-xs italic mt-1 ml-2">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-400 block text-sm font-medium text-slate-200">
            {t("description.auth.1")}
          </span>
          <input
            type="password"
            className={`mt-1 px-3 py-2.5 bg-slate-900/80 text-slate-100 border border-slate-700 focus:outline-none block w-full rounded-xl sm:text-sm focus:ring-1 transition-colors ${
              errors?.password ? "border-red-400 focus:ring-red-500" : "focus:border-amber-300 focus:ring-amber-300"
            }`}
            placeholder="******"
            {...register("password")}
          />
        </label>
        {errors?.password && <p className="text-red-400 text-xs italic mt-1 ml-2">{errors.password.message}</p>}
      </div>

      <div className="flex justify-center mt-2">
        <input
          type="submit"
          value={t("description.auth.2")}
          className="h-12 w-full bg-gradient-to-r from-amber-300 to-orange-500 text-slate-950 rounded-xl font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] cursor-pointer transition-all"
        />
      </div>
    </form>
  );
}

export default Signup;