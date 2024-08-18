import { Button, Input2 } from "./index.js";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updatePassword } from "../store/slices/authSlice.js";

function ChangePassword() {
  const {
    register,
    handleSubmit,
    resetField,
    getValues,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(
      updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
    );
    resetField("oldPassword");
    resetField("newPassword");
    resetField("confirmPassword");
  };
  return (
    <div className="w-full text-white flex justify-center items-center mt-2">
      <div className="bg-transparent p-8 border rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <Input2
              label="Old Password"
              type="password"
              {...register("oldPassword", {
                required: "Old Password is required",
              })}
            />
            {errors.oldPassword && (
              <span className="text-sm text-red-500">
                {errors.oldPassword.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Input2
              label="New Password"
              type="password"
              className="rounded"
              {...register("newPassword", {
                required: "New Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.newPassword && (
              <span className="text-sm text-red-500">
                {errors.newPassword.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Input2
              label="Confirm New Password"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: {
                  matchesNewPassword: (value) =>
                    value === getValues("newPassword") ||
                    "Passwords do not match",
                },
              })}
            />
            {errors.oldPassword && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <div>
            <Button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
