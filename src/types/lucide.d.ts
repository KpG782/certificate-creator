declare global {
  interface Window {
    lucide: {
      createIcons: () => void;
    };
  }

  const lucide: {
    createIcons: () => void;
  };
}

export {};
