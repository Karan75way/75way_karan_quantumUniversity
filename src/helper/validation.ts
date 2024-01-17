const validator = {
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateMobileNumber: (mobile: string): boolean => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  },

  validatePasswordStrength: (password: string): { error?: string } => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return {
        error:
          "Weak password. It must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number.",
      };
    }
    return {};
  },
};

export default validator;
