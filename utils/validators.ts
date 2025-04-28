export const checkIfIsValidNumber = (
  event: { target: { value: any } },
  setState: (arg0: any) => void,
) => {
  const value = event.target.value;
  if (/^\d*$/.test(value)) {
    setState(value);
  }
};

export const checkIfIsValidPercentage = (
  event: { target: { value: any } },
  setState: (arg0: any) => void,
) => {
  const value = event.target.value;
  if (/^((100)|(\d{1,2}(\.\d*)?)|())$/.test(value)) {
    setState(value);
  }
};

export const checkIfIsValidDecimal = (
  event: { target: { value: any } },
  setState: (arg0: any) => void,
) => {
  const value = event.target.value;
  if (/^(\d+(\.\d*)?)$/.test(value)) {
    setState(value);
  }
};
