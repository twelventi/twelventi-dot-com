import { Link, Outlet } from "react-router-dom";
import { mainLayoutRoutes } from "./Routing";
import { FaGithub, FaMoon, FaRegMoon, FaSun } from "react-icons/fa/index";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { useContext } from "react";
import { CursorEnabler } from "./components/CursorEnabler";
import { EnabledCursorContext } from "./components/CursorHandler";

// layout for main page
export const MainLayout = () => {
  const [enabledCursors, setEnabledCursors] = useContext(EnabledCursorContext);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="navbar bg-base-100 w-full">
        <div className="flex items-center w-full justify-center">
          <div className="max-w-4xl w-full flex justify-between items-center px-5">
            <Link to="/">
              <img
                className="mask mask-circle h-12 w-12 m-2 drop-shadow"
                src="/david-michaelangelo.jpg"
                alt=""
              />
            </Link>

            <div className="flex-grow h-12">
              {mainLayoutRoutes.map((route) => {
                if (route.hiddenFromNav) {
                  return <></>;
                }
                return (
                  <Link
                    className="navbar-center text-base-content hover:underline h-12 leading-12 px-5 my-2"
                    to={route.path}
                  >
                    {route.name}
                  </Link>
                );
              })}
            </div>
            <CursorEnabler
              enabledCursors={enabledCursors as boolean}
              setEnabledCursors={setEnabledCursors as (val: boolean) => {}}
            />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      <div className="bg-primary h-5 bg-repeat bg-10% px-10 drop-shadow-lg"></div>
      <div className="flex-grow bg-base-100 px-10">
        <div className="bg-base-100 p-5 ">
          <div className="bg-base-100 p-5 ">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="bg-primary h-5 bg-repeat bg-10% px-10 drop-shadow-lg"></div>
      <div className="footer bg-base-100 bg-base-100 flex flex-row sm:flex-nowrap flex-wrap items-center justify-center ">
        <div className="w-full flex flex-row sm:flex-nowrap justify-between flex-wrap max-w-4xl">
          <div className="bg-base-100 w-36 p-10 h-full">twelventi</div>
          <div className="bg-base-100 p-10 h-full">
            <Link
              className="flex items-center h-full"
              to="https://github.com/twelventi"
            >
              <FaGithub />
              <span className="ml-2 h-full">twelventi</span>
            </Link>
          </div>
          <div className="bg-base-100 p-7 h-full h-max min-h-max min-h-full">
            This is my personal tech blog. Opinions are my own.
          </div>
        </div>
      </div>
    </div>
  );
};
