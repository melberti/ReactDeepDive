import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import GlobalStyles from "./styles/GlobalStyles";
import Account from "./pages/Account";
import Bookings from "./pages/Bookings";
import Booking from "./pages/Booking";
import CheckIn from "./pages/CheckIn";
import Cabins from "./pages/Cabins";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

//for react query (tanstack) dev tools
// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

//because we won't be using loaders from ReactRouter
//we can set up our routes using BrowserRouter tag
//rather than createBrowserRouter function

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <Navigate
                    replace
                    to="/dashboard"
                  />
                }
              />
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
              <Route
                path="/bookings"
                element={<Bookings />}
              />
              <Route
                path="/booking/:bookingId"
                element={<Booking />}
              />
              <Route
                path="/checkin/:bookingId"
                element={<CheckIn />}
              />
              <Route
                path="/cabins"
                element={<Cabins />}
              />
              <Route
                path="/users"
                element={<Users />}
              />
              <Route
                path="/settings"
                element={<Settings />}
              />
              <Route
                path="/account"
                element={<Account />}
              />
            </Route>
            {/*  end of layout route */}
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="*"
              element={<PageNotFound />}
            />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          gutter="10"
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: { duration: 3000 },
            error: { duration: 5000 },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-1)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
