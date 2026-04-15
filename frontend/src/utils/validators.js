export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const isNotEmpty = (value) => !isEmpty(value);

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const getPasswordStrengthLabel = (strength) => {
  if (strength <= 1) return 'Weak';
  if (strength === 2) return 'Fair';
  if (strength === 3) return 'Good';
  if (strength === 4) return 'Strong';
  return 'Very Strong';
};

export const validatePassword = (password) => {
  const errors = [];
  let strength = 0;

  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required'],
      strength: 0,
      strengthLabel: 'Weak'
    };
  }

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  } else {
    strength += 1;
  }

  if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }

  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

  return {
    isValid: errors.length === 0 && password.length >= 6,
    errors,
    strength: Math.min(strength, 5),
    strengthLabel: getPasswordStrengthLabel(strength)
  };
};

export const validateForgotPasswordForm = (data) => {
  const errors = {};

  if (!data?.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateResetPasswordForm = (data) => {
  const errors = {};

  if (!data?.password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0] || 'Invalid password';
    }
  }

  if (!data?.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const isValidLength = (value, min = 0, max = Infinity) => {
  if (!value || typeof value !== 'string') return min === 0;
  const length = value.trim().length;
  return length >= min && length <= max;
};

export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return false;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

export const isValidProjectKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  const keyRegex = /^[A-Z]{2,10}$/;
  return keyRegex.test(key);
};

export const isValidDate = (date) => {
  if (!date) return false;
  const parsedDate = new Date(date);
  return !Number.isNaN(parsedDate.getTime());
};

export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const phoneRegex = /^[\d\s\-+()]{10,20}$/;
  return phoneRegex.test(phone.trim());
};

export const isAlphaWithSpaces = (value) => {
  if (!value || typeof value !== 'string') return false;
  const alphaRegex = /^[a-zA-Z\s]+$/;
  return alphaRegex.test(value.trim());
};

export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  if (Number.isNaN(num)) return false;
  return num >= min && num <= max;
};