import React, { useState, useEffect } from 'react';
import { MenuButton, MenuModal } from './components/Menu/Menu';
import { FoldartalWorkspace } from './components/FoldartalSelection/FoldartalWorkspace';
import { aiService, Message } from './services/aiService';

const AppStage = {
  GREETING: 'greeting',
  WORKSPACE: 'workspace'
};

const backgroundImages = [
  // '/asset/素材背景联合工程.png',
  '/asset/素材背景探索者.png',
  '/asset/素材背景无暇原野.png',
  '/asset/素材背景等待土壤的花.png',
  '/asset/素材背景向大地回答.png',
  '/asset/素材背景银白梦境.png',
  '/asset/素材背景灼热异常的预兆.png',
  '/asset/素材背景流浪的占卜者.png',
  '/asset/素材背景未知地标.png',
  '/asset/素材背景温泉木屋.png',
  '/asset/素材背景被遗忘的银白.png',
  '/asset/素材背景群山之间.png',
  '/asset/素材背景远山极光.jpg',
  '/asset/素材背景冰封.jpg'
];

function App() {
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem('userName');
    return saved || '探索者';
  });
  const [stage, setStage] = useState(AppStage.GREETING);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState('about');
  const [workspaceKey, setWorkspaceKey] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(() => {
    return backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  });

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  const handleEnter = () => {
    setStage(AppStage.WORKSPACE);
  };

  const handleSendMessage = (content, role = 'user') => {
    const newMessages = [...messages, { role, content }];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setIsLoading(true);

    let assistantMessage = '';
    
    aiService.chat(
      newMessages,
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
        const errorMessage = error.message === '连接超时' ? '连接超时，请稍后再试。' : '抱歉，我无法回应。请稍后再试。';
        setMessages([...newMessages, { role: 'assistant', content: errorMessage }]);
      }
    );
  };

  const handleSendMultipleMessages = (messageList: { role: 'user' | 'system', content: string, visible?: boolean }[]) => {
    const visibleMessages = messageList.filter(m => m.visible !== false);
    const newMessages = [...messages, ...visibleMessages];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setIsLoading(true);

    let assistantMessage = '';
    
    aiService.chat(
      messageList,
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
        const errorMessage = error.message === '连接超时' ? '连接超时，请稍后再试。' : '抱歉，我无法回应。请稍后再试。';
        setMessages([...newMessages, { role: 'assistant', content: errorMessage }]);
      }
    );
  };

  const handleUserNameChange = (newName) => {
    setUserName(newName);
    setStage(AppStage.WORKSPACE);
    setMessages([]);
  };

  const handleReset = () => {
    setMessages([]);
    setWorkspaceKey(prev => prev + 1);
  };

  return (
    <div 
      className="min-h-screen text-sammi-ice"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-sammi-deep/80 to-sammi-bg/90">
        <MenuButton onClick={() => setMenuOpen(true)} />

      <MenuModal
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeTab={menuTab}
        onTabChange={setMenuTab}
        userName={userName}
        onUserNameChange={handleUserNameChange}
        onReset={handleReset}
      />

      {stage === AppStage.GREETING && (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold text-sammi-glow tracking-wide">远山的密文板占卜小屋</h1>
            <p className="text-sammi-ice/70 text-xl max-w-2xl leading-relaxed">
              来自萨米的埃拉菲亚女祭司"远山"，带来北方冰原的神秘箴言，帮助您探索命运的低语。
            </p>
          </div>

          <button
            onClick={handleEnter}
            className="px-8 py-4 bg-sammi-yuan-red hover:bg-sammi-yuan-red/80 text-sammi-ice font-bold text-xl rounded-full transition-all"
          >
            进入
          </button>
        </div>
      )}

      {stage === AppStage.WORKSPACE && (
        <FoldartalWorkspace
          key={workspaceKey}
          userName={userName}
          initialMessages={messages}
          onSendMessage={handleSendMessage}
          onSendMultipleMessages={handleSendMultipleMessages}
          isLoading={isLoading}
        />
      )}
      </div>
    </div>
  );
}

export default App;
