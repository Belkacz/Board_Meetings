export function promiseData(data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data) {
        console.log("Promisa odebrała dane:")
        console.log(data)
        resolve();
      } else {
        reject('Błąd: Brak danych do przetworzenia');
      }
    }, 2000);
  });
}