import { DialogueStage } from '@/types';

// Enhanced AI response system with more sophisticated dialogue patterns
export class AIResponseGenerator {
  private static stageResponses: Record<DialogueStage, string[]> = {
    stage_1_awareness: [
      "我能感受到你的困扰。能具体说说是什么让你觉得开始这件事很困难吗？",
      "这种想做却开始不了的感觉确实很煎熬。让我们一起看看是什么在阻碍你？",
      "你提到的这个任务，如果要给你现在的感受打个分（1-10分），你会打几分？",
      "听起来你对这件事有些复杂的感受。能描述一下当你想到要开始时，心里会出现什么想法？",
      "我注意到你说'总是'，这种情况持续多久了？什么时候开始变成这样的？"
    ],
    stage_2_integration: [
      "如果把这种'不想开始'的感觉想象成你内心的一个小伙伴，你觉得它在担心什么？",
      "这个害怕失败的部分，它是想保护你不受伤害对吗？让我们理解一下它的善意。",
      "你想对内心这个担心的声音说点什么吗？",
      "如果这个'追求完美'的部分能说话，你觉得它最想告诉你什么？",
      "当你感受到这种阻力时，身体有什么感觉？紧张、沉重，还是其他什么？"
    ],
    stage_3_micro_action: [
      "很好！现在让我们把这个大任务分解一下。如果只有5分钟，你能做的最小的一步是什么？",
      "我觉得你已经准备好开始行动了。要不要我们现在就开始一个5分钟的专注时间？",
      "这个微行动听起来很棒！你现在感觉怎么样，准备开始了吗？",
      "让我们把目标降到最低：只需要5分钟，不求完美，只求开始。你觉得可以吗？",
      "如果把这个任务想象成爬楼梯，现在我们只需要迈出第一个台阶。这一步是什么？"
    ],
    stage_4_reflection: [
      "恭喜你完成了这个微行动！能分享一下刚才从卡住到行动的感受变化吗？",
      "这次突破对你来说意味着什么？有什么特别的收获吗？",
      "你想为这次的突破起个名字吗？我们可以把它做成你专属的成就结晶。",
      "回想一下整个过程，是什么帮助你迈出了这一步？",
      "这种从阻力到行动的转变，你觉得下次遇到类似情况时能用上吗？"
    ]
  };

  private static contextualResponses = {
    encouragement: [
      "你已经迈出了很重要的一步，仅仅是愿意面对这个困扰就很了不起。",
      "我能感受到你内心的力量，即使现在感觉困难，但你正在寻求改变。",
      "每个人都会遇到这样的时刻，你并不孤单。"
    ],
    validation: [
      "这种感受完全可以理解，很多人都会有类似的体验。",
      "你的感受是真实且重要的，不需要为此感到羞愧。",
      "能够觉察到这些内在的声音，本身就是一种智慧。"
    ],
    transition: [
      "现在让我们换个角度来看这个问题...",
      "我想邀请你尝试一个不同的视角...",
      "让我们一起探索另一种可能性..."
    ]
  };

  static generateResponse(
    userMessage: string, 
    stage: DialogueStage, 
    context?: {
      messageHistory?: string[];
      userEmotion?: 'frustrated' | 'anxious' | 'hopeful' | 'confused';
      previousAttempts?: number;
    }
  ): string {
    const stageResponses = this.stageResponses[stage];
    
    // Analyze user message for emotional context
    const emotion = this.detectEmotion(userMessage);
    const needsEncouragement = this.needsEncouragement(userMessage);
    const needsValidation = this.needsValidation(userMessage);

    let response = '';

    // Add contextual opening if needed
    if (needsValidation) {
      response += this.getRandomResponse(this.contextualResponses.validation) + ' ';
    } else if (needsEncouragement) {
      response += this.getRandomResponse(this.contextualResponses.encouragement) + ' ';
    }

    // Add main stage-appropriate response
    response += this.getRandomResponse(stageResponses);

    return response;
  }

  private static detectEmotion(message: string): string {
    const frustrationWords = ['烦躁', '焦虑', '压力', '累', '疲惫', '不想', '讨厌'];
    const hopefulWords = ['想要', '希望', '试试', '努力', '改变'];
    const confusedWords = ['不知道', '困惑', '迷茫', '不明白'];

    if (frustrationWords.some(word => message.includes(word))) return 'frustrated';
    if (hopefulWords.some(word => message.includes(word))) return 'hopeful';
    if (confusedWords.some(word => message.includes(word))) return 'confused';
    
    return 'neutral';
  }

  private static needsEncouragement(message: string): boolean {
    const discourageWords = ['不行', '做不到', '太难', '失败', '放弃', '没用'];
    return discourageWords.some(word => message.includes(word));
  }

  private static needsValidation(message: string): boolean {
    const selfDoubtWords = ['我是不是', '可能是我', '我的问题', '我不够'];
    return selfDoubtWords.some(word => message.includes(word));
  }

  private static getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  static generateCrystalInsight(
    blockerDescription: string,
    keyActions: string[],
    userReflection: string
  ): {
    name: string;
    insight: string;
    visualType: string;
  } {
    const crystalTypes = [
      { type: 'courage', keywords: ['害怕', '恐惧', '不敢', '担心'] },
      { type: 'wisdom', keywords: ['不知道', '困惑', '迷茫', '理解'] },
      { type: 'growth', keywords: ['改变', '成长', '进步', '突破'] },
      { type: 'clarity', keywords: ['清楚', '明白', '认识', '发现'] },
      { type: 'strength', keywords: ['坚持', '努力', '力量', '勇气'] }
    ];

    // Determine crystal type based on content
    let visualType = 'default';
    for (const crystal of crystalTypes) {
      if (crystal.keywords.some(keyword => 
        blockerDescription.includes(keyword) || userReflection.includes(keyword)
      )) {
        visualType = crystal.type;
        break;
      }
    }

    const insights = {
      courage: [
        "勇气不是没有恐惧，而是带着恐惧依然前行",
        "每一次迈出的小步，都在积累内在的力量",
        "原来行动本身就是最好的恐惧解药"
      ],
      wisdom: [
        "智慧来自于对内心声音的倾听和理解",
        "困惑是成长的开始，接纳它就是智慧",
        "真正的理解始于对自己的温柔"
      ],
      growth: [
        "成长就是一次次从舒适圈走向未知",
        "每个微小的改变都在重塑更好的自己",
        "突破的瞬间，就是新的自己诞生的时刻"
      ],
      clarity: [
        "清晰来自于对内心真实需求的认识",
        "当迷雾散去，道路自然显现",
        "觉察本身就是改变的开始"
      ],
      strength: [
        "真正的力量来自于对内在冲突的整合",
        "坚持不是硬撑，而是找到内在的支撑点",
        "每一次的坚持都在强化内在的韧性"
      ]
    };

    const typeInsights = insights[visualType as keyof typeof insights] || insights.growth;
    const insight = typeInsights[Math.floor(Math.random() * typeInsights.length)];

    const names = {
      courage: ['勇气之光', '破恐结晶', '行动勇士', '无畏之心'],
      wisdom: ['智慧之眼', '洞察结晶', '理解之光', '觉知宝石'],
      growth: ['成长之翼', '突破结晶', '蜕变之石', '进化宝石'],
      clarity: ['清明之镜', '洞察结晶', '明心宝石', '觉醒之光'],
      strength: ['力量之源', '坚韧结晶', '不屈之石', '韧性宝石']
    };

    const typeNames = names[visualType as keyof typeof names] || names.growth;
    const name = typeNames[Math.floor(Math.random() * typeNames.length)];

    return { name, insight, visualType };
  }
}