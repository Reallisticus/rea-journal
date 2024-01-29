import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "../components/ui/toaster";
import { Provider } from "react-redux";
import { store } from "../context/store/store";
import NotificationContainer from "../components/notification/container.component";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <NotificationContainer />
      <Component {...pageProps} />
      <Toaster />
    </Provider>
  );
};

export default api.withTRPC(MyApp);
