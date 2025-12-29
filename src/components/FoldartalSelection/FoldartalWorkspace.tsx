import React, { useState, useEffect } from 'react';
import { Foldartal } from '../../types/foldartal';
import { foldartals } from '../../data/foldartals';
import { FoldartalPlaceholder } from './FoldartalPlaceholder';
import { Dialog } from '../Dialog/Dialog';
import { createDeclaration } from '../../utils/foldartalLogic';
import { createSystemPrompt, createInterpretationPrompt } from '../../utils/prompts';

interface FoldartalWorkspaceProps {
  userName: string;
  initialMessages: any[];
  onSendMessage: (content: string, role?: 'user' | 'system') => void;
  onSendMultipleMessages: (messageList: { role: 'user' | 'system', content: string }[]) => void;
  isLoading: boolean;
  onAbort: () => void;
}

interface StoredDeclaration {
  timestamp: string;
  layoutCipherName: string;
  layoutRhetoric: string;
  sourceCipherName: string;
  sourceRhetoric: string;
}

function FoldartalDisplay({ foldartal, position, animate }: { foldartal: Foldartal; position: 'layout' | 'source'; animate: boolean }) {
  const imagePath = `/asset/foldartals/${foldartal.id}_${foldartal.name}.png`;
  const positionText = position === 'layout' ? '布局' : '本因';

  return (
    <div className={`flex flex-col items-center space-y-2 ${animate ? 'animate-reveal' : ''}`}>
      <div className="relative w-52 h-80 rounded-xl overflow-hidden">
        <img
          src="/asset/卡片背景504x792.jpg"
          alt="卡片背景"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-between p-4 z-10">
          <div className="text-center">
            <p className="text-base text-sammi-snow font-bold">{foldartal.nameRune}</p>
          </div>
          
          <div className="flex items-center justify-center">
            <img
              src={imagePath}
              alt={foldartal.name}
              className="w-28 h-28 object-contain"
            />
          </div>
          
          <div className="text-center space-y-0.5">
            <p className="text-sm text-sammi-snow/70">{foldartal.type} - {foldartal.name}</p>
            <p className="text-xs text-sammi-snow/50 font-mono">{foldartal.nameEn}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FoldartalWorkspace({ userName, initialMessages, onSendMessage, onSendMultipleMessages, isLoading, onAbort }: FoldartalWorkspaceProps) {
  const [selectedLayout, setSelectedLayout] = useState<Foldartal | null>(null);
  const [selectedSource, setSelectedSource] = useState<Foldartal | null>(null);
  const [declared, setDeclared] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [editingUserName, setEditingUserName] = useState(false);
  const [tempUserName, setTempUserName] = useState(userName);
  const [interpretationSent, setInterpretationSent] = useState(false);
  const [storedDeclaration, setStoredDeclaration] = useState<StoredDeclaration | null>(null);

  const layoutFoldartals = foldartals.filter(f => f.category === '布局');
  const sourceFoldartals = foldartals.filter(f => f.category === '本因');

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleLayoutClick = () => {
    const randomIndex = Math.floor(Math.random() * layoutFoldartals.length);
    setSelectedLayout(layoutFoldartals[randomIndex]);
  };

  const handleSourceClick = () => {
    const randomIndex = Math.floor(Math.random() * sourceFoldartals.length);
    setSelectedSource(sourceFoldartals[randomIndex]);
  };

  const handleDeclare = () => {
    if (selectedLayout && selectedSource && !interpretationSent) {
      const declaration = createDeclaration(selectedLayout.id, selectedSource.id);
      
      const timestamp = new Date().toISOString();
      const newStoredDeclaration: StoredDeclaration = {
        timestamp,
        layoutCipherName: selectedLayout.name,
        layoutRhetoric: declaration?.layoutRhetoric || '无',
        sourceCipherName: selectedSource.name,
        sourceRhetoric: declaration?.sourceRhetoric || '无'
      };
      
      const existingDeclarations = JSON.parse(localStorage.getItem('declarations') || '[]');
      existingDeclarations.push(newStoredDeclaration);
      localStorage.setItem('declarations', JSON.stringify(existingDeclarations));
      
      setStoredDeclaration(newStoredDeclaration);
      setDeclared(true);
      setInterpretationSent(true);
      
      const systemPrompt = createSystemPrompt(userName);
      const interpretationPrompt = createInterpretationPrompt(
        userName,
        selectedLayout.name,
        selectedSource.name,
        declaration?.concord || '',
        selectedLayout.god,
        selectedSource.god,
        selectedLayout.motto,
        selectedSource.motto
      );
      
      onSendMultipleMessages([
        { role: 'system', content: systemPrompt.content },
        { role: 'user', content: interpretationPrompt.content }
      ]);
    }
  };

  const handleEditUserName = () => {
    setTempUserName(userName);
    setEditingUserName(true);
  };

  const handleSaveUserName = () => {
    if (tempUserName.trim()) {
      localStorage.setItem('userName', tempUserName.trim());
      setEditingUserName(false);
    }
  };

  const handleCancelUserName = () => {
    setEditingUserName(false);
  };

  const declaration = selectedLayout && selectedSource ? createDeclaration(selectedLayout.id, selectedSource.id) : null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-shrink-0 p-6 relative z-10">
        <img
          src="/asset/布局密文板的背景图形.png"
          alt="布局背景图形"
          className="absolute left-0 top-0 h-full w-1/2 object-contain opacity-50 pointer-events-none z-0"
        />
        <img
          src="/asset/本因密文板的背景图形.png"
          alt="本因背景图形"
          className="absolute right-0 top-0 h-full w-1/2 object-contain opacity-50 pointer-events-none z-0"
        />
        <div className="text-center space-y-3 mb-6">
          <div className="flex items-center justify-center gap-2">
            <p className="text-xl text-sammi-snow/80">欢迎，{userName}</p>
            <button
              onClick={handleEditUserName}
              className="text-sammi-snow/60 hover:text-sammi-glow transition-colors"
              title="修改用户名"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-sammi-glow tracking-wide">密文板占卜</h1>
          <p className="text-sammi-snow/60 text-base">选择布局与本因，揭示命运的启示</p>
        </div>

        {editingUserName && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-sammi-soul/90 p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold text-sammi-snow">修改用户名</h3>
              <input
                type="text"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                className="w-full px-4 py-2 bg-sammi-snow/20 text-sammi-snow rounded-lg focus:outline-none focus:ring-2 focus:ring-sammi-glow"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelUserName}
                  className="px-4 py-2 bg-sammi-snow/20 hover:bg-sammi-snow/30 text-sammi-snow rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveUserName}
                  className="px-4 py-2 bg-sammi-yuan-red hover:bg-sammi-yuan-red/80 text-sammi-ice rounded-lg transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {!declared ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-center items-start gap-20">
              <FoldartalPlaceholder
                type="layout"
                selected={selectedLayout !== null}
                onClick={handleLayoutClick}
              />
              
              <FoldartalPlaceholder
                type="source"
                selected={selectedSource !== null}
                onClick={handleSourceClick}
              />
            </div>

            <button
              onClick={handleDeclare}
              disabled={!selectedLayout || !selectedSource}
              className={`
                px-10 py-4 text-lg font-bold rounded-full transition-all duration-500
                ${!selectedLayout || !selectedSource
                  ? 'bg-sammi-soul/20 text-sammi-snow/30 cursor-not-allowed'
                  : 'bg-sammi-yuan-red hover:bg-sammi-yuan-red/80 text-sammi-ice'
                }
              `}
            >
              开始宣读
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-center items-center gap-8 w-full max-w-4xl">
              {declaration && (
                <>
                  <div className="flex-1 flex justify-end">
                    <div className="text-right space-y-1 max-w-[280px]">
                      <p className="text-sm text-sammi-snow/60 italic leading-relaxed">
                        {declaration.layout.motto}
                      </p>
                    </div>
                  </div>
                  
                  <FoldartalDisplay foldartal={declaration.layout} position="layout" animate={true} />
                  
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="text-center space-y-1">
                      <p className="text-xs text-sammi-snow/70">修辞</p>
                      <p className="text-sm text-sammi-snow">{storedDeclaration?.layoutRhetoric || '无'} · {storedDeclaration?.sourceRhetoric || '无'}</p>
                    </div>
                    
                    <div className="text-center space-y-1">
                      <p className="text-xs text-sammi-glow/70">协语</p>
                      <p className="text-xl font-bold text-sammi-glow">{declaration.concord}</p>
                    </div>

                    {declaration.layout.chant && (
                      <div className="text-center max-w-xs">
                        <p className="text-xs text-sammi-snow/70 leading-relaxed">
                          {declaration.layout.chant}
                        </p>
                      </div>
                    )}

                    {declaration.source.chant && (
                      <div className="text-center max-w-xs">
                        <p className="text-xs text-sammi-snow/70 leading-relaxed">
                          {declaration.source.chant}
                        </p>
                      </div>
                    )}
                  </div>

                  <FoldartalDisplay foldartal={declaration.source} position="source" animate={true} />
                  
                  <div className="flex-1 flex justify-start">
                    <div className="text-left space-y-1 max-w-[280px]">
                      <p className="text-sm text-sammi-snow/60 italic leading-relaxed">
                        {declaration.source.motto}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <Dialog
          messages={messages.filter(m => m.role !== 'system')}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          onAbort={onAbort}
        />
      </div>
    </div>
  );
}
