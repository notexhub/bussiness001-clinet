import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "@/store/slices/authSlice";
import AppRoutes from "@/routes/AppRoutes";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;
