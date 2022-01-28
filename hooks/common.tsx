import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from "next/router";
import { useAuth } from '.';

function getWindowDimensions() {
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
  }

  return null
  
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
   windowDimensions
  };
}


/**
 *
 * @param key the query key
 * @returns the query value to the query key
 */
export const useNextQueryParam = (key: string): string | undefined => {
  const { asPath } = useRouter();

  const value = useMemo(() => {
    const match = asPath.match(new RegExp(`[&?]${key}=(.*?)(&|$)`));
    if (!match) return undefined;
    return decodeURIComponent(match[1]);
  }, [asPath, key]);

  return value;
};
