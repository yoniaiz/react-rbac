interface Props {
  required: string[];
  existing: Record<string, string>;
  added: Record<string, string>;
  blocked: Record<string, string>;
}
export const checkIfRBACValid = ({
  required,
  existing,
  blocked,
  added,
}: Props) => {
  if (!required) {
    return true;
  }

  return required.every((r) => !blocked[r] && (!!existing[r] || !!added[r]));
};
