import { NavLink, Outlet } from "react-router";

function Layout() {
    return(
        <div>
            <nav>
                <NavLink to="/" end> Home </NavLink>
                <NavLink to="/expenses" end> Expenses </NavLink>
                <NavLink to="/expenses/new"> Add an expense </NavLink>
            </nav>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default Layout;