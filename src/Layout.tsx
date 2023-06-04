import { Title } from "@solidjs/meta";
import { Outlet, useLocation } from "@solidjs/router";
import { FiLogOut } from "solid-icons/fi";
import { Show, createEffect, createSignal } from "solid-js";
import { useLogout, useUser } from "./lib/api";

const Layout = () => {
  const location = useLocation();
  const user = useUser();
  const logout = useLogout();
  const [isLogin, setIsLogin] = createSignal(true);

  createEffect(() => {
    setIsLogin(location.pathname.includes("login"));
  });

  const onLogout = () => {
    logout.mutate();
  };

  return (
    <div class="w-screen h-screen bg-gradient-to-b from-blue-900 to-purple-500 flex items-center justify-center">
      <Title>Blackbirds Roller | {isLogin() ? "Login" : "Rolls"}</Title>

      <main
        class="flex flex-col m-auto bg-white rounded-md shadow-xl"
        classList={{
          "w-1/2 sm:w-1/4 h-auto": isLogin(),
          "w-11/12 sm:w-10/12 md:w-1/2 h-5/6": !isLogin(),
        }}
      >
        <header class="flex items-center justify-between p-4">
          <h1 class="font-medium text-lg sm:text-2xl">
            Blackbirds Roller {isLogin() ? "| Login" : null}
          </h1>
          <nav>
            <Show when={user.data !== null}>
              <button
                onClick={onLogout}
                disabled={logout.isLoading}
                title="Logout"
                class="flex items-center space-x-2 px-5 py-2 rounded bg-purple-400 transition duration-100 hover:bg-purple-800 text-white"
              >
                <span class="hidden sm:block text-sm">Logout</span>
                <FiLogOut />
              </button>
            </Show>
          </nav>
        </header>

        <div class="p-4 h-full overflow-y-scroll">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
