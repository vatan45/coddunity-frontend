import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";

// Define the context type
export const usercontext = createContext({
    userAuth: { access_token: null },
    setUserAuth: () => { }
});

const App = () => {
    const [userAuth, setUserAuth] = useState({ access_token: null });

    useEffect(() => {
        const userInSession = lookInSession("user");
        if (userInSession) {
            setUserAuth(JSON.parse(userInSession));
        }
    }, []);

    return (
        <usercontext.Provider value={{ userAuth, setUserAuth }}>

            <Routes>
                <Route path="/editor" element={<Editor />} />
                <Route path="/" element={<Navbar />}>
                    <Route path="/signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="/signup" element={<UserAuthForm type="sign-up" />} />
                </Route>
            </Routes>
        </usercontext.Provider>
    );
};

export default App;
