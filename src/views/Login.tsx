import React, { useEffect } from "react";
// import useLogin from "../hooks/useLogin";
import ErrorMessage from "../components/ErrorMessage";
import InputField from "../components/InputField";
import { ButtonHTMLType, ButtonType } from "../enums/ButtonType";
import { ButtonComponent } from "../components/ButtonComponent";
import { useForm, SubmitHandler } from "react-hook-form";
import { loadUserFromStorage, login } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";

type FormValues = {
  username: string;
  password: string;
};

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "sebastian.kanecki",
      password: "admin1998",
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    dispatch(login({ username: data.username, password: data.password }));
  };

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
          Logowanie
        </h2>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            id="username"
            type="text"
            label="Login"
            autoComplete="username"
            register={register("username", { required: "Login jest wymagany" })}
            error={errors.username?.message}
          />
          <InputField
            id="password"
            type="password"
            label="Hasło"
            autoComplete="current-password"
            register={register("password", { required: "Hasło jest wymagane" })}
            error={errors.password?.message}
          />
          <div>
            <ButtonComponent
              label={loading ? "Logowanie..." : "Zaloguj"}
              type={ButtonType.Success}
              buttonType={ButtonHTMLType.Submit}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
