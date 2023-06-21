import { useState } from "react";

export default function useForm<T extends object>(initialData: T) {
  const [formState, setFormState] = useState<T>(initialData);

  function onChange(key: keyof T, newVal: any) {
    setFormState({
      ...formState,
      [key]: newVal,
    });
  }

  return [formState, onChange] as const;
}
