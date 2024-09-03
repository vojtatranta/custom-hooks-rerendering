import { SelectStateProvider, State, TestCustomHooks } from "./TestCustomHooks";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Custom hook re-rendering
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <SelectStateProvider<State>
            initialState={{
              someString: "someString",
              nestedObject: {
                number: 10,
                bigString: "This is a big string",
              },
            }}
          >
            <TestCustomHooks />
          </SelectStateProvider>
        </div>
      </div>
    </main>
  );
}
