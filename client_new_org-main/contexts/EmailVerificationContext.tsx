import React, { createContext, ReactNode, useContext, useState } from "react";

interface EmailVerificationContextType {
  verificationId: string | null;
  email: string | null;
  userType: string | null;
  setVerificationData: (data: {
    verificationId: string;
    email: string;
    userType: string;
  }) => void;
  clearVerificationData: () => void;
}

const EmailVerificationContext = createContext<
  EmailVerificationContextType | undefined
>(undefined);

interface EmailVerificationProviderProps {
  children: ReactNode;
}

export const EmailVerificationProvider: React.FC<
  EmailVerificationProviderProps
> = ({ children }) => {
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const setVerificationData = (data: {
    verificationId: string;
    email: string;
    userType: string;
  }) => {
    setVerificationId(data.verificationId);
    setEmail(data.email);
    setUserType(data.userType);
  };

  const clearVerificationData = () => {
    setVerificationId(null);
    setEmail(null);
    setUserType(null);
  };

  return (
    <EmailVerificationContext.Provider
      value={{
        verificationId,
        email,
        userType,
        setVerificationData,
        clearVerificationData,
      }}
    >
      {children}
    </EmailVerificationContext.Provider>
  );
};

export const useEmailVerificationContext = () => {
  const context = useContext(EmailVerificationContext);
  if (context === undefined) {
    throw new Error(
      "useEmailVerificationContext must be used within an EmailVerificationProvider"
    );
  }
  return context;
};
