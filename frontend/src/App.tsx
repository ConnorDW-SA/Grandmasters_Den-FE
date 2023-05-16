import React from "react";
import Login from "./pages/Login";
import "./App.css";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import "bootstrap/dist/css/bootstrap.min.css";
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Login />
      </div>
    </QueryClientProvider>
  );
}
