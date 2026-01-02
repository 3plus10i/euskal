import React from 'react';
import { StoredDeclaration } from './FoldartalWorkspace';
import { CardFront } from './FoldartalCard';
import { DeclarationResult, getConcordType } from '../../utils/foldartalLogic';

interface PostDeclarationViewProps {
  declaration: DeclarationResult;
  storedDeclaration: StoredDeclaration | null;
  getFlairEffect: (flairName: string | null) => string;
}

export function PostDeclarationView({
  declaration,
  storedDeclaration,
  getFlairEffect
}: PostDeclarationViewProps) {
  return (
    <>
      {/* 移动端布局：md 以下显示 */}
      <div className="flex flex-col items-center h-full justify-center md:hidden">
        {/* 卡片行：左右两张卡片 */}
        <div className="flex flex-row justify-between items-center w-full flex-1 gap-2">
          <CardFront foldartal={declaration.layout} position="layout" animate={true} />
          
          <div className="flex flex-col items-center justify-center space-y-6 h-full">
            {/* 协语显示 */}
            {declaration.concord && declaration.concord !== '无' && (
              <div className="relative flex flex-col items-center" style={{marginBottom: '0.5rem'}}>
                {declaration.layout.type !== '世相' && declaration.source.type !== '世相' && (
                  <img
                    src={`/asset/${getConcordType(declaration.layout, declaration.source)}logo1x1.png`}
                    alt={getConcordType(declaration.layout, declaration.source)}
                    className="absolute inset-0 w-full h-full object-contain opacity-50 -z-10 scale-150"
                  />
                )}
                <p className="text-[clamp(8px,1vw,10px)] text-sammi-snow/70">柯瓦狄协语</p>
                <p className="text-[clamp(10px,1.4vw,14px)] text-sammi-glow relative z-10">
                  {declaration.concord}
                </p>
              </div>
            )}

            {/* 修辞显示 */}
            {(storedDeclaration?.layoutRhetoric && storedDeclaration.layoutRhetoric !== '无') || (storedDeclaration?.sourceRhetoric && storedDeclaration.sourceRhetoric !== '无') ? (
              <div className="flex flex-col items-center space-y-1">
                <p className="text-[clamp(8px,1vw,10px)] text-sammi-snow/70">凯宁嘉修辞</p>
                <div className="relative flex flex-col items-center space-y-0.5">
                  {(storedDeclaration?.layoutRhetoric && storedDeclaration.layoutRhetoric !== '无') && (storedDeclaration?.sourceRhetoric && storedDeclaration.sourceRhetoric !== '无') ? (
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="relative flex items-center justify-center">
                        <img
                          src={`/asset/修辞_${storedDeclaration.layoutRhetoric}.png`}
                          alt={storedDeclaration.layoutRhetoric}
                          className="absolute left-0 w-[clamp(30px,4vw,36px)] h-[clamp(30px,4vw,36px)] object-contain opacity-20 -z-10 scale-120"
                        />
                        <p className="text-[clamp(8px,1.2vw,14px)] text-sammi-glow font-light text-center relative z-10">
                          {storedDeclaration.layoutRhetoric}：{getFlairEffect(storedDeclaration.layoutRhetoric)}
                        </p>
                      </div>
                      <div className="relative flex items-center justify-center">
                        <img
                          src={`/asset/修辞_${storedDeclaration.sourceRhetoric}.png`}
                          alt={storedDeclaration.sourceRhetoric}
                          className="absolute right-0 w-[clamp(30px,4vw,36px)] h-[clamp(30px,4vw,36px)] object-contain opacity-20 -z-10 scale-120"
                        />
                        <p className="text-[clamp(8px,1.2vw,14px)] text-sammi-glow font-light text-center relative z-10">
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
                            className="absolute inset-0 w-[clamp(30px,4vw,36px)] h-[clamp(30px,4vw,36px)] object-contain opacity-20 -z-10"
                          />
                          <p className="text-[clamp(10px,1.2vw,14px)] text-sammi-glow font-light relative z-10">
                            {storedDeclaration.layoutRhetoric}：{getFlairEffect(storedDeclaration.layoutRhetoric)}
                          </p>
                        </div>
                      )}
                      {storedDeclaration?.sourceRhetoric && storedDeclaration.sourceRhetoric !== '无' && (
                        <div className="relative flex items-center justify-center">
                          <img
                            src={`/asset/修辞_${storedDeclaration.sourceRhetoric}.png`}
                            alt={storedDeclaration.sourceRhetoric}
                            className="absolute inset-0 w-[clamp(30px,4vw,36px)] h-[clamp(30px,4vw,36px)] object-contain opacity-20 -z-10"
                          />
                          <p className="text-[clamp(10px,1.2vw,14px)] text-sammi-glow relative z-10">
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
        </div>
        
        {/* 唱文行：左右布局 */}
        <div className="flex flex-row justify-between w-full mt-3 gap-4">
          {declaration.layout.chant && (
            <div className="text-center flex-1">
              <p className="text-[clamp(11px,1.2vw,14px)] italic text-emphasis leading-relaxed font-serif-message">
                {declaration.layout.chant}
              </p>
            </div>
          )}
          {declaration.source.chant && (
            <div className="text-center flex-1">
              <p className="text-[clamp(11px,1.2vw,14px)] italic text-emphasis leading-relaxed font-serif-message">
                {declaration.source.chant}
              </p>
            </div>
          )}
        </div>
        
        {/* 箴言行 */}
        <div className="flex flex-row justify-between w-full mt-3 gap-4">
          <div className="text-left flex-1">
            <p className="text-[clamp(10px,1.2vw,14px)] text-sammi-snow/80 italic leading-relaxed">
              {declaration.layout.motto}
            </p>
          </div>
          <div className="text-right flex-1">
            <p className="text-[clamp(10px,1.2vw,14px)] text-sammi-snow/80 italic leading-relaxed">
              {declaration.source.motto}
            </p>
          </div>
        </div>
      </div>

      {/* 桌面端布局：md 以上显示 */}
      <div className="hidden md:flex flex-col items-center h-full justify-center">
        <div className="flex justify-center items-center gap-4 w-full h-full max-w-[100rem] px-4">
          <div className="flex-1 flex justify-end items-center">
            <div className="text-right space-y-1 max-w-lg px-2">
              <p className="text-[clamp(12px,1.5vw,16px)] text-sammi-snow/80 italic leading-relaxed">
                {declaration.layout.motto}
              </p>
            </div>
          </div>
          
          <CardFront foldartal={declaration.layout} position="layout" animate={true} />
          
          <div className="flex flex-col items-center justify-center space-y-6 h-full">
            {/* 唱文显示 */}
            <div>
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
              <div className="relative flex flex-col items-center">
                {declaration.layout.type !== '世相' && declaration.source.type !== '世相' && (
                  <img
                    src={`/asset/${getConcordType(declaration.layout, declaration.source)}logo1x1.png`}
                    alt={getConcordType(declaration.layout, declaration.source)}
                    className="absolute inset-0 w-full h-full object-contain opacity-40 -z-10 scale-150"
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
                    <div className="relative flex-col items-center justify-center space-y-1">
                      <div className="relative flex items-center justify-center">
                        <img
                          src={`/asset/修辞_${storedDeclaration.layoutRhetoric}.png`}
                          alt={storedDeclaration.layoutRhetoric}
                          className="absolute left-0 w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] object-contain opacity-40 -z-10"
                        />
                        <p className="text-[clamp(8px,1rem,12px)] text-sammi-glow font-light relative z-10">
                          {storedDeclaration.layoutRhetoric}：{getFlairEffect(storedDeclaration.layoutRhetoric)}
                        </p>
                      </div>
                      <div className="relative flex items-center justify-center">
                        <img
                          src={`/asset/修辞_${storedDeclaration.sourceRhetoric}.png`}
                          alt={storedDeclaration.sourceRhetoric}
                          className="absolute right-0 w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] object-contain opacity-40 -z-10"
                        />
                        <p className="text-[clamp(8px,1rem,12px)] text-sammi-glow font-light relative z-10">
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
        </div>
      </div>
    </>
  );
}