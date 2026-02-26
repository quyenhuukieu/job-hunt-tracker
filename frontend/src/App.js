import AuthProvider from "./auth/AuthProvider";

import LoginPage from "./pages/LoginPage";

import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";

import RequireAuth from "./auth/RequireAuth";

import {

 BrowserRouter,
 Routes,
 Route,
 Navigate

} from "react-router-dom";


export default function App() {

 return (

  <AuthProvider>

   <BrowserRouter>

    <Routes>

     {/* Default route */}

     <Route path="/" element={<Navigate to="/login" />} />


     <Route path="/login" element={<LoginPage />} />


     <Route path="/register" element={<RegisterPage />} />


     <Route

       path="/dashboard"

       element={

         <RequireAuth>

           <DashboardPage />

         </RequireAuth>

       }

     />


    </Routes>

   </BrowserRouter>

  </AuthProvider>

 );

}