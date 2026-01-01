import React, { useState, useEffect } from 'react';
import { MenuButton, MenuModal } from './components/Menu/Menu';
import { FoldartalWorkspace } from './components/FoldartalSelection/FoldartalWorkspace';
import { aiService, Message } from './services/aiService';
import { createWelcomeMessage } from './utils/prompts';

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
    return saved || '';
  });
  const [stage, setStage] = useState(AppStage.GREETING);
  const [allMessages, setAllMessages] = useState([]);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
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
    const welcomeMessage = {
      role: 'assistant',
      content: createWelcomeMessage(userName)
    };
    setAllMessages([welcomeMessage]);
    setVisibleMessages([welcomeMessage]);
  };

  const handleSendMessage = (content, role = 'user') => {
    const newMessage = { role, content };
    const newAllMessages = [...allMessages, newMessage];
    const newVisibleMessages = [...visibleMessages, newMessage];
    setAllMessages(newAllMessages);
    setVisibleMessages(newVisibleMessages);
    setIsLoading(true);
    setIsWaitingForResponse(true);

    let assistantMessage = '';
    let firstChunkReceived = false;
    
    aiService.chat(
      newAllMessages,
      (chunk) => {
        if (!firstChunkReceived) {
          firstChunkReceived = true;
          setIsWaitingForResponse(false);
        }
        assistantMessage += chunk;
        const assistantMsg = { role: 'assistant', content: assistantMessage };
        setAllMessages([...newAllMessages, assistantMsg]);
        setVisibleMessages([...newVisibleMessages, assistantMsg]);
      },
      () => {
        setIsLoading(false);
        setIsWaitingForResponse(false);
      },
      (error) => {
        console.error('AI Error:', error);
        setIsLoading(false);
        setIsWaitingForResponse(false);
        const errorMessage = error.message === '连接超时' ? '连接超时，请稍后再试。' : '抱歉，我无法回应。请稍后再试。';
        const errorMsg = { role: 'assistant', content: errorMessage };
        setAllMessages([...newAllMessages, errorMsg]);
        setVisibleMessages([...newVisibleMessages, errorMsg]);
      }
    );
  };

  const handleSendMultipleMessages = (messageList: { role: 'user' | 'system', content: string, visible?: boolean }[]) => {
    const visibleMsgs = messageList.filter(m => m.visible !== false);
    const newAllMessages = [...allMessages, ...messageList];
    const newVisibleMessages = [...visibleMessages, ...visibleMsgs];
    setAllMessages(newAllMessages);
    setVisibleMessages(newVisibleMessages);
    setIsLoading(true);
    setIsWaitingForResponse(true);

    let assistantMessage = '';
    let firstChunkReceived = false;
    
    aiService.chat(
      newAllMessages,
      (chunk) => {
        if (!firstChunkReceived) {
          firstChunkReceived = true;
          setIsWaitingForResponse(false);
        }
        assistantMessage += chunk;
        const assistantMsg = { role: 'assistant', content: assistantMessage };
        setAllMessages([...newAllMessages, assistantMsg]);
        setVisibleMessages([...newVisibleMessages, assistantMsg]);
      },
      () => {
        setIsLoading(false);
        setIsWaitingForResponse(false);
      },
      (error) => {
        console.error('AI Error:', error);
        setIsLoading(false);
        setIsWaitingForResponse(false);
        const errorMessage = error.message === '连接超时' ? '连接超时，请稍后再试。' : '抱歉，我无法回应。请稍后再试。';
        const errorMsg = { role: 'assistant', content: errorMessage };
        setAllMessages([...newAllMessages, errorMsg]);
        setVisibleMessages([...newVisibleMessages, errorMsg]);
      }
    );
  };

  const handleUserNameChange = (newName) => {
    setUserName(newName);
    setStage(AppStage.WORKSPACE);
    const welcomeMessage = {
      role: 'assistant',
      content: createWelcomeMessage(newName)
    };
    setAllMessages([welcomeMessage]);
    setVisibleMessages([welcomeMessage]);
  };

  const handleReset = () => {
    const welcomeMessage = {
      role: 'assistant',
      content: createWelcomeMessage(userName)
    };
    setAllMessages([welcomeMessage]);
    setVisibleMessages([welcomeMessage]);
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
              与远山一起探索萨米冰原的密文低语，宣告神谕，洞察未来。
            </p>
          </div>

          <div
            onClick={handleEnter}
            className="flex flex-col items-center cursor-pointer brightness-75 transition-all duration-500 hover:-translate-y-2 hover:brightness-110"
          >
            <img
              src="/asset/模组_占卜师旅行套装1x1.png"
              alt="进入"
              className="w-64 h-64 object-contain"
            />
            <span className="text-sammi-ice font-bold text-2xl">进入</span>
          </div>
        </div>
      )}

      {stage === AppStage.WORKSPACE && (
        <FoldartalWorkspace
          key={workspaceKey}
          userName={userName}
          initialMessages={visibleMessages}
          onSendMessage={handleSendMessage}
          onSendMultipleMessages={handleSendMultipleMessages}
          isLoading={isLoading}
          isWaitingForResponse={isWaitingForResponse}
          onUserNameChange={setUserName}
        />
      )}
      </div>
    </div>
  );
}

export default App;
