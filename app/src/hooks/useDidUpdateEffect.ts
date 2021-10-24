import { useRef, useEffect } from "react";
import useAsyncEffect from "use-async-effect";

export const useDidUpdateEffect = (fn: () => void, inputs: Array<any>) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) return fn();
    else didMountRef.current = true;
  }, inputs);
};

export const useDidUpdateAsyncEffect = (
  fn: () => Promise<void>,
  inputs: Array<any>
) => {
  const didMountRef = useRef(false);

  useAsyncEffect(async () => {
    if (didMountRef.current) return await fn();
    else didMountRef.current = true;
  }, inputs);
};
