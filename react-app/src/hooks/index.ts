import { useState, useEffect } from "react";
import { Observable } from "rxjs";

export function useStream<S>(stream: Observable<S>, initialState: S): S {
  const [data, setData] = useState(initialState);
  useEffect(() => {
    const sub = stream.subscribe((res) => {
      setData(res);
    });
    return () => {
      sub?.unsubscribe();
    };
  }, []);

  return data;
}
