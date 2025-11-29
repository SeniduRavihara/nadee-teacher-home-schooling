'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type DialogType = 'alert' | 'confirm' | 'prompt';

interface CustomDialogProps {
  isOpen: boolean;
  type: DialogType;
  title?: string;
  message: string;
  defaultValue?: string;
  onConfirm: (value?: string) => void;
  onCancel: () => void;
}

export default function CustomDialog({
  isOpen,
  type,
  title,
  message,
  defaultValue = '',
  onConfirm,
  onCancel,
}: CustomDialogProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue);
      // Focus input if prompt
      if (type === 'prompt') {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [isOpen, defaultValue, type]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'prompt') {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title || (type === 'alert' ? 'Alert' : type === 'confirm' ? 'Confirm' : 'Input Required')}
        </h3>
        
        <p className="text-gray-600 mb-6 whitespace-pre-wrap">{message}</p>

        {type === 'prompt' && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-6"
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          />
        )}

        <div className="flex justify-end gap-3">
          {type !== 'alert' && (
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            {type === 'alert' ? 'OK' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
