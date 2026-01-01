import React, { useState, useEffect } from 'react';
import { Foldartal } from '../../types/foldartal';
import { foldartals } from '../../data/foldartals';
import { FoldartalPlaceholder } from './FoldartalPlaceholder';
import { CardFront } from './FoldartalCard';
import { Dialog } from '../Dialog/Dialog';
import { createDeclaration, getConcordType } from '../../utils/foldartalLogic';
import { createSystemPrompt, createInitialInquiryPrompt } from '../../utils/prompts';

interface FoldartalWorkspaceProps {
  userName: string;
  initialMessages: any[];
  onSendMessage: (content: string, role?: 'user' | 'system') => void;
  onSendMultipleMessages: (messageList: { role: 'user' | 'system', content: string, visible?: boolean }[]) => void;
  isLoading: boolean;
}

interface StoredDeclaration {
  timestamp: string;
  layoutCipherName: string;
  layoutRhetoric: string;
  sourceCipherName: string;
  sourceRhetoric: string;
}



export function FoldartalWorkspace({ userName, initialMessages, onSendMessage, onSendMultipleMessages, isLoading }: FoldartalWorkspaceProps) {
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
      const initialInquiryPrompt = createInitialInquiryPrompt(
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
        { role: 'system', content: systemPrompt.content, visible: false },
        { role: 'user', content: initialInquiryPrompt.content, visible: false }
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
    <div className="flex flex-col h-screen overflow-hidden relative">
      <img
        src="/asset/布局密文板的背景图形.png"
        alt="布局背景图形"
        className="absolute left-[12.5%] top-0 w-[25%] h-auto object-contain opacity-50 pointer-events-none z-0"
      />
      <img
        src="/asset/本因密文板的背景图形.png"
        alt="本因背景图形"
        className="absolute left-[62.5%] top-0 w-[25%] h-auto object-contain opacity-50 pointer-events-none z-0"
      />

      <div className="h-[40%] p-6 relative z-10">
        <div className="text-center space-y-3 mb-6">
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold text-sammi-glow tracking-wide">欢迎你，探索者 {userName}</p>
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
        </div>

        {editingUserName && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="ice-glass p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold text-sammi-snow">修改用户名</h3>
              <input
                type="text"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                className="w-full ice-glass px-4 py-2 text-sammi-snow focus:outline-none focus:ring-2 focus:ring-sammi-glow"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelUserName}
                  className="ice-glass px-4 py-2 hover:bg-sammi-snow/30 text-sammi-snow transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveUserName}
                  className="ice-glass px-4 py-2 hover:bg-sammi-yuan-red/80 text-sammi-ice transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {!declared ? (
          <div className="flex justify-center items-center gap-20">
            <FoldartalPlaceholder
              type="layout"
              selected={selectedLayout !== null}
              onClick={handleLayoutClick}
            />

            <button
              onClick={handleDeclare}
              disabled={!selectedLayout || !selectedSource}
              className={`
                px-10 py-4 text-lg font-bold rounded-full transition-all duration-500 relative overflow-hidden
                ${!selectedLayout || !selectedSource
                  ? 'bg-sammi-soul/20 text-sammi-snow/30 cursor-not-allowed'
                  : 'bg-sammi-yuan-red hover:bg-sammi-yuan-red/80 text-sammi-ice'
                }
              `}
              style={{
                backgroundImage: selectedLayout && selectedSource ? 'url(/asset/资料背景素材小图腾1x1.png)' : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <span className="relative z-10">开始宣读</span>
            </button>

            <FoldartalPlaceholder
              type="source"
              selected={selectedSource !== null}
              onClick={handleSourceClick}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-center items-center gap-8 w-full max-w-6xl">
              {declaration && (
                <>
                  <div className="flex-1 flex justify-end">
                    <div className="text-right space-y-1 max-w-lg">
                      <p className="text-sm text-sammi-snow/60 italic leading-relaxed">
                        {declaration.layout.motto}
                      </p>
                    </div>
                  </div>
                  
                  <CardFront foldartal={declaration.layout} position="layout" animate={true} />
                  
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="text-center space-y-1">
                      <p className="text-xs text-sammi-snow/70">修辞</p>
                      <p className="text-sm text-sammi-snow">{storedDeclaration?.layoutRhetoric || '无'} · {storedDeclaration?.sourceRhetoric || '无'}</p>
                    </div>
                    
                    {declaration.concord && declaration.concord !== '无' && (
                      <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-xs text-sammi-glow/70">协语</p>
                          <p className="text-xl font-bold text-sammi-glow">{declaration.concord}</p>
                        </div>
                        {declaration.layout.type !== '世相' && declaration.source.type !== '世相' && (
                          <div className="flex items-center justify-center gap-2">
                            <img
                              src={`/asset/${getConcordType(declaration.layout, declaration.source)}logo1x1.png`}
                              alt={getConcordType(declaration.layout, declaration.source)}
                              className="w-6 h-6 object-contain"
                            />
                            <p className="text-xs text-sammi-snow/60">{getConcordType(declaration.layout, declaration.source)}</p>
                          </div>
                        )}
                      </div>
                    )}

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

                  <CardFront foldartal={declaration.source} position="source" animate={true} />
                  
                  <div className="flex-1 flex justify-start">
                    <div className="text-left space-y-1 max-w-lg">
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

      <div className="flex items-center justify-center py-2">
        <img
          src="/asset/素材横向分割线B423x24.png"
          alt="分隔装饰"
          className="h-4 w-auto object-contain"
        />
      </div>

      <div className="h-[60%] min-h-0 relative z-10">
        <Dialog
          messages={messages.filter(m => m.role !== 'system')}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
