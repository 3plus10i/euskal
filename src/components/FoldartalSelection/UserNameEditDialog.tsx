import React, { useState, useEffect } from 'react';

interface UserNameEditDialogProps {
  isOpen: boolean;
  currentUserName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export function UserNameEditDialog({ isOpen, currentUserName, onSave, onCancel }: UserNameEditDialogProps) {
  const [tempUserName, setTempUserName] = useState(currentUserName);

  useEffect(() => {
    if (isOpen) {
      setTempUserName(currentUserName);
    }
  }, [isOpen, currentUserName]);

  const handleSave = () => {
    if (tempUserName.trim()) {
      onSave(tempUserName.trim());
    }
  };

  const handleCancel = () => {
    setTempUserName(currentUserName);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="ice-glass p-6 rounded-xl space-y-4 pointer-events-auto">
        <h3 className="text-lg font-bold text-sammi-snow">修改用户名</h3>
        <input
          type="text"
          value={tempUserName}
          onChange={(e) => setTempUserName(e.target.value)}
          className="w-full ice-glass px-4 py-2 text-sammi-snow focus:outline-none focus:ring-2 focus:ring-sammi-glow"
          autoFocus
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="ice-glass px-4 py-2 hover:bg-sammi-snow/30 text-sammi-snow transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="ice-glass px-4 py-2 hover:bg-sammi-glow-bg/80 text-sammi-glow transition-colors cursor-pointer"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
