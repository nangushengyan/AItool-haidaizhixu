"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    scenicSpot: "", // 山东旅游景点内容主题
    duration: "",   // 游玩时间
    specialty: "",  // 景点特产
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    if (!formData.scenicSpot || !formData.duration || !formData.specialty) {
      return alert("请完整填写景点、游玩时间和特产信息");
    }
    // 将数据拼接到 URL 传递到 /tool 页面
    const query = new URLSearchParams(formData).toString();
    router.push(`/tool?${query}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-6xl font-serif font-bold text-gray-800 tracking-widest mb-4">海岱智叙</h1>
        <p className="text-xl text-gray-600 tracking-wider">面向山东县域文旅的 AI 传播文章生成工具</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl w-full">
        {/* 左侧插画占位符 */}
        <div className="w-1/2 h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
          [山东文旅AI插画占位图，请替换为其他设计素材]
        </div>

        {/* 右侧表单 */}
        <div className="w-1/2 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">输入文旅文章要素</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">景点名称 / 内容主题</label>
              <input name="scenicSpot" onChange={handleChange} placeholder="例如：泰山风景区、淄博红叶柿岩" className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">建议游玩时间</label>
              <input name="duration" onChange={handleChange} placeholder="例如：2天1夜、半日游" className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">景点特产 / 特色体验</label>
              <input name="specialty" onChange={handleChange} placeholder="例如：泰山煎饼、博山酥锅、琉璃工艺品" className="w-full border p-2 rounded" />
            </div>
            <button onClick={handleGenerate} className="w-full bg-[#1E5A99] text-white py-3 rounded-lg hover:bg-blue-800 transition font-bold mt-4">
              生成传播文章
            </button>
          </div>
          
          {/* --- 主页风险提示 --- */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <span className="text-red-500 text-xl">⚠️</span>
            <div>
              <h4 className="text-sm font-bold text-red-800 mb-1">风险提示与合规要求</h4>
              <p className="text-xs text-red-600 leading-relaxed">
                本工具生成的仅为初稿草稿。<strong>人工终审是必要环节，AI 输出不能直接作为发布成品。</strong>请务必仔细核验山东地域史实、景点数据及宣传用语的合规性。
              </p>
            </div>
          </div>
          {/* -------------------------- */}
        </div>
      </div>
    </div>
  );
}