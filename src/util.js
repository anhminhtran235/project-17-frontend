export const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const convertBase64ToPythonBase64 = (base64String) => {
  const base64 = base64String.split(',')[1];
  return base64;
};
