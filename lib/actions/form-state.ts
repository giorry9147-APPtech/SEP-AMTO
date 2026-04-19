export type FormActionState = {
  status: "idle" | "success" | "warning" | "error";
  message: string | null;
};

export const idleFormActionState: FormActionState = {
  status: "idle",
  message: null
};
