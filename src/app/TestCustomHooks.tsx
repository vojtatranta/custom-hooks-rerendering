"use client";

import {
  createContext,
  useState,
  useContext,
  memo,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

export type State = {
  someString: string;
  nestedObject: {
    number: number;
    bigString: string;
  };
};

interface SelectStateContextType<T> {
  selectState: <K>(selector: (state: T) => K) => K;
}

const SelectStateContext = createContext<SelectStateContextType<object>>({
  // @ts-expect-error: defaults
  selectState: () => null,
});

export function SelectStateProvider<T extends object>({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: T;
}) {
  const [state, setState] = useState<T>(initialState);

  const selectState = useCallback(
    <K,>(selector: (state: T) => K): K => {
      return selector(state);
    },
    [state],
  );

  // @ts-expect-error: window.__setState is not defined
  window.__state = state;
  // @ts-expect-error: window.__setState is not defined
  window.__setState = setState;

  const contextValue = useMemo(() => ({ selectState }), [selectState]);

  return (
    <SelectStateContext.Provider value={contextValue}>
      {children}
    </SelectStateContext.Provider>
  );
}

export function useSelection<T extends object>() {
  const context = useContext(SelectStateContext) as SelectStateContextType<T>;
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}

export function useSelector<K>(selector: (state: State) => K): K {
  const { selectState } = useSelection<State>();
  const memoizedValue = useMemo(
    () => selectState(selector),
    [selectState, selector],
  );

  return useMemo(() => memoizedValue, [memoizedValue]);
}

export function WithSelector<T>({
  selector,
  children,
}: {
  selector: (state: State) => T;
  children: (value: T) => React.ReactNode;
}) {
  const selectedValue = useSelector(selector);
  console.log("WithSelector: rerenders");
  return useMemo(() => children(selectedValue), [children, selectedValue]);
}

export const SelectorComponent = memo(function SelectorComponent() {
  const bigString = useSelector((state) => state.nestedObject.bigString);

  console.log("changed: bigString (using useSelector)", bigString);
  return <div>SelectorComponent: {bigString}</div>;
});

export const TestCustomHooks = memo(function TestCustomHooks() {
  return (
    <div>
      <SelectorComponent />
      <WithSelector selector={(state) => state.someString}>
        {useCallback((value: string) => {
          console.log("changed: someString (using WithSelector)", value);
          return String(value);
        }, [])}
      </WithSelector>
    </div>
  );
});
