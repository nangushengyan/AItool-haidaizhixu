"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ToolContent() {
  const searchParams = useSearchParams();
  const scenicSpot = searchParams.get("scenicSpot") || "";
  const duration = searchParams.get("duration") || "";
  const specialty = searchParams.get("specialty") || "";

  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState("");
  const [checkResult, setCheckResult] = useState<any>(null);
    // 历史版本相关状态
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saveToast, setSaveToast] = useState(false); // 保存成功的提示

  // 1. 导出文章
  const handleExport = () => {
    if (!article) return alert("没有可导出的文章");
    const blob = new Blob([article], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scenicSpot}-文旅传播文章.md`; // 导出为 Markdown 格式
    a.click();
    URL.revokeObjectURL(url);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // 2. 保存修改记录
  const handleSaveRecord = () => {
    if (!article) return alert("没有可保存的文章");
    const newRecord = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      content: article,
      scenicSpot,
      duration,
      specialty
    };
    
    // 读取已有记录，追加新记录后保存
    const existing = JSON.parse(localStorage.getItem("haidai_history") || "[]");
    const updated = [newRecord, ...existing]; // 最新的放在最前面
    localStorage.setItem("haidai_history", JSON.stringify(updated));
    
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // 3. 查看历史版本（从本地读取）
  const handleViewHistory = () => {
    const existing = JSON.parse(localStorage.getItem("haidai_history") || "[]");
    setHistoryList(existing);
    setShowHistory(true);
  };

  // 4. 恢复某个历史版本
  const handleRestoreVersion = (content: string) => {
    setArticle(content);
    setShowHistory(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  useEffect(() => {
    if (scenicSpot) {
      generateArticle();
    }
  }, []);

  const generateArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenicSpot, duration, specialty }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setArticle(data.article || "");
        setCheckResult(data.checkResult || null);
      }
    } catch (err) {
      alert("生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <div className="min-h-screen bg-[#F5F5F0] p-6">
      {/* 顶部导航 */}
      <header className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center gap-4">
          {/* 新增：返回首页按钮 */}
          <a href="/" className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded transition flex items-center gap-1">
            ← 返回首页
          </a>
          <h1 className="text-2xl font-bold text-[#1E5A99]">海岱智叙</h1>
        </div>
        <nav className="space-x-6 text-gray-600">
          <a href="/" className="hover:text-[#1E5A99]">首页</a>
          <a href="/tool" className="text-[#1E5A99] font-bold">工具</a>
          <a href="#" className="hover:text-[#1E5A99]">案例</a>
          <a href="#" className="hover:text-[#1E5A99]">说明</a>
        </nav>
      </header>

      {/* 主体三栏布局 */}
      <div className="flex gap-6 h-[calc(100vh-120px)]">
        {/* 左侧：参数概览 */}
        <div className="w-1/4 bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#3A8B8B]">
          <h2 className="text-lg font-bold mb-4 flex justify-between items-center">
            文旅文章生成 <span className="text-gray-400 cursor-pointer">×</span>
          </h2>
          <div className="space-y-3 text-sm">
            <p><strong>景点/主题：</strong>{scenicSpot}</p>
            <p><strong>游玩时间：</strong>{duration}</p>
            <p><strong>景点特产：</strong>{specialty}</p>
          </div>
          <button onClick={generateArticle} disabled={loading} className="w-full mt-8 bg-[#3A8B8B] text-white py-2 rounded-lg hover:bg-teal-700 transition">
            {loading ? "文章生成中..." : "重新生成文章"}
          </button>
        </div>

        {/* 中间：生成的文章 */}
        <div className="w-2/4 bg-white p-6 rounded-xl shadow-sm flex flex-col">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">生成文章</h2>
          
          {/* --- 新增：全局风险提示 --- */}
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
            <span className="text-lg">⚠️</span>
            <span><strong>风险提示：</strong>AI生成仅为草稿，<strong>人工终审是必要环节，AI输出不能直接作为发布成品。</strong></span>
          </div>
          {/* -------------------------- */}
          <textarea
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            className="flex-1 w-full border p-4 rounded-lg resize-none focus:ring-2 focus:ring-[#3A8B8B] outline-none font-mono text-sm leading-relaxed"
            placeholder={loading ? "AI正在撰写文章，请稍候..." : "生成的文旅传播文章将在这里显示，您可以进行人工修改"}
          />
          <div className="flex gap-4 mt-4 pt-4 border-t relative">
            <button onClick={handleExport} className="flex-1 border border-gray-300 py-2 rounded text-sm hover:bg-gray-50 transition">导出文章</button>
            <button onClick={handleSaveRecord} className="flex-1 border border-gray-300 py-2 rounded text-sm hover:bg-gray-50 transition">保存修改记录</button>
            <button onClick={handleViewHistory} className="flex-1 border border-gray-300 py-2 rounded text-sm hover:bg-gray-50 transition">查看历史版本</button>
            
            {/* 保存成功提示Toast */}
            {saveToast && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded text-sm shadow-lg animate-bounce">
                操作成功！
              </div>
            )}
          </div>
        </div>

        {/* 右侧：校验结果 */}
        <div className="w-1/4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">校验结果</h2>
          {checkResult ? (
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <p className="font-bold text-green-800 mb-1">✅ 合规检查</p>
                <p className="text-green-700">{checkResult.compliance}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="font-bold text-blue-800 mb-1">✅ 地域事实</p>
                <p className="text-blue-700">{checkResult.factCheck}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded border border-orange-200">
                <p className="font-bold text-orange-800 mb-1">💡 修改建议</p>
                <p className="text-orange-700">{checkResult.suggestions}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">等待生成后校验...</p>
          )}
        </div>
      </div>
    </div>
          {/* 历史版本弹窗 */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-1/2 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">历史版本记录</h3>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {historyList.length === 0 ? (
                <p className="text-gray-500 text-center py-10">暂无历史记录，请生成文章后点击“保存修改记录”</p>
              ) : (
                historyList.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:border-[#3A8B8B] transition bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-[#1E5A99]">{item.scenicSpot} - {item.duration}</span>
                      <span className="text-xs text-gray-400">{item.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.content.substring(0, 100)}...</p>
                    <button 
                      onClick={() => handleRestoreVersion(item.content)}
                      className="text-sm bg-[#3A8B8B] text-white px-4 py-1.5 rounded hover:bg-teal-700 transition"
                    >
                      恢复此版本
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ToolPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">页面加载中...</div>}>
      <ToolContent />
    </Suspense>
  );
}