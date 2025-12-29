import React, { useState, useEffect } from 'react';
import { Dialog } from './components/Dialog/Dialog';
import { FoldartalSelection } from './components/FoldartalSelection/FoldartalSelection';
import { FoldartalDeclaration } from './components/FoldartalDeclaration/FoldartalDeclaration';
import { MenuButton, MenuModal } from './components/Menu/Menu';
import { aiService } from './services/aiService';
import { Message } from './services/aiService';
import { createSystemPrompt, createInterpretationPrompt, createFollowUpQuestionPrompt } from './utils/prompts';
import { foldartals } from './data/foldartals';
import { createDeclaration } from './utils/foldartalLogic';
import { Foldartal } from './types/foldartal';

const AppStage = {
  GREETING: 'greeting',
  SELECTION: 'selection',
  DECLARATION: 'declaration',
  DIALOG: 'dialog'
};

function App() {
  const [userName, setUserName] = useState('');
  const [stage, setStage] = useState(AppStage.GREETING);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState('about');
  const [selectedFoldartals, setSelectedFoldartals] = useState(null);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setStage(AppStage.SELECTION);
    }
  };

  const handleFoldartalSelect = (layout, source) => {
    const declaration = createDeclaration(layout, source);

    if (!declaration) {
      alert('密文板组合无效，请重新选择');
      return;
    }

    setSelectedFoldartals({
      layout,
      source,
      layoutData: declaration.layout,
      sourceData: declaration.source,
      concord: declaration.concord
    });
    setStage(AppStage.DECLARATION);
  };

  const handleDeclarationContinue = () => {
    if (!selectedFoldartals) return;

    const systemPrompt = createSystemPrompt(userName);
    const interpretationPrompt = createInterpretationPrompt(
      userName,
      selectedFoldartals.layoutData.name,
      selectedFoldartals.sourceData.name,
      selectedFoldartals.concord,
      selectedFoldartals.layoutData.god,
      selectedFoldartals.sourceData.god,
      selectedFoldartals.layoutData.motto,
      selectedFoldartals.sourceData.motto
    );

    setMessages([systemPrompt, interpretationPrompt]);
    setStage(AppStage.DIALOG);

    setTimeout(() => {
      handleAIResponse([systemPrompt, interpretationPrompt]);
    }, 100);
  };

  const handleSendMessage = (content) => {
    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    handleAIResponse(newMessages);
  };

  const handleAIResponse = async (currentMessages) => {
    setIsLoading(true);

    let assistantMessage = '';
    const newMessages = [...currentMessages];

    try {
      await aiService.chat(
        currentMessages,
        (chunk) => {
          assistantMessage += chunk;
          setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
        },
        () => {
          setIsLoading(false);
        },
        (error) => {
          console.error('AI Error:', error);
          setIsLoading(false);
          setMessages([...newMessages, { role: 'assistant', content: '抱歉，我无法回应。请稍后再试。' }]);
        }
      );
    } catch (error) {
      console.error('AI Error:', error);
      setIsLoading(false);
    }
  };

  const handleAbort = () => {
    aiService.abort();
    setIsLoading(false);
  };

  const handleReset = () => {
    setStage(AppStage.SELECTION);
    setMessages([]);
    setSelectedFoldartals(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sammi-dark to-gray-900 text-white">
      <MenuButton onClick={() => setMenuOpen(true)} />

      <MenuModal
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeTab={menuTab}
        onTabChange={setMenuTab}
      />

      <div className="container mx-auto p-4 max-w-7xl">
        {stage === AppStage.GREETING && (
          <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-sammi-gold mb-4">远山的密文板占卜小屋</h1>
              <p className="text-gray-500 max-w-md mx-auto">
                来自萨米的埃拉菲亚女祭司"远山"，带来北方冰原的神秘箴言，帮助您探索命运的低语。
              </p>
            </div>

            <form onSubmit={handleNameSubmit} className="w-full max-w-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">请输入您的称呼</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="探索者"
                    className="w-full bg-sammi-blue/50 border border-sammi-gold/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-sammi-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!userName.trim()}
                  className="w-full px-8 py-4 bg-sammi-gold hover:bg-yellow-600 text-sammi-dark font-bold text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  进入
                </button>
              </div>
            </form>
          </div>
        )}

        {stage === AppStage.SELECTION && (
          <div className="py-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-sammi-gold">选择密文板</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-sammi-blue/50 border border-sammi-gold/30 rounded-lg hover:bg-sammi-blue/70 transition-colors"
              >
                返回
              </button>
            </div>
            <FoldartalSelection onConfirm={handleFoldartalSelect} />
          </div>
        )}

        {stage === AppStage.DECLARATION && selectedFoldartals && (
          <div className="py-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-sammi-gold">密文板宣告</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-sammi-blue/50 border border-sammi-gold/30 rounded-lg hover:bg-sammi-blue/70 transition-colors"
              >
                返回
              </button>
            </div>
            <FoldartalDeclaration
              layout={selectedFoldartals.layoutData}
              source={selectedFoldartals.sourceData}
              concord={selectedFoldartals.concord}
              onContinue={handleDeclarationContinue}
            />
          </div>
        )}

        {stage === AppStage.DIALOG && (
          <div className="py-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-sammi-gold">与远山对话</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-sammi-blue/50 border border-sammi-gold/30 rounded-lg hover:bg-sammi-blue/70 transition-colors"
              >
                重新开始
              </button>
            </div>
            <Dialog
              messages={messages.filter(m => m.role !== 'system')}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onAbort={handleAbort}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
