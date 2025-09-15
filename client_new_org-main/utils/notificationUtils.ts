import { useCurrentUser } from "@/hooks/use-auth";

/**
 * Transforms notification messages based on user type and notification content
 */
export const transformNotificationMessage = (message: string, userType: string): string => {
  // For stylists, change "placed" to "received" in order notifications
  if (userType === "stylist") {
    // Transform messages like "John has placed a new order" to "John has received a new order"
    return message.replace(/has placed a new order/gi, "has received a new order");
  }
  
  return message;
};

/**
 * Custom hook to get transformed notification message based on current user type
 */
export const useTransformedNotificationMessage = (message: string): string => {
  const { user } = useCurrentUser();
  return transformNotificationMessage(message, user?.user_type || "");
};