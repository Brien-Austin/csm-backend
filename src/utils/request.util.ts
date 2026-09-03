export function extractSingleStringParam(parameterValue: unknown): string {
  const isArrayValue = Array.isArray(parameterValue);
  if (isArrayValue) {
    const firstElement = parameterValue[0];
    return String(firstElement || '');
  }
  const isMissingValue = parameterValue === undefined || parameterValue === null;
  if (isMissingValue) {
    return '';
  }
  return String(parameterValue);
}

export function extractOptionalStringParam(parameterValue: unknown): string | undefined {
  const extractedString = extractSingleStringParam(parameterValue);
  const isEmptyString = extractedString === '';
  if (isEmptyString) {
    return undefined;
  }
  return extractedString;
}
