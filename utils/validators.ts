export const checkIfIsValidNumber = (
  event: { target: { value: any } },
  setState: (arg0: any) => void,
) => {
  const value = event.target.value;
  if (/^\d*$/.test(value)) {
    setState(value);
  }
};
