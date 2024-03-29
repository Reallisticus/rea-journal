import Head from "next/head";

import Registration from "../components/auth/registration.component";

import Verification from "../components/auth/verification.component";

import MainDashboard from "../components/dashboard/main.component";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../context/store/store";
import Login from "../components/auth/login.component";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { env } from "../env";
import { useEffect } from "react";
import {
  setIsAuthenticated,
  setLoading,
  setUserDetails,
  setUserStatus,
} from "../context/slices/authSlice";
import { BaseProps, UserStatus } from "../types/global";
import { api } from "../utils/api";

interface HomeProps extends BaseProps {
  loading: boolean;
}

export default function Home({ userStatus, loading }: HomeProps) {
  const { isLoginView, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const dispatch = useDispatch();
  const userDetails = api.user.getUserDetails.useQuery();

  console.log(userDetails.data);

  useEffect(() => {
    dispatch(setUserStatus(userStatus));
    if (userStatus === "FULLY_AUTHENTICATED") {
      dispatch(setIsAuthenticated(true));
      if (userDetails.data && userDetails.data.userDetails) {
        dispatch(
          setUserDetails({
            email: userDetails.data.userDetails.email,
            username: userDetails.data.userDetails.username || "",
            avatarUrl:
              userDetails.data.userDetails.avatar ||
              "/public/images/default-avatar.png",
          }),
        );
      }
    }
    dispatch(setLoading(loading));
  }, [userStatus, loading]);

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        {isAuthenticated && <MainDashboard />}
        {!isAuthenticated && userStatus === "VERIFIED" && <Verification />}
        {(!isAuthenticated &&
          userStatus === "UNVERIFIED" &&
          (isLoginView ? <Login /> : <Registration />)) ||
          (!isAuthenticated && <Login />)}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parseCookies({ req });
  const token = cookies.token;

  let userStatus: UserStatus = "UNVERIFIED";
  let loading = false;

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      if (decoded.fullyAuthenticated) {
        userStatus = "FULLY_AUTHENTICATED";
      } else if (decoded.emailVerified) {
        userStatus = "VERIFIED";
      }
    } catch (error) {
      console.error("JWT verification error:", error);
    } finally {
      loading = false;
    }
  } else {
    loading = false;
  }

  return { props: { userStatus, loading } };
};
