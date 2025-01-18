import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { useCreateUserMutation } from "../../redux/api/authApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
import Loader from "../../components/Loader";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();

  const { userInfo } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [register, { isLoading }] = useCreateUserMutation();

  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !username) {
      return toast.error("Please fill in all fields.");
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return; // Prevent further execution
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      console.log("Registration successful:", res);

      toast.success("User successfully registered");
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err?.data?.message || "An unexpected error occurred");
    }
  };

  return (
    <section className="pl-[10rem] flex flex-wrap">
      <div className="mr-[4rem] mt-[5rem]">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>

        <form onSubmit={submitHandler} className="container w-[40rem]">
          {/* Name Input */}
          <div className="my-[2rem]">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="my-[2rem]">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="my-[2rem]">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="my-[2rem]">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {password !== confirmPassword && (
              <p className="text-red-500 mt-1">Passwords do not match.</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={isLoading || password !== confirmPassword}
            type="submit"
            className={`bg-pink-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-pink-600 my-[1rem] transition-opacity ${
              isLoading || password !== confirmPassword
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader className="mt-2" />}
        </form>

        {/* Redirect to Login */}
        <div className="mt-4">
          <p className="text-white">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Image */}
      <img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        alt="Registration illustration"
        className="h-[45rem] w-[45%] xl:block lg:block md:hidden sm:hidden rounded-lg"
      />
    </section>
  );
}
