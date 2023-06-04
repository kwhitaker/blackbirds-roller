import { MetaProvider } from "@solidjs/meta";
import { Route, Router, Routes } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import type { Component } from "solid-js";
import Home from "./Home";
import Layout from "./Layout";
import Login from "./Login";

const App: Component = () => {
  const qCLient = new QueryClient();

  return (
    <QueryClientProvider client={qCLient}>
      <MetaProvider>
        <Router>
          <Routes>
            <Route path="/" component={Layout}>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
            </Route>
          </Routes>
        </Router>
      </MetaProvider>
    </QueryClientProvider>
  );
};

export default App;
