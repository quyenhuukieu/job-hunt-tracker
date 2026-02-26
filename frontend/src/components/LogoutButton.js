import useAuth from "../auth/useAuth";

export default function LogoutButton() {

  const { logout } = useAuth();

  return (

    <button onClick={logout}>

      Logout

    </button>

  );

}