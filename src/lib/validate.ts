import 'server-only';

const MAX_PAYLOAD_SIZE = 500_000; // 500KB

export function validatePayload(
  data: unknown,
  type: 'object' | 'array'
): string | null {
  if (data === null || data === undefined) {
    return 'Payload cannot be empty';
  }

  if (typeof data !== 'object') {
    return 'Payload must be an object or array';
  }

  if (type === 'object' && Array.isArray(data)) {
    return 'Payload must be an object, not an array';
  }

  if (type === 'array' && !Array.isArray(data)) {
    return 'Payload must be an array';
  }

  const size = JSON.stringify(data).length;
  if (size > MAX_PAYLOAD_SIZE) {
    return 'Payload too large';
  }

  return null;
}
