# AtomSphere

An atomic state management library for React.

AtomSphere is very similar to [Jotai](https://jotai.org/) but with a slightly different API. It lets you create `Atoms` and use them in your React components.

When using atoms, you get a fine-grained reactivity system that only updates the components that depend on the atom that changed
(as opposed to the traditional React context system, which re-renders all the components under the context when the state changes).

## Usage

Creating and using an atom is pretty simple and straightforward.
You can create an atom using the `atom` function, and read it using the `useAtom` hook:

```tsx
// Counter.tsx
import { atom, useAtom } from 'atomsphere';

const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

In the example above, we're creating an atom outside the component scope, and using it inside the `Counter` component.

if you want, you can create your atoms in a separate file and import them in multiple components, the choice is yours:

```ts
// atoms.ts
import { atom } from 'atomsphere';

export const countAtom = atom(0);
export const nameAtom = atom('John Doe');
```

```tsx
// Counter.tsx
import { useAtom } from 'atomsphere';
import { countAtom } from './atoms';

function Counter() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

```tsx
// Name.tsx
import { useAtom } from 'atomsphere';
import { nameAtom } from './atoms';

function Name() {
  const [name, setName] = useAtom(nameAtom);

  return (
    <div>
      <p>Name: {name}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
}
```

AtomSphere also supports derived atoms, which are atoms that depend on other atoms.

In order to create a derived atom, instead of passing an initial value to the `atom` function, you pass a function that calculates the value of the atom.
You'll receive a `get` function as an argument that will allow you to get the value of other atoms:

```tsx
// Derived.tsx
import { atom, useAtom } from 'atomsphere';

const countAtom = atom(0);
const doubleCountAtom = atom((get) => get(countAtom) * 2);

function Derived() {
  const [count, setCount] = useAtom(countAtom);
  const doubleCount = useAtom(doubleCountAtom);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double Count: {doubleCount}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

Each time the `countAtom` changes, the `doubleCountAtom` will be recalculated, and the components that depend on it will be updated.

The dependency tracking is done automatically by AtomSphere, so you don't have to worry about it.
