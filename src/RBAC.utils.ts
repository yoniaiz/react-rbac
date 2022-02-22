export const checkIfRBACValid = (
  required: string[],
  existing: Record<string, string>
) => {
  if (!required) {
    return true;
  }

  return required.every((r) => !!existing[r]);
};
