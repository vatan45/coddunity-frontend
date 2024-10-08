import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleicon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { usercontext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
    const { userAuth: { access_token }, setUserAuth } = useContext(usercontext);
    console.log(access_token);

    const userAuthThroughServer = async (serverRoute, formData) => {
        try {
            const { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData);
            storeInSession("user", JSON.stringify(data));
            setUserAuth(data)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    };
    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle().then(user => {
            let serverRoute = "/google-auth";
            let formData = {
                access_token: user.accessToken
            }
            userAuthThroughServer(serverRoute, formData)

        })
            .catch(err => {
                toast.error('trouble login through google');
                return console.log(err);
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type === "sign-in" ? "/signin" : "/signup";

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password validation

        // Form data
        const formElement = document.getElementById("formElement");
        let form = new FormData(formElement);
        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        // Form validation
        const { fullname, email, password } = formData;
        if (type !== "sign-in" && (!fullname || fullname.length < 3)) {
            return toast.error("Full name must be at least 3 characters long");
        }

        if (!email) {
            return toast.error("Email is required");
        }

        if (!emailRegex.test(email)) {
            return toast.error("Invalid email format");
        }

        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6-20 characters long and include at least one numeric digit, one lowercase, and one uppercase letter");
        }

        userAuthThroughServer(serverRoute, formData);
    };

    return (
        access_token ?
            <Navigate to="/" />


            :
            <AnimationWrapper KeyValue={type}>
                <section className="h-cover flex items-center justify-center">
                    <Toaster />
                    <form id="formElement" className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
                        <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                            {type === "sign-in" ? "Welcome back" : "Join us today"}
                        </h1>

                        {type !== "sign-in" && (
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder="Full Name"
                                icon="fi-rr-user"
                            />
                        )}
                        <InputBox
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon="fi-rr-envelope"
                        />
                        <InputBox
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon="fi-rr-key"
                        />

                        <button className="btn-dark center mt-14" type="submit">
                            {type.replace("-", " ")}
                        </button>

                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 text-black font-bold">
                            <hr className="w-1/2 border-black" />
                            <p>or</p>
                            <hr className="w-1/2 border-black" />
                        </div>

                        <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                            onClick={handleGoogleAuth}>
                            <img src={googleicon} className="w-5" alt="Google icon" />
                            Continue with Google
                        </button>

                        {type === "sign-in" ? (
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Don't have an account?
                                <Link to="/signup" className="underline text-black text-xl ml-1">
                                    Join us today
                                </Link>
                            </p>
                        ) : (
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Already a member?
                                <Link to="/signin" className="underline text-black text-xl ml-1">
                                    Sign in here.
                                </Link>
                            </p>
                        )}
                    </form>
                </section>
            </AnimationWrapper>
    );
};

export default UserAuthForm;
