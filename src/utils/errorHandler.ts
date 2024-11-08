import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Serwer odpowiedział kodem statusu poza zakresem 2xx
      const status = error.response.status;
      const data = error.response.data;
      
      // Możesz dostosować komunikaty na podstawie kodu statusu lub danych odpowiedzi
      switch (status) {
        case 400:
          return data.message || 'Nieprawidłowe żądanie.';
        case 401:
          return 'Nieautoryzowany dostęp. Zaloguj się ponownie.';
        case 403:
          return 'Brak uprawnień do wykonania tej operacji.';
        case 404:
          return 'Nie znaleziono żądanego zasobu.';
        case 500:
          return 'Wewnętrzny błąd serwera. Spróbuj ponownie później.';
        default:
          return 'Wystąpił błąd. Spróbuj ponownie.';
      }
    } else if (error.request) {
      // Żądanie zostało wysłane, ale brak odpowiedzi
      return 'Brak odpowiedzi z serwera. Sprawdź swoje połączenie internetowe.';
    } else {
      // Inny błąd związany z konfiguracją żądania
      return error.message || 'Wystąpił problem z żądaniem.';
    }
  } else {
    // Błąd nie związany z Axios
    return 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
  }
};
