import React, { useState } from 'react';

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 p-3 ice-glass hover:bg-sammi-snow/30 transition-colors cursor-pointer"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="ice-glass p-6 rounded-xl space-y-4 pointer-events-auto w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex bg-sammi-deep/20 rounded-lg">
          <button
            onClick={() => onTabChange('about')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors rounded-l-lg ${
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
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors rounded-r-lg ${
              activeTab === 'settings'
                ? 'bg-sammi-glow/20 text-sammi-glow'
                : 'text-sammi-ice/50 hover:text-sammi-ice'
            }`}
          >
            设置
          </button>
        </div>

        <div className="p-2 overflow-y-auto max-h-[60vh]">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-sammi-glow">关于小屋</h2>
              <p className="text-sammi-ice leading-relaxed">
                『远山的密文板占卜小屋』是基于游戏《明日方舟》集成战略玩法"探索者的银淞止境"中"密文板"的设定创作的神秘学占卜应用。抽取两块密文板，窥探萨米的意志，遵循古老仪式进行密文宣告，然后由占卜师解读密语。
              </p>
              <p className="text-sammi-ice leading-relaxed">
                密文板共43个，每张密文板有类型属性，类型有三大类：族群（红），灵魂（蓝），自然（绿），以及两个特殊类：世相，视相。
  族群、灵魂、自然各有6个布局，7个本因。视相有2个布局（到来和离去）。世相有1个布局1个本因（伤痕和空无）。<br />
                单块密文板无法产生任何效果。必须选择一块布局和一块本因组合成完整密文进行宣告，才能获得神谕。<br />
                密文板还具有如下额外效果：<br />
                    -  柯瓦狄协语：在同类型密文板组合宣告时，可触发的本因密文板自有的特殊协语效果；<br />
                    -  凯宁嘉修辞：概率触发的附加于任意密文板的额外效果。
                    <br />
              </p>
              <p className="text-sammi-ice leading-relaxed">
                深入研究：
                <a href="https://prts.wiki/w/探索者的银凇止境/密文板研究" target="_blank" rel="noopener noreferrer" className="text-sammi-glow hover:underline">
                  探索者的银凇止境/密文板研究 - PRTS
                </a>
              </p>
              <p className="text-sammi-ice leading-relaxed">
                关于远山：
                <a href="https://prts.wiki/w/%E8%BF%9C%E5%B1%B1" target="_blank" rel="noopener noreferrer" className="text-sammi-glow hover:underline">
                  远山 - PRTS
                </a>
              </p>
              <h3 className="text-lg font-bold text-sammi-glow mb-2">版本</h3>
              <p className="text-sammi-ice/60">v1.0.0</p>
              <h3 className="text-lg font-bold text-sammi-glow mb-2">项目</h3>
              <a href="https://github.com/3plus10i/euskal" target="_blank" rel="noopener noreferrer" className="text-sammi-glow hover:underline">
                  远山的密文板占卜小屋
                </a>
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
                  className="w-full ice-glass px-4 py-2 text-sammi-snow focus:outline-none focus:ring-2 focus:ring-sammi-glow"
                />
              </div>

              {/* {onReset && (
                <div className="ice-glass pt-4 mt-4">
                  <h3 className="text-lg font-bold text-sammi-glow mb-2">密文板操作</h3>
                  <button
                    onClick={handleReset}
                    className="ice-glass px-4 py-2 hover:bg-sammi-glow-bg/80 text-sammi-glow transition-colors cursor-pointer"
                  >
                    重新选择密文板
                  </button>
                </div>
              )} */}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          {activeTab === 'settings' && (
            <button
              onClick={handleSaveName}
              disabled={!editingName.trim()}
              className="ice-glass px-4 py-2 hover:bg-sammi-glow-bg/80 text-sammi-glow transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存
            </button>
          )}
          <button
            onClick={onClose}
            className="ice-glass px-4 py-2 hover:bg-sammi-snow/30 text-sammi-snow transition-colors cursor-pointer"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
