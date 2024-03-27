// import React, { useEffect } from 'react';
// import { useRouter } from "next/router";
// import { useAuth } from "../hooks";

// export const WithAuth = (WrappedComponent: any) => {

//     return (props) => {
//       const { user } = useAuth()
//       // checks whether we are on client / browser or server.
//       if (typeof window !== "undefined") {
//         const Router = useRouter();

//         // If there is no access token we redirect to "/" page.
//         if (!user) {
//           Router.replace("/login");
//           return null;
//         }

//         // If this is an accessToken we just render the component that was passed with all its props

//         return <WrappedComponent {...props} />;
//       }

//       // If we are on server, return null
//       return null;
//     };
//   };

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth, useToken } from "../hooks";
import jwt from "jwt-decode";

export const WithAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const { user } = useAuth();
    const { token } = useToken();
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const Router = useRouter();

      // If there is no access token we redirect to "/" page.
      if (!user || !token) {
        localStorage.clear();
        Router.push("/login");
        return null;
      }

      // check if token is valid
      if (user && token) {
        const DecryptedToken = jwt(token) as any;
        if (DecryptedToken.exp < Date.now() / 1000) {
          localStorage.clear();
          Router.replace("/login");
          return null;
        }
      }

      // If this is an accessToken we just render the component that was passed with all its props

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};
