import React, { useState, useEffect } from 'react';
import { MenuModal } from './components/Menu/Menu';
import { Footer } from './components/Footer/Footer';
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
  // '/asset/素材背景冰封.jpg'
];

function App() {
  const [debugMode, setDebugMode] = useState(false); // 调试模式开关，开启后静态呈现所有元素

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
  const [isDoubleSociety, setIsDoubleSociety] = useState(false);

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  const handleEnter = () => {
    setStage(AppStage.WORKSPACE);
    const welcomeMessage = {
      role: 'assistant',
      content: createWelcomeMessage(userName),
      timestamp: new Date().toISOString()
    };
    setAllMessages([welcomeMessage]);
    setVisibleMessages([welcomeMessage]);
  };

  const handleSendMessage = (content, role = 'user') => {
    const newMessage = { role, content, timestamp: new Date().toISOString() };
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
        const assistantMsg = { role: 'assistant', content: assistantMessage, timestamp: new Date().toISOString() };
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
        const errorMsg = { role: 'assistant', content: errorMessage, timestamp: new Date().toISOString() };
        setAllMessages([...newAllMessages, errorMsg]);
        setVisibleMessages([...newVisibleMessages, errorMsg]);
      }
    );
  };

  const handleSendMultipleMessages = (messageList: { role: 'user' | 'system' | 'assistant', content: string, visible?: boolean, timestamp?: string }[]) => {
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
        const assistantMsg = { role: 'assistant', content: assistantMessage, timestamp: new Date().toISOString() };
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
        const errorMsg = { role: 'assistant', content: errorMessage, timestamp: new Date().toISOString() };
        setAllMessages([...newAllMessages, errorMsg]);
        setVisibleMessages([...newVisibleMessages, errorMsg]);
      }
    );
  };

  const handleUserNameChange = (newName) => {
    setUserName(newName);
    // 修改用户名后，不要重置对话
    // setStage(AppStage.WORKSPACE);
    // const welcomeMessage = {
    //   role: 'assistant',
    //   content: createWelcomeMessage(newName),
    //   timestamp: new Date().toISOString()
    // };
    // setAllMessages([welcomeMessage]);
    // setVisibleMessages([welcomeMessage]);
  };

  const handleReset = () => {
    const welcomeMessage = {
      role: 'assistant',
      content: createWelcomeMessage(userName),
      timestamp: new Date().toISOString()
    };
    setAllMessages([welcomeMessage]);
    setVisibleMessages([welcomeMessage]);
    setWorkspaceKey(prev => prev + 1);
  };

  return (
    <div className="h-screen overflow-hidden text-sammi-ice"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="h-full flex flex-col bg-gradient-to-b from-sammi-deep/80 to-sammi-bg/90">
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
        <div className="flex flex-col items-center justify-center h-full space-y-8 md:space-y-12 px-4">
          <div className="text-center space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-6xl font-bold text-sammi-glow tracking-wide">远山的密文板占卜小屋</h1>
            <p className="text-sammi-ice/70 text-base md:text-xl max-w-2xl leading-relaxed">
              探索萨米的低语，宣告密文，洞察未来。
            </p>
          </div>

          <div
            onClick={handleEnter}
            className="flex flex-col items-center cursor-pointer brightness-75 transition-all duration-500 hover:-translate-y-2 hover:brightness-110"
          >
            <img
              src="/asset/模组_占卜师旅行套装1x1.png"
              alt="进入"
              className="w-48 h-48 md:w-64 md:h-64 object-contain"
            />
            <span className="text-sammi-ice font-bold text-xl md:text-2xl">进入</span>
          </div>
        </div>
      )}

      {stage === AppStage.WORKSPACE && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <img
            src="/asset/布局密文板的背景图形.png"
            alt="布局背景图形"
            className="absolute left-[5vw] top-0 w-[25%] h-auto object-contain opacity-50 pointer-events-none z-0"
          />
          <img
            src="/asset/本因密文板的背景图形.png"
            alt="本因背景图形"
            className="absolute left-[70vw] top-0 w-[25%] h-auto object-contain opacity-50 pointer-events-none z-0"
          />
          <FoldartalWorkspace
            key={workspaceKey}
            userName={userName}
            initialMessages={visibleMessages}
            onSendMessage={handleSendMessage}
            onSendMultipleMessages={handleSendMultipleMessages}
            isLoading={isLoading}
            isWaitingForResponse={isWaitingForResponse}
            onUserNameChange={setUserName}
            debugMode={debugMode}
            onDoubleSocietyTriggered={() => setIsDoubleSociety(true)}
          />
        </div>
      )}
      </div>
      <Footer
        onAboutClick={() => {
          setMenuTab('about');
          setMenuOpen(true);
        }}
        onSettingsClick={() => {
          setMenuTab('settings');
          setMenuOpen(true);
        }}
        onVersionClick={() => {
          setMenuTab('version');
          setMenuOpen(true);
        }}
      />
    </div>
  );
}

export default App;
