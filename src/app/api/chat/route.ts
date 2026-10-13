import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

// 1. 初始化 DeepSeek 客户端
const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // 2. 接收前端传来的三个参数
    const { scenicSpot, duration, specialty } = await req.json();

    // 3. 基础提示词（等队友词库好了，替换这里）
    const userPrompt = `你是一名山东文旅新媒体传播专家。
请根据以下信息撰写一篇用于各地文旅传播的爆款文章：
景点名称/内容主题：${scenicSpot}
建议游玩时间：${duration}
景点特产/特色体验：${specialty}

要求：
1. 文章语言活泼、有感染力，适合微信公众号、小红书、新闻客户端等平台传播。
2. 必须紧扣山东地域文化，重点突出该景点的游玩攻略、特色体验以及特产的推荐。
3. 结构完整，包含：吸引人的标题、导语（引子）、游玩亮点/路线介绍、特产美食推荐、结尾（号召或总结）。
4. 内容必须真实客观，不得包含虚假宣传和绝对化用语（如“第一”、“最”）。

请输出JSON格式，包含四个字段：
- article (生成的文旅文章正文，Markdown格式，需要分段)
- compliance (合规检查结果，指出文章中有没有绝对化违规用词)
- factCheck (地域事实核验结果，判断内容是否与山东文旅实际情况相符)
- suggestions (针对该文章在传播角度上的修改建议)`;

    // 4. 调用 DeepSeek 生成
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: userPrompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    // 5. 解析 AI 返回的 JSON
    const result = JSON.parse(completion.choices[0].message.content as string);
    
    return NextResponse.json({
      article: result.article,
      checkResult: {
        compliance: result.compliance,
        factCheck: result.factCheck,
        suggestions: result.suggestions
      }
    });
  } catch (error) {
    console.error("API Error:", error);
    // 如果这里报错，说明 NextResponse 没有正确导入
    return NextResponse.json({ error: "AI调用失败，请检查Key或网络" }, { status: 500 });
  }
}