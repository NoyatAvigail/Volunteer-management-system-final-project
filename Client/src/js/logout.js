import Cookies from "js-cookie";

export function logOutFunc(navigate) {
    localStorage.removeItem("currentUser");
    Cookies.remove("token");
    window.location.href = "/login";
}