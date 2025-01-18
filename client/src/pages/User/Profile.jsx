import { useDispatch, useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../../redux/api/usersApiSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router";
import { Loader1 } from "../../components/Loader";

export default function Profile() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useUpdateProfileMutation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setUsername(userInfo?.username || "");
    setEmail(userInfo?.email || "");
  }, [userInfo.username, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !username) {
      toast.error("Name and email are required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();
      console.log("Profile updated successfully:", res);

      dispatch(setCredentials({ ...res }));

      setPassword("");
      setConfirmPassword("");

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[7rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">
            Update Personal Profile
          </h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-2"
              >
                Name
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter name"
                className="form-input p-4 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                className="form-input p-4 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter new password (optional)"
                className="form-input p-4 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password (optional)"
                className="form-input p-4 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                disabled={loadingUpdateProfile}
                className={`bg-pink-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-pink-600 my-[1rem] transition-opacity ${
                  loadingUpdateProfile
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
              >
                {loadingUpdateProfile ? "Updating..." : "Update"}
              </button>

              <Link
                to="/user-orders"
                //className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
                className={`bg-pink-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-pink-600 my-[1rem] transition-opacity ${
                  loadingUpdateProfile
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
              >
                My Orders
              </Link>
            </div>
            {loadingUpdateProfile && <Loader1 />}
          </form>
        </div>
      </div>
    </div>
  );
}
