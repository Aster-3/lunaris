export const arrayControler = (value: any) => {
  if (!value) value = null;
  else if (!Array.isArray(value)) {
    value = [value];
  }
  return value;
};
