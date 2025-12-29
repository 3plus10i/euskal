import React from 'react';

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 p-3 bg-sammi-blue/80 border border-sammi-gold/50 rounded-lg hover:bg-sammi-blue transition-colors"
    >
      <svg
        className="w-6 h-6 text-sammi-gold"
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

export function MenuModal({ isOpen, onClose, activeTab, onTabChange }: {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-sammi-blue border-2 border-sammi-gold/50 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex border-b border-sammi-gold/30">
          <button
            onClick={() => onTabChange('about')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'bg-sammi-gold/20 text-sammi-gold border-b-2 border-sammi-gold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            关于
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-sammi-gold">关于远山的密文板占卜小屋</h2>
              <p className="text-gray-300 leading-relaxed">
                『远山的密文板占卜小屋』是基于游戏《明日方舟》集成战略玩法"探索者的银淞止境"中"密文板"的设定创作的神秘学占卜应用。抽取两块密文板，窥探萨米的意志，遵循古老仪式进行密文宣告，然后由占卜师解读密语。
              </p>
              <p className="text-gray-300 leading-relaxed">
                密文板分为“布局”（艾塔布局）和“本因”（法玛谋篇）两大类。<br />
                单块密文板无法产生任何效果。必须选择一块布局和一块本因组合成完整密文进行宣告，才能获得神谕。<br />
                布局将会指定一个目标，本因将会施行动作。<br />
                密文板还具有如下额外效果：<br />
                - 柯瓦狄协语：在同种密文板（同一分类）组合宣告时，可触发的本因密文板自有的特殊效果；<br />
                - 凯宁嘉修辞：概率触发的附加于任意密文板的额外效果。<br />
              </p>
              <p className="text-gray-300 leading-relaxed">
                深入研究：
                <a href="https://prts.wiki/w/探索者的银凇止境/密文板研究" target="_blank" rel="noopener noreferrer" className="text-sammi-gold hover:underline">
                  探索者的银凇止境/密文板研究 - PRTS
                </a>
              </p>
              <div className="border-t border-sammi-gold/20 pt-4 mt-4">
                <h3 className="text-lg font-bold text-sammi-gold mb-2">版本</h3>
                <p className="text-gray-400">v1.0.0</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-sammi-gold/30 p-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-sammi-gold hover:bg-yellow-600 text-sammi-dark font-bold rounded-lg transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
