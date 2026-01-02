import { useState, useEffect } from 'react';
import { Foldartal, FlairType } from '../../types/foldartal';
import { foldartals } from '../../data/foldartals';
import { flairs } from '../../data/flairs';
import { Dialog } from '../Dialog/Dialog';
import { UserNameEditDialog } from './UserNameEditDialog';
import { createDeclaration, DeclarationResult } from '../../utils/foldartalLogic';
import { createSystemPrompt, createInitialInquiryPrompt } from '../../utils/prompts';
import { PreDeclarationView } from './PreDeclarationView';
import { PostDeclarationView } from './PostDeclarationView';

interface FoldartalWorkspaceProps {
  userName: string;
  initialMessages: any[];
  onSendMessage: (content: string, role?: 'user' | 'system') => void;
  onSendMultipleMessages: (messageList: { role: 'user' | 'system' | 'assistant', content: string, visible?: boolean, timestamp?: string }[]) => void;
  isLoading: boolean;
  isWaitingForResponse: boolean;
  onUserNameChange: (newName: string) => void;
  debugMode?: boolean;
  onDoubleSocietyTriggered?: () => void;
}

export interface StoredDeclaration {
  timestamp: string;
  layoutCipherName: string;
  layoutRhetoric: string | null;
  sourceCipherName: string;
  sourceRhetoric: string | null;
}



export function FoldartalWorkspace({ userName, initialMessages, onSendMessage, onSendMultipleMessages, isLoading, isWaitingForResponse, onUserNameChange, debugMode = false, onDoubleSocietyTriggered }: FoldartalWorkspaceProps) {
  const [selectedLayout, setSelectedLayout] = useState<Foldartal | null>(null);
  const [selectedSource, setSelectedSource] = useState<Foldartal | null>(null);
  const [declared, setDeclared] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [editingUserName, setEditingUserName] = useState(false);
  const [interpretationSent, setInterpretationSent] = useState(false);
  const [storedDeclaration, setStoredDeclaration] = useState<StoredDeclaration | null>(null);

  const layoutFoldartals = foldartals.filter(f => f.category === '布局');
  const sourceFoldartals = foldartals.filter(f => f.category === '本因');

  // 调试模式：固定选择英雄（布局）和歌唱（本因）
  useEffect(() => {
    if (debugMode) {
      const heroLayout = foldartals.find(f => f.id === 6); // 英雄
      const singSource = foldartals.find(f => f.id === 22); // 歌唱
      
      if (heroLayout) setSelectedLayout(heroLayout);
      if (singSource) setSelectedSource(singSource);
      
      // 创建存储的宣告记录
      const timestamp = new Date().toISOString();
      const newStoredDeclaration: StoredDeclaration = {
        timestamp,
        layoutCipherName: heroLayout?.name || '英雄',
        layoutRhetoric: '延续', // 调试模式固定修辞
        sourceCipherName: singSource?.name || '歌唱',
        sourceRhetoric: '自足'  // 调试模式固定修辞
      };
      
      // 自动宣告
      setDeclared(true);
      setStoredDeclaration(newStoredDeclaration);
      setInterpretationSent(true); // 防止重复发送AI消息
      
      // 保存到本地存储
      const existingDeclarations = JSON.parse(localStorage.getItem('declarations') || '[]');
      existingDeclarations.push(newStoredDeclaration);
      localStorage.setItem('declarations', JSON.stringify(existingDeclarations));
    }
  }, [debugMode]);

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
      
      if (onDoubleSocietyTriggered && selectedLayout.type === '世相' && selectedSource.type === '世相') {
        onDoubleSocietyTriggered();
      }
      
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
        { role: 'system', content: systemPrompt.content, visible: false, timestamp: new Date().toISOString() },
        { role: 'assistant', content: initialMessages[0]?.content || '', visible: false, timestamp: new Date().toISOString() },
        { role: 'user', content: initialInquiryPrompt.content, visible: false, timestamp: new Date().toISOString() }
      ]);
    }
  };



  const handleSaveUserName = (newName: string) => {
    localStorage.setItem('userName', newName);
    onUserNameChange(newName);
    setEditingUserName(false);
  };

  const handleCancelUserName = () => {
    setEditingUserName(false);
  };

  // 计算宣告结果，调试模式下强制包含修辞
  const declaration = ((): DeclarationResult | null => {
    if (!selectedLayout || !selectedSource) return null;
    
    const result = createDeclaration(selectedLayout.id, selectedSource.id);
    
    // 调试模式：确保修辞一定触发
    if (debugMode && result) {
      // 获取适合类别的修辞
      const layoutFlair = flairs.find(f => f.type === '布局');
      const sourceFlair = flairs.find(f => f.type === '本因');
      
      return {
        ...result,
        layoutRhetoric: (layoutFlair?.name as FlairType) || '延续',
        sourceRhetoric: (sourceFlair?.name as FlairType) || '自足'
      };
    }
    
    return result;
  })();

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
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="px-6 pt-10 relative z-10 h-auto min-h-[200px] flex flex-col">
        {!declared ? (
          <PreDeclarationView
            selectedLayout={selectedLayout}
            selectedSource={selectedSource}
            handleLayoutClick={handleLayoutClick}
            handleSourceClick={handleSourceClick}
            handleDeclare={handleDeclare}
          />
        ) : declaration ? (
          <PostDeclarationView
            declaration={declaration}
            storedDeclaration={storedDeclaration}
            getFlairEffect={getFlairEffect}
          />
        ) : null}
      </div>

      <div className="flex items-center justify-center py-2 z-10 flex-shrink-0">
        <img
          src="/asset/素材横向分割线B1269x24.png"
          alt="分隔装饰"
          className="h-4 w-auto object-contain"
        />
      </div>

      <div className="flex-1 min-h-0 relative md:mb-16 mb-10 z-10">
        <Dialog
          messages={messages.filter(m => m.role !== 'system')}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          isWaitingForResponse={isWaitingForResponse}
          isDoubleSociety={onDoubleSocietyTriggered ? (() => {
            const hasDoubleSociety = selectedLayout?.type === '世相' && selectedSource?.type === '世相';
            return hasDoubleSociety && declared;
          })() : false}
          isDeclared={declared}
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
