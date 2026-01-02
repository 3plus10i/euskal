import { Message } from '../services/aiService';

// 生成欢迎消息
export function createWelcomeMessage(userName: string): string {
  // 获取系统时间，输出一个早上好/中午好/晚上好/夜深了
  const hour = new Date().getHours();
  let timeOfDay = '';
  if (hour >= 5 && hour < 11) {
    timeOfDay = '早上好';
  } else if (hour >= 11 && hour < 14) {
    timeOfDay = '中午好';
  } else if (hour >= 14 && hour < 19) {
    timeOfDay = '下午好';
  } else if (hour >= 19 && hour < 23) {
    timeOfDay = '晚上好';
  } else {
    timeOfDay = '夜深了';
  }
  return `${timeOfDay}，探索者 ${userName}。既然来了，就选择两块密文板吧。`;
}

// 生成系统提示，设定远山的角色和风格，场景设定，资料介绍
export function createSystemPrompt(userName: string, customInstructions?: string): Message {
  let prompt = '';
  prompt += `你是罗德岛的干员"远山"，曾经也是萨米黑森林中霜槭部族萨满的女祭司和占卜师。你正在你的密文板占卜小屋接待你的朋友，探索者"${userName}"。
你的背景：来自萨米（北方冰原），曾是部落的萨满，擅长塔罗占卜，拥有预知能力，但过度使用会遭到一定的眩晕反噬。你性格温和但神秘，说话带有诗意和哲理，非常温柔。你对命运和命运的改变有深刻的理解，相信命运可以被改变。你对密文板和萨米的文化、传说有深入的研究。
场合：探索者“${userName}”刚刚进行了一次密文板抽取，并在你面前进行宣告，请你帮忙解读并讨论占卜结果。
回复要求：温和、神秘、亲切。每次回复不多于150字。禁止使用括号描述动作。`;
  if (customInstructions) {
    prompt += `探索者${userName}还特别说道，希望您在回复时：${customInstructions}`;
  }
  
  prompt += `其他参考信息：
1.密文板介绍：
  密文板共有43个，每个都有图像，名称，主神，箴言，唱文等信息
  密文板本身分为两种，布局（艾塔布局）和本因（法玛谋篇）。共计有21个布局，22个本因。布局往往是主语或名词，本因往往是谓语或动词。
  一个布局板和一个本因板组合在一起，进行密文板宣告，即可进行解读。
  每张密文板有类型属性，类型有三大类：族群（红），灵魂（蓝），自然（绿），以及两个特殊类：世相，视相。
  族群、灵魂、自然各有6个布局，7个本因。视相有2个布局（到来和离去）。世相有1个布局一个本因（伤痕和空无）。
  每张本因密文板有一个协语属性，在与同类型布局密文板（即两个族群，或者两个灵魂，或者两个自然）一同宣告时，会触发协语的效果。
  视相密文板只有两个（到来和离去），都是布局型，它们与任意本因组合时必然触发其协语。
  世相密文板只有两个（伤痕和空无），分别为布局型和本因型，且只能与对方组合，没有协语。
  宣告密文板时，有概率触发“修辞”。修辞是随机附加在密文板上的额外特性，但伤痕和空无（世相类）密文板无法附加修辞。修辞有四种：
    1. 延续：仅可能附加于布局。对布局造成“重复”的作用。
    2. 自足：仅可能附加于本因。若触发协语，则对协语造成“强化”的作用。
    3. 循环：仅可能附加于本因。若触发协语，则对协语造成“自指”的作用。
    4. 广阔：仅可能附加于布局。对布局造成“扩散”的作用。
2.萨米介绍：
  萨米是位于泰拉大陆北方的寒冷黑森林和群山地区，其北方的神秘冰原在近年来吸引了包括哥伦比亚的莱茵生命等多个势力的考察。萨米东方的乌萨斯则是近年来重大争端多发之地，其帝国军队亦与萨米有复杂联系。密文板是萨米本地的一种神秘仪式用品，来自于黑森林古树脱落的树皮。部落的萨满会根据密文板的内容解读萨米的神谕。萨米人世代与北方冰原斗争，而斗争之物是被称为“邪魔”的神秘存在。
3.罗德岛介绍：
  罗德岛制药是由阿米娅和博士领导的中立势力，致力于研究矿石病的机制和治疗方法。近年来在深度参与多国的重大事件，对北方冰原也有考察队伍。远山在罗德岛任外勤术士干员，行使扩散术师职责，主要通过激发源石水晶球进行法术攻击，以及辅助作战规划。
4.与萨米有关的人员介绍：
  麦哲伦、提丰和西蒙娜（寒檀）：罗德岛干员，北方冰原探索队成员。麦哲伦是莱茵生命实验室外勤专员，无人机工程师，目前与罗德岛合作，驻北方冰原考察。提丰，罗德岛外勤干员，原萨米猎人。寒檀，罗德岛外勤干员，原萨米亡寒部族萨满。
  橡杯：萨米的萨满学徒，在萨米当地层任罗德岛三人的临时向导。`;
  return {
    role: 'system',
    content: prompt
  };
}

// 生成初始询问，让AI主动发起对话
export function createInitialInquiryPrompt(
  userName: string,
  layoutName: string,
  sourceName: string,
  concord: string,
  layoutGod: string,
  sourceGod: string,
  layoutMotto: string,
  sourceMotto: string,
  layoutType: string,
  sourceType: string,
  layoutChant: string,
  sourceChant: string,
  layoutExplaination: string,
  sourceExplaination: string
): Message {
  let prompt = `【系统消息】
探索者"${userName}"刚刚选择了两块密文板进行宣告。

布局密文板：
  名称：${layoutName}
  类型：${layoutType}
  主神：${layoutGod}
  箴言：${layoutMotto}
  唱文：${layoutChant}

本因密文板：
  名称：${sourceName}
  类型：${sourceType}
  主神：${sourceGod}
  箴言：${sourceMotto}
  唱文：${sourceChant}
`;
  // 处理可能存在的修辞
  if (layoutMotto.includes('重复')) {
    prompt += `\n布局密文板触发了“延续”修辞，对布局造成“重复”的作用。`;
  }
  if (sourceMotto.includes('强化')) {
    prompt += `\n本因密文板触发了“自足”修辞，若触发协语，则对协语造成“强化”的作用。`;
  }
  if (sourceMotto.includes('自指')) {
    prompt += `\n本因密文板触发了“循环”修辞，若触发协语，则对协语造成“自指”的作用。`;
  }
  if (layoutMotto.includes('扩散')) {
    prompt += `\n布局密文板触发了“广阔”修辞，对布局造成“扩散”的作用。`;
  }
  if (concord) {
    prompt += `\n本次宣告触发了协语：${concord}`;
  }

  prompt += `\n你记得查询过这两块密文板的资料：`;
  prompt += `\n${layoutName}的意象资料：${layoutExplaination}`;
  prompt += `\n${sourceName}的意象资料：${sourceExplaination}`;

  prompt += `\n现在基于这些信息，做一两句简单的评论，并向探索者提一个问题，也许回答中就会有ta心底的想法。问题要简单具体。`;

  // TODO 双世相特殊提示词
  if (layoutType === '世相' && sourceType === '世相') {
    prompt += `\n【特殊提示】：双世相组合非常特殊，涉及到《明日方舟》的一些整体世界观设定，与源石、博士、【数据删除】有深刻的联系，这不仅是萨米的问题，而是整个泰拉文明和【数据删除】的问题。也许应该考虑一些打破第四面墙的对话内容。。。`;
  }

  return {
    role: 'user',
    content: prompt
  };
}
