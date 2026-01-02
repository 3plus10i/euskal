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
  const [editingTone, setEditingTone] = useState(() => {
    const saved = localStorage.getItem('customTone');
    return saved || '温和、神秘、亲切。';
  });
  const [hasToneChanged, setHasToneChanged] = useState(false);
  const [hasToneFocused, setHasToneFocused] = useState(false);

  const handleSaveName = () => {
    if (editingName.trim()) {
      onUserNameChange(editingName.trim());
      onClose();
    }
  };

  const handleSaveTone = () => {
    if (editingTone.trim()) {
      localStorage.setItem('customTone', editingTone.trim());
      setHasToneChanged(true);
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
            className={`flex-1 px-4 py-4 text-sm font-medium transition-colors duration-500 rounded-l-lg ${
              activeTab === 'about'
                ? 'bg-sammi-glow/20 text-sammi-glow'
                : 'text-sammi-ice/50 hover:text-sammi-ice duration-500'
            }`}
          >
            关于
          </button>
          <button
            onClick={() => onTabChange('version')}
            className={`flex-1 px-4 py-4 text-sm font-medium transition-colors duration-500 ${
              activeTab === 'version'
                ? 'bg-sammi-glow/20 text-sammi-glow'
                : 'text-sammi-ice/50 hover:text-sammi-ice duration-500'
            }`}
          >
            版本历史
          </button>
          <button
            onClick={() => {
              onTabChange('settings');
              setEditingName(userName);
              const savedTone = localStorage.getItem('customTone');
              setEditingTone(savedTone || '温和、神秘、亲切。');
              setHasToneChanged(false);
              setHasToneFocused(false);
            }}
            className={`flex-1 px-4 py-4 text-sm font-medium transition-colors duration-500 rounded-r-lg ${
              activeTab === 'settings'
                ? 'bg-sammi-glow/20 text-sammi-glow'
                : 'text-sammi-ice/50 hover:text-sammi-ice duration-500'
            }`}
          >
            设置
          </button>
        </div>

        <div className="p-2 overflow-y-auto max-h-[60vh]">
          {activeTab === 'about' && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-sammi-glow">关于小屋</h2>
              <p className="text-sammi-ice leading-relaxed">
                『远山的密文板占卜小屋』是基于游戏《明日方舟》集成战略玩法"探索者的银淞止境"中"密文板"的设定创作的神秘学占卜应用。抽取两块密文板，窥探萨米的意志，遵循古老仪式进行密文宣告，然后由占卜师解读密语。
              </p>
              <p className="text-sammi-ice leading-relaxed">
                密文板共43个，每张密文板有类型属性，类型有三大类：族群（红），灵魂（蓝），自然（绿），以及两个特殊类：世相，视相。
                族群、灵魂、自然各有6个布局，7个本因。视相有2个布局（到来和离去）。世相有1个布局1个本因（伤痕和空无）。
              </p>
              <p className="text-sammi-ice leading-relaxed">
                单块密文板无法产生任何效果。必须选择一块布局和一块本因组合成完整密文进行宣告，才能获得神谕。
              </p>
              <p className="text-sammi-ice leading-relaxed">
                密文板还具有如下额外效果：
              </p>
              <p className="text-sammi-ice leading-relaxed">
                <ul className="space-y-2 text-sammi-ice/80 text-base ml-4">
                  <li>• 柯瓦狄协语：同类型密文板组合宣告时，可触发本因密文板的协语效果；</li>
                  <li>• 凯宁嘉修辞：概率附加于任意密文板的额外效果。</li>
                </ul>
              </p>
              {/* 这里增加一条细细的冰色分割线 */}
              <hr className="border-sammi-ice/20" />
              <p className="text-sammi-ice leading-relaxed">
                深入研究：
                <a href="https://prts.wiki/w/探索者的银凇止境/密文板研究" target="_blank" rel="noopener noreferrer" className="text-sammi-glow hover:underline font-light">
                  探索者的银凇止境/密文板研究 - PRTS 
                  <svg className="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </p>
              <p className="text-sammi-ice leading-relaxed">
                关于远山：
                <a href="https://prts.wiki/w/%E8%BF%9C%E5%B1%B1" target="_blank" rel="noopener noreferrer" className="text-sammi-glow hover:underline font-light">
                  远山 - PRTS 
                  <svg className="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </p>
              <p className="text-sammi-ice leading-relaxed">
                项目地址：
                <a href="https://github.com/3plus10i/euskal" target="_blank" rel="noopener noreferrer" className="text-sammi-glow hover:underline font-light">
                    远山的密文板占卜小屋
                    <svg className="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                  
              </p>
            </div>
          )}

          {activeTab === 'version' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-sammi-glow">版本历史</h2>
              
              <div className="space-y-4">
                <div className="border-l-2 border-sammi-glow pl-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-sammi-glow">v1.0</span>
                    <span className="text-sm text-sammi-ice/50">2026-01-02</span>
                  </div>
                  <ul className="space-y-2 text-sammi-ice/80 text-sm">
                    <li>• 远山的密文板占卜小屋初始版本发布！</li>
                    <li>• 实现密文板选择和宣告功能，宣告后远山会主动发起解读。</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-sammi-glow">设置</h2>
              
              <div>
                <label className="block text-base text-sammi-glow/70 mb-3">远山称呼您为...</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="探索者"
                  className="w-full ice-glass px-4 py-2 text-sammi-snow focus:outline-none focus:ring-2 focus:ring-sammi-glow"
                />
              </div>

              <div>
                <label className="block text-base text-sammi-glow/70 mb-3">您希望远山回复您时语气如何？</label>
                <div className="relative">
                  <textarea
                    value={editingTone}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setEditingTone(e.target.value);
                      }
                    }}
                    onFocus={() => setHasToneFocused(true)}
                    placeholder="温和、神秘、亲切。"
                    rows={3}
                    className="w-full ice-glass px-4 py-2 text-sammi-snow focus:outline-none focus:ring-2 focus:ring-sammi-glow resize-none"
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-sammi-ice/40">
                    {100 - editingTone.length}
                  </span>
                </div>
                {(hasToneFocused || hasToneChanged) && (
                  <p className="text-xs text-sammi-ice/50 mt-2">语气修改将在刷新页面后生效</p>
                )}
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
              onClick={() => {
                handleSaveName();
                handleSaveTone();
                onClose();
              }}
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
