// src/modules/auth/services/register.js
export const registerUser = async (username, email, role, password, confirmPassword) => {
  const res = await fetch('api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, role, password, confirmPassword }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    return { data: null, error: errorData };
  }

  const data = await res.json();
  return { data, error: null };
};
