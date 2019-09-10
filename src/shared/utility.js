export const updateObject = (oldObject, updatedProps) => {
  return {
    ...oldObject,
    ...updatedProps,
  }
};

export const validateInput = (key, value, rules) => {
  let isValid = true;
  let errorMessage = '';

  if (isValid && rules.required) {
    isValid = value.trim() !== '';
    errorMessage = `${key} is required.`;
  }

  if (isValid && rules.minLength) {
    isValid = value.trim().length >= rules.minLength;
    errorMessage = `${key} needs to be at least ${rules.minLength} characters.`
  }

  if (isValid && rules.maxLength) {
    isValid = value.trim().length <= rules.maxLength;
    errorMessage = `${key} cannot be more than ${rules.maxLength} characters.`
  }

  if (isValid && rules.isEmail) {
    const pattern = /^(?=[A-Z0-9][A-Z0-9@._%+-]{5,253}$)[A-Z0-9._%+-]{1,64}@(?:(?=[A-Z0-9-]{1,63}\.)[A-Z0-9]+(?:-[A-Z0-9]+)*\.){1,8}[A-Z]{2,63}$/;
    isValid = pattern.test(value.toUpperCase());
    errorMessage = `${key} must be a valid email address`;
  }

  if (isValid && rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value);
    errorMessage = `${key} is a numeric value.`;
  }

  return { isValid, errorMessage };
};
