import React, { useState, useEffect } from 'react';
import { Foldartal } from '../../types/foldartal';
import { foldartals } from '../../data/foldartals';
import { FoldartalPlaceholder } from './FoldartalPlaceholder';
import { CardFront } from './FoldartalCard';
import { Dialog } from '../Dialog/Dialog';
import { UserNameEditDialog } from './UserNameEditDialog';
import { createDeclaration, getConcordType } from '../../utils/foldartalLogic';
import { createSystemPrompt, createInitialInquiryPrompt } from '../../utils/prompts';

interface FoldartalWorkspaceProps {
  userName: string;
  initialMessages: any[];
  onSendMessage: (content: string, role?: 'user' | 'system') => void;
  onSendMultipleMessages: (messageList: { role: 'user' | 'system' | 'assistant', content: string, visible?: boolean }[]) => void;
  isLoading: boolean;
  isWaitingForResponse: boolean;
  onUserNameChange: (newName: string) => void;
}

interface StoredDeclaration {
  timestamp: string;
  layoutCipherName: string;
  layoutRhetoric: string | null;
  sourceCipherName: string;
  sourceRhetoric: string | null;
}



export function FoldartalWorkspace({ userName, initialMessages, onSendMessage, onSendMultipleMessages, isLoading, isWaitingForResponse, onUserNameChange }: FoldartalWorkspaceProps) {
  const [selectedLayout, setSelectedLayout] = useState<Foldartal | null>(null);
  const [selectedSource, setSelectedSource] = useState<Foldartal | null>(null);
  const [declared, setDeclared] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [editingUserName, setEditingUserName] = useState(false);
  const [interpretationSent, setInterpretationSent] = useState(false);
  const [storedDeclaration, setStoredDeclaration] = useState<StoredDeclaration | null>(null);

  const layoutFoldartals = foldartals.filter(f => f.category === '布局');
  const sourceFoldartals = foldartals.filter(f => f.category === '本因');

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleLayoutClick = () => {
    if (selectedLayout) {
      setSelectedLayout(null);
    } else {
      let availableLayouts = layoutFoldartals;
      
      if (selectedSource) {
        if (selectedSource.type === '世相') {
          availableLayouts = layoutFoldartals.filter(f => f.type === '世相');
        } else {
          availableLayouts = layoutFoldartals.filter(f => f.type !== '世相');
        }
      }
      
      const randomIndex = Math.floor(Math.random() * availableLayouts.length);
      setSelectedLayout(availableLayouts[randomIndex]);
    }
  };

  const handleSourceClick = () => {
    if (selectedSource) {
      setSelectedSource(null);
    } else {
      let availableSources = sourceFoldartals;
      
      if (selectedLayout) {
        if (selectedLayout.type === '世相') {
          availableSources = sourceFoldartals.filter(f => f.type === '世相');
        } else {
          availableSources = sourceFoldartals.filter(f => f.type !== '世相');
        }
      }
      
      const randomIndex = Math.floor(Math.random() * availableSources.length);
      setSelectedSource(availableSources[randomIndex]);
    }
  };

  const handleDeclare = () => {
    if (selectedLayout && selectedSource && !interpretationSent) {
      const declaration = createDeclaration(selectedLayout.id, selectedSource.id);
      
      const timestamp = new Date().toISOString();
      const newStoredDeclaration: StoredDeclaration = {
        timestamp,
        layoutCipherName: selectedLayout.name,
        layoutRhetoric: declaration?.layoutRhetoric || null,
        sourceCipherName: selectedSource.name,
        sourceRhetoric: declaration?.sourceRhetoric || null
      };
      
      const existingDeclarations = JSON.parse(localStorage.getItem('declarations') || '[]');
      existingDeclarations.push(newStoredDeclaration);
      localStorage.setItem('declarations', JSON.stringify(existingDeclarations));
      
      setStoredDeclaration(newStoredDeclaration);
      setDeclared(true);
      setInterpretationSent(true);
      
      const customTone = localStorage.getItem('customTone');
      const systemPrompt = createSystemPrompt(userName, customTone);
      const initialInquiryPrompt = createInitialInquiryPrompt(
        userName,
        selectedLayout.name,
        selectedSource.name,
        declaration?.concord || '',
        selectedLayout.god,
        selectedSource.god,
        selectedLayout.motto,
        selectedSource.motto,
        selectedLayout.type,
        selectedSource.type,
        selectedLayout.chant,
        selectedSource.chant,
        selectedLayout.explaination || '',
        selectedSource.explaination || ''
      );
      
      onSendMultipleMessages([
        { role: 'system', content: systemPrompt.content, visible: false },
        { role: 'assistant', content: initialMessages[0]?.content || '', visible: false },
        { role: 'user', content: initialInquiryPrompt.content, visible: false }
      ]);
    }
  };

  const handleEditUserName = () => {
    setEditingUserName(true);
  };

  const handleSaveUserName = (newName: string) => {
    localStorage.setItem('userName', newName);
    onUserNameChange(newName);
    setEditingUserName(false);
  };

  const handleCancelUserName = () => {
    setEditingUserName(false);
  };

  const declaration = selectedLayout && selectedSource ? createDeclaration(selectedLayout.id, selectedSource.id) : null;

  const getFlairEffect = (flairName: string | null): string => {
    if (!flairName) return '';
    const flairMap: Record<string, string> = {
      '延续': '对布局造成"重复"的作用',
      '自足': '对协语造成"强化"的作用',
      '循环': '对协语造成"自指"的作用',
      '广阔': '对布局造成"扩散"的作用'
    };
    return flairMap[flairName] || '';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      {/* 布局密文板的背景图形 */}
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
      {/* 用户名显示区域 */}
      {/* <div className="text-center space-y-3 mb-6 mt-6">
        <div className="flex items-center justify-center gap-2">
          <p className="text-2xl font-bold text-sammi-glow tracking-wide">欢迎，探索者 {userName}</p>
          <button
            onClick={handleEditUserName}
            className="text-sammi-snow/60 hover:text-sammi-glow transition-colors"
            title="你的名字是..."
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
          </button>
        </div>
      </div> */}
      <div className="h-[40%] p-6 relative z-10">
        {!declared ? (
          // 布局密文板和本因密文板的选择区域
          <div className="flex justify-center items-center gap-8 h-full">
            {/* 布局密文板选择区域 */}
            <FoldartalPlaceholder
              type="layout"
              selected={selectedLayout !== null}
              onClick={handleLayoutClick}
            />

            {/* 中间的开始宣告按钮 */}
            <div
              onClick={handleDeclare}
              className={`
                relative w-full max-w-[256px] aspect-[4/3] cursor-pointer transition-all duration-500
                ${!selectedLayout || !selectedSource
                  ? 'opacity-30 cursor-not-allowed'
                  : 'opacity-100 hover:-translate-y-2 hover:brightness-110'
                }
              `}
            >
              <img
                src="/asset/资料背景素材小图腾圆形1x1.png"
                alt="开始宣告"
                className="w-full h-full object-contain"
              />
              <span className="absolute inset-0 flex items-center justify-center text-sammi-ice font-bold text-[clamp(16px,2vw,32px)]">
                {selectedLayout && selectedSource ? '开始宣告' : '请选择密文板'}
              </span>
            </div>

            {/* 本因密文板选择区域 */}
            <FoldartalPlaceholder
              type="source"
              selected={selectedSource !== null}
              onClick={handleSourceClick}
            />
          </div>
        ) : (
          // 宣告后的 布局密文板和本因密文板的显示区域
          <div className="flex flex-col items-center h-full justify-center">
            <div className="flex justify-center items-center gap-4 w-full h-full max-w-[100rem] px-4">
              
              {declaration && (
                <>
                  <div className="flex-1 flex justify-end items-center">
                    <div className="text-right space-y-1 max-w-lg px-2">
                      <p className="text-[clamp(12px,1.5vw,16px)] text-sammi-snow/80 italic leading-relaxed">
                        {declaration.layout.motto}
                      </p>
                    </div>
                  </div>
                  
                  <CardFront foldartal={declaration.layout} position="layout" animate={true} />
                  
                  <div className="flex flex-col items-center justify-center space-y-2 h-full">
                    <div className="mb-4">
                      {declaration.layout.chant && (
                        <div className="text-center max-w-xs">
                          <p className="text-[clamp(12px,1.5vw,16px)] italic text-emphasis leading-relaxed font-serif-message">
                            {declaration.layout.chant}
                          </p>
                        </div>
                      )}

                      {declaration.source.chant && (
                        <div className="text-center max-w-xs">
                          <p className="text-[clamp(12px,1.5vw,16px)] italic text-emphasis leading-relaxed font-serif-message">
                            {declaration.source.chant}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {declaration.concord && declaration.concord !== '无' && (
                      <div className="relative flex flex-col items-center" style={{marginBottom: '1rem'}}>
                        {declaration.layout.type !== '世相' && declaration.source.type !== '世相' && (
                          <img
                            src={`/asset/${getConcordType(declaration.layout, declaration.source)}logo1x1.png`}
                            alt={getConcordType(declaration.layout, declaration.source)}
                            className="absolute inset-0 w-full h-full object-contain opacity-50 -z-10"
                            style={{
                              scale: '2'
                            }}
                          />
                        )}
                        <p className="text-[clamp(10px,1.2vw,12px)] text-sammi-snow/70">柯瓦狄协语</p>
                        <p className="text-[clamp(14px,1.8vw,16px)] text-sammi-glow relative z-10">
                          {declaration.concord}
                        </p>
                      </div>
                    )}

                    {(storedDeclaration?.layoutRhetoric && storedDeclaration.layoutRhetoric !== '无') || (storedDeclaration?.sourceRhetoric && storedDeclaration.sourceRhetoric !== '无') ? (
                      <div className="flex flex-col items-center space-y-2">
                        <p className="text-[clamp(10px,1.2vw,12px)] text-sammi-snow/70">凯宁嘉修辞</p>
                        <div className="relative flex flex-col items-center space-y-1">
                          {(storedDeclaration?.layoutRhetoric && storedDeclaration.layoutRhetoric !== '无') && (storedDeclaration?.sourceRhetoric && storedDeclaration.sourceRhetoric !== '无') ? (
                            <div className="relative flex items-center justify-center gap-4">
                              <div className="relative flex items-center justify-center">
                                <img
                                  src={`/asset/修辞_${storedDeclaration.layoutRhetoric}.png`}
                                  alt={storedDeclaration.layoutRhetoric}
                                  className="absolute inset-0 w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] object-contain opacity-20 -z-10"
                                />
                                <p className="text-[clamp(12px,1.5vw,16px)] text-sammi-glow relative z-10">
                                  {storedDeclaration.layoutRhetoric}：{getFlairEffect(storedDeclaration.layoutRhetoric)}
                                </p>
                              </div>
                              <div className="relative flex items-center justify-center">
                                <img
                                  src={`/asset/修辞_${storedDeclaration.sourceRhetoric}.png`}
                                  alt={storedDeclaration.sourceRhetoric}
                                  className="absolute inset-0 w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] object-contain opacity-50 -z-10"
                                  style={{
                                    scale: '1.5'
                                  }}
                                />
                                <p className="text-[clamp(12px,1.5vw,16px)] text-sammi-glow relative z-10">
                                  {storedDeclaration.sourceRhetoric}：{getFlairEffect(storedDeclaration.sourceRhetoric)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              {storedDeclaration?.layoutRhetoric && storedDeclaration.layoutRhetoric !== '无' && (
                                <div className="relative flex items-center justify-center">
                                  <img
                                    src={`/asset/修辞_${storedDeclaration.layoutRhetoric}.png`}
                                    alt={storedDeclaration.layoutRhetoric}
                                    className="absolute inset-0 w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] object-contain opacity-20 -z-10"
                                  />
                                  <p className="text-[clamp(12px,1.5vw,16px)] text-sammi-glow relative z-10">
                                    {storedDeclaration.layoutRhetoric}：{getFlairEffect(storedDeclaration.layoutRhetoric)}
                                  </p>
                                </div>
                              )}
                              {storedDeclaration?.sourceRhetoric && storedDeclaration.sourceRhetoric !== '无' && (
                                <div className="relative flex items-center justify-center">
                                  <img
                                    src={`/asset/修辞_${storedDeclaration.sourceRhetoric}.png`}
                                    alt={storedDeclaration.sourceRhetoric}
                                    className="absolute inset-0 w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] object-contain opacity-20 -z-10"
                                  />
                                  <p className="text-[clamp(12px,1.5vw,16px)] text-sammi-glow relative z-10">
                                    {storedDeclaration.sourceRhetoric}：{getFlairEffect(storedDeclaration.sourceRhetoric)}
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <CardFront foldartal={declaration.source} position="source" animate={true} />
                  
                  <div className="flex-1 flex justify-start items-center">
                    <div className="text-left space-y-1 max-w-[100rem] px-2">
                      <p className="text-[clamp(12px,1.5vw,16px)] text-sammi-snow/80 italic leading-relaxed">
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

      <div className="flex items-center justify-center py-2 z-10">
        <img
          src="/asset/素材横向分割线B1269x24.png"
          alt="分隔装饰"
          className="h-4 w-auto object-contain"
        />
      </div>

      <div className="h-[60%] min-h-0 relative z-10">
        <Dialog
          messages={messages.filter(m => m.role !== 'system')}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          isWaitingForResponse={isWaitingForResponse}
        />
      </div>

      <UserNameEditDialog
        isOpen={editingUserName}
        currentUserName={userName}
        onSave={handleSaveUserName}
        onCancel={handleCancelUserName}
      />
    </div>
  );
}
