import React from "react";
import { Button } from "../ui/button";
import { api } from "../../utils/api";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../context/slices/authSlice";
import Navigation from "./navigation.component";

const MainDashboard = () => {
  const logoutMutation = api.user.logout.useMutation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(setIsAuthenticated(false));
      },
      onError: (error) => {
        // Handle any errors
        console.error("Logout failed:", error);
      },
    });
  };

  return (
    <section className="flex justify-between p-4">
      <Navigation />
      <Button onClick={handleLogout}>Logout</Button>
    </section>
  );
};

export default MainDashboard;
