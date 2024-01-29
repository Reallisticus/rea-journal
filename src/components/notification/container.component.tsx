import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../context/store/store";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useEffect } from "react";

const NotificationContainer = () => {
  const dispatch = useDispatch();
  const notification = useSelector(
    (state: RootState) => state.ui.notifications,
  );
  const { toast } = useToast();

  useEffect(() => {
    notification.forEach((n) => {
      toast({
        title: n.type.charAt(0).toUpperCase() + n.type.slice(1),
        variant: n.type === "error" ? "destructive" : "default",
        description: n.message,
        action: n.action ? (
          <ToastAction altText={n.action.label} onClick={n.action.onClick}>
            {n.action.children}
          </ToastAction>
        ) : undefined,
      });
    });
  }, [notification, dispatch, toast]);

  return null; // This component doesn't need to render anything itself
};

export default NotificationContainer;
