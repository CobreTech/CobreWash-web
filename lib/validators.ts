export function cleanRut(value: string): string {
  return value.replace(/[^0-9kK]/g, "").toUpperCase();
}

function computeCheckDigit(body: string): string {
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return "0";
  if (remainder === 10) return "K";
  return String(remainder);
}

export function formatRut(value: string): string {
  const clean = cleanRut(value).slice(0, 9);
  if (!clean) return "";
  if (clean.length === 1) return clean;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const reversedDigits = body.split("").reverse();
  const groupedReversed = reversedDigits.reduce<string[]>((acc, digit, idx) => {
    if (idx > 0 && idx % 3 === 0) acc.push(".");
    acc.push(digit);
    return acc;
  }, []);

  return `${groupedReversed.reverse().join("")}-${dv}`;
}

export function isValidRut(value: string): boolean {
  const clean = cleanRut(value);
  if (clean.length < 2) return false;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if (!/^\d+$/.test(body)) return false;

  return computeCheckDigit(body) === dv;
}

export interface PasswordCheck {
  valid: boolean;
  message: string;
}

export function validatePassword(password: string): PasswordCheck {
  if (password.length < 6) return { valid: false, message: "Mínimo 6 caracteres" };
  if (!/[a-zA-Z]/.test(password)) return { valid: false, message: "Debe incluir al menos una letra" };
  if (!/[0-9]/.test(password)) return { valid: false, message: "Debe incluir al menos un número" };
  return { valid: true, message: "Contraseña válida" };
}
