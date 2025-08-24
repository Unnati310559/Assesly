
import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from './icons';

interface CopyButtonProps {
  textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center space-x-2 ${
        copied
          ? 'bg-green-600 text-white'
          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
      }`}
      disabled={!textToCopy}
    >
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <ClipboardIcon className="w-4 h-4" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};