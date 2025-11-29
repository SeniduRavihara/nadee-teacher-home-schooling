'use client';

import CustomDialog, { DialogType } from '@/components/ui/CustomDialog';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface DialogContextType {
  showAlert: (message: string, title?: string) => Promise<void>;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
  showPrompt: (message: string, defaultValue?: string, title?: string) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    type: DialogType;
    title?: string;
    message: string;
    defaultValue?: string;
    resolve: (value?: any) => void;
  } | null>(null);

  const openDialog = useCallback((
    type: DialogType,
    message: string,
    title?: string,
    defaultValue?: string
  ): Promise<any> => {
    return new Promise((resolve) => {
      setConfig({ type, message, title, defaultValue, resolve });
      setIsOpen(true);
    });
  }, []);

  const showAlert = useCallback((message: string, title?: string) => {
    return openDialog('alert', message, title);
  }, [openDialog]);

  const showConfirm = useCallback((message: string, title?: string) => {
    return openDialog('confirm', message, title);
  }, [openDialog]);

  const showPrompt = useCallback((message: string, defaultValue?: string, title?: string) => {
    return openDialog('prompt', message, title, defaultValue);
  }, [openDialog]);

  const handleConfirm = (value?: string) => {
    if (config) {
      if (config.type === 'confirm') {
        config.resolve(true);
      } else if (config.type === 'prompt') {
        config.resolve(value);
      } else {
        config.resolve();
      }
    }
    setIsOpen(false);
    setTimeout(() => setConfig(null), 200); // Clear config after animation
  };

  const handleCancel = () => {
    if (config) {
      if (config.type === 'confirm') {
        config.resolve(false);
      } else if (config.type === 'prompt') {
        config.resolve(null);
      } else {
        config.resolve(); // Alert cancel acts as OK
      }
    }
    setIsOpen(false);
    setTimeout(() => setConfig(null), 200);
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      {config && (
        <CustomDialog
          isOpen={isOpen}
          type={config.type}
          title={config.title}
          message={config.message}
          defaultValue={config.defaultValue}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
