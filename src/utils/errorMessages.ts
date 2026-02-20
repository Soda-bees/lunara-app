/**
 * Maps technical error messages to user-friendly messages
 */
export function getUserFriendlyError(error: any): string {
  if (!error) {
    return 'Something went wrong. Please try again.';
  }

  const errorMessage = typeof error === 'string' ? error : error?.message || '';

  // Network errors
  if (
    errorMessage.includes('Network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('timeout')
  ) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Server errors
  if (
    errorMessage.includes('500') ||
    errorMessage.includes('Internal Server Error') ||
    errorMessage.includes('Server error')
  ) {
    return 'The server encountered an error. Please try again in a moment.';
  }

  // Authentication errors
  if (
    errorMessage.includes('401') ||
    errorMessage.includes('Unauthorized') ||
    errorMessage.includes('authentication')
  ) {
    return 'Your session has expired. Please log in again.';
  }

  // Not found errors
  if (
    errorMessage.includes('404') ||
    errorMessage.includes('Not Found') ||
    errorMessage.includes('not found')
  ) {
    return 'The requested information could not be found.';
  }

  // Validation errors
  if (
    errorMessage.includes('400') ||
    errorMessage.includes('Bad Request') ||
    errorMessage.includes('validation') ||
    errorMessage.includes('Invalid')
  ) {
    return 'Invalid request. Please check your input and try again.';
  }

  // Timeout errors
  if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
    return 'The request took too long. Please try again.';
  }

  // Generic fallback
  return errorMessage || 'Something went wrong. Please try again.';
}

/**
 * Gets a user-friendly error message with a retry suggestion
 */
export function getErrorWithRetry(error: any): {
  message: string;
  canRetry: boolean;
} {
  const message = getUserFriendlyError(error);
  const errorMessage = typeof error === 'string' ? error : error?.message || '';

  // Determine if retry is possible
  const canRetry =
    !errorMessage.includes('401') &&
    !errorMessage.includes('403') &&
    !errorMessage.includes('404') &&
    !errorMessage.includes('validation');

  return { message, canRetry };
}

/**
 * Gets a user-friendly error message for specific contexts
 */
export const ErrorMessages = {
  nutrition: {
    loadFailed: 'Unable to load your nutrition plan. Please try again.',
    saveFailed: 'Unable to save your meal selection. Please try again.',
    swapFailed: 'Unable to swap this meal. Please try again.',
    completeFailed: 'Unable to mark this meal as complete. Please try again.',
  },
  workout: {
    loadFailed: 'Unable to load your workout plan. Please try again.',
    logFailed: 'Unable to log your workout. Please try again.',
    contentFailed: 'Unable to load movement content. Please try again.',
  },
  general: {
    networkError: 'Please check your internet connection and try again.',
    serverError: 'The server encountered an error. Please try again later.',
    unknownError: 'Something went wrong. Please try again.',
  },
};
