export const resizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = 300;
          canvas.height = 300;
          ctx?.drawImage(img, 0, 0, 300, 300);
          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob!], file.name, {
                type: file.type,
              });
              resolve(resizedFile);
            },
            file.type,
            1
          );
        };
        img.src = event.target.result as string;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };