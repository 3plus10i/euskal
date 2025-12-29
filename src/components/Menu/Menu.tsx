import React, { useState } from 'react';

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 p-3 bg-sammi-soul/80 rounded-lg hover:bg-sammi-soul transition-colors shadow-[0_0_20px_rgba(188,237,245,0.2)] hover:shadow-[0_0_30px_rgba(188,237,245,0.4)]"
    >
      <svg
        className="w-6 h-6 text-sammi-glow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}

export function MenuModal({ isOpen, onClose, activeTab, onTabChange, userName, onUserNameChange, onReset }: {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userName: string;
  onUserNameChange: (name: string) => void;
  onReset?: () => void;
}) {
  const [editingName, setEditingName] = useState('');

  const handleSaveName = () => {
    if (editingName.trim()) {
      onUserNameChange(editingName.trim());
      onClose();
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-sammi-deep/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-sammi-soul rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-[0_0_60px_rgba(188,237,245,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex bg-sammi-deep/20">
          <button
            onClick={() => onTabChange('about')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'bg-sammi-glow/20 text-sammi-glow'
                : 'text-sammi-ice/50 hover:text-sammi-ice'
            }`}
          >
            关于
          </button>
          <button
            onClick={() => {
              onTabChange('settings');
              setEditingName(userName);
            }}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-sammi-glow/20 text-sammi-glow'
                : 'text-sammi-ice/50 hover:text-sammi-ice'
            }`}
          >
            设置
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-sammi-glow">关于远山的密文板占卜小屋</h2>
              <p className="text-sammi-ice leading-relaxed">
                『远山的密文板占卜小屋』是基于游戏《明日方舟》集成战略玩法"探索者的银淞止境"中"密文板"的设定创作的神秘学占卜应用。抽取两块密文板，窥探萨米的意志，遵循古老仪式进行密文宣告，然后由占卜师解读密语。
              </p>
              <p className="text-sammi-ice leading-relaxed">
                密文板分为"布局"（艾塔布局）和"本因"（法玛谋篇）两大类。<br />
                单块密文板无法产生任何效果。必须选择一块布局和一块本因组合成完整密文进行宣告，才能获得神谕。<br />
                布局将会指定一个目标，本因将会施行动作。<br />
                密文板还具有如下额外效果：<br />
                - 柯瓦狄协语：在同种密文板（同一分类）组合宣告时，可触发的本因密文板自有的特殊效果；<br />
                - 凯宁嘉修辞：概率触发的附加于任意密文板的额外效果。<br />
              </p>
              <p className="text-sammi-ice leading-relaxed">
                深入研究：
                <a href="https://prts.wiki/w/探索者的银凇止境/密文板研究" target="_blank" rel="noopener noreferrer" className="text-sammi-glow hover:underline">
                  探索者的银凇止境/密文板研究 - PRTS
                </a>
              </p>
              <div className="bg-sammi-deep/20 pt-4 mt-4 rounded-lg">
                <h3 className="text-lg font-bold text-sammi-glow mb-2">版本</h3>
                <p className="text-sammi-ice/60">v1.0.0</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-sammi-glow">设置</h2>
              
              <div>
                <label className="block text-base text-sammi-glow/70 mb-3">修改您的称呼</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="探索者"
                  className="w-full bg-sammi-deep/20 rounded-2xl px-6 py-4 text-sammi-ice placeholder-sammi-glow/50 focus:outline-none transition-shadow"
                />
              </div>

              <div className="bg-sammi-deep/20 pt-4 mt-4 rounded-lg">
                <h3 className="text-lg font-bold text-sammi-glow mb-2">当前称呼</h3>
                <p className="text-sammi-ice">{userName || '未设置'}</p>
              </div>

              {onReset && (
                <div className="bg-sammi-deep/20 pt-4 mt-4 rounded-lg">
                  <h3 className="text-lg font-bold text-sammi-glow mb-2">密文板操作</h3>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-sammi-yuan-red hover:bg-sammi-yuan-red/80 text-sammi-ice font-bold rounded-lg transition-colors shadow-[0_0_20px_rgba(144,45,70,0.3)]"
                  >
                    重新选择密文板
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 bg-sammi-deep/20 p-4">
          {activeTab === 'settings' && (
            <button
              onClick={handleSaveName}
              disabled={!editingName.trim()}
              className="px-6 py-2 bg-sammi-yuan-red hover:bg-sammi-yuan-red/80 text-sammi-ice font-bold rounded-lg transition-colors shadow-[0_0_20px_rgba(144,45,70,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-sammi-soul/30 hover:bg-sammi-soul/50 text-sammi-ice font-bold rounded-lg transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
