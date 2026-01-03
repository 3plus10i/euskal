import React, { useState } from 'react';

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
        className="ice-glass p-6 rounded-xl pointer-events-auto w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex bg-sammi-deep/20 rounded-lg mb-4">
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

        <div className="p-2 overflow-y-auto flex-1 min-h-0">
          {activeTab === 'about' && (
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-sammi-glow">快速开始</h2>
              <p className="text-sammi-ice leading-relaxed">
                点击两张密文板卡片，并点击开始宣告，即可获得占卜结果。跟随占卜师的指引，解读密文板的神谕。
              </p>
              <p className="text-sammi-ice leading-relaxed">
                如对话区域不够用，可以点击水平分界线扩展对话区域。
              </p>
              <hr className="border-sammi-ice/20 !my-4" />

              <h2 className="text-xl font-bold text-sammi-glow">背景介绍</h2>
              <p className="text-sammi-ice leading-relaxed">
                『远山的密文板占卜小屋』是基于游戏《明日方舟》集成战略玩法"探索者的银淞止境"中"密文板"的设定创作的神秘学占卜应用。抽取两块密文板，窥探萨米的意志，遵循古老仪式进行密文宣告，然后由占卜师解读密语。
              </p>
              <p className="text-sammi-ice leading-relaxed">
                密文板共四十三块，分本因、布局两种和族群、灵魂、自然三类。萨米人将本因和布局两块密文板组合宣告，以聆听萨米意志的指引。宣告时可能触发“协语”和“修辞”的附加效果。
              </p>
              <p className="text-sammi-ice leading-relaxed">
                有时会抽到视相类布局密文板，它可以与任何布局结合。而更罕见的“世相”密文板，甚至可能具有超越萨米的寓意……
              </p>
              <hr className="border-sammi-ice/20 !my-4" />
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
                  {(() => {
                    const today = new Date();
                    return today.getMonth() === 0 && today.getDate() === 15;
                  })() && (
                    <span className="text-sammi-glow italic">（今天是远山的生日哦！）</span>
                  )}
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
              <p className="text-sammi-ice leading-relaxed">
                主站：
                <a href="https://3plus10i.top" target="_blank" rel="noopener noreferrer" className="text-sammi-glow hover:underline font-light">
                    3plus10i.top
                    <svg className="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                  
              </p>
            </div>
          )}

          {activeTab === 'version' && (
            <div className="space-y-6">
              {/* <h2 className="text-xl font-bold text-sammi-glow">版本历史</h2> */}
              
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

              <div className="space-y-4">
                <div className="border-l-2 border-sammi-glow pl-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-sammi-glow">v1.1</span>
                  </div>
                  <ul className="space-y-2 text-sammi-ice/80 text-sm">
                    <li>• 移动端适配初步完成</li>
                    <li>• 优化用户界面和交互体验</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-2 border-sammi-glow pl-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-sammi-glow">v1.2</span>
                  </div>
                  <ul className="space-y-2 text-sammi-ice/80 text-sm">
                    <li>• 吐血优化移动端样式</li>
                    <li>• 优化界面设计和交互</li>
                    <li>• 修复已知问题和bug</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-2 border-sammi-glow pl-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-sammi-glow">v1.3</span>
                  </div>
                  <ul className="space-y-2 text-sammi-ice/80 text-sm">
                    <li>• 进一步优化页面样式和交互</li>
                    <li>• 修复一些已知问题</li>
                    <li>• 为【数据删除】赋予访问权限</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-2 border-sammi-glow pl-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-sammi-glow">未来版本计划</span>
                  </div>
                  <ul className="space-y-2 text-sammi-ice/80 text-sm">
                    <li>• TODO：密文板价值和源石锭系统</li>
                    <li>• TODO：结果生成与图片分享系统</li>
                    <li>• TODO：最近宣告密文板记录</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* <h2 className="text-2xl font-bold text-sammi-glow">设置</h2> */}
              <div>
                <label className="block text-base text-sammi-glow/70 mb-3">您希望远山称呼您为...</label>
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
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-sammi-ice/20">
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
