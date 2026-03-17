"use client";

import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setError("请输入 JSON 数据");
        setOutput("");
        return;
      }
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError("");
    } catch (e) {
      setError("JSON 格式错误: " + (e as Error).message);
      setOutput("");
    }
  };

  const compressJson = () => {
    try {
      if (!input.trim()) {
        setError("请输入 JSON 数据");
        setOutput("");
        return;
      }
      const parsed = JSON.parse(input);
      const compressed = JSON.stringify(parsed);
      setOutput(compressed);
      setError("");
    } catch (e) {
      setError("JSON 格式错误: " + (e as Error).message);
      setOutput("");
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">JSON 格式化工具</h1>
        <p className="text-gray-600">JSON 数据的美化、压缩和验证</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        {/* 输入区域 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">输入 JSON</label>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700"
            >
              清空
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "示例", "value": 123}'
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-y"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={formatJson}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            格式化
          </button>
          <button
            onClick={compressJson}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            压缩
          </button>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">缩进:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={2}>2 空格</option>
              <option value={4}>4 空格</option>
              <option value={8}>8 空格</option>
            </select>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* 输出区域 */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">结果</label>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                复制结果
              </button>
            </div>
            <pre className="w-full h-40 p-3 bg-gray-100 border border-gray-200 rounded-lg overflow-auto font-mono text-sm text-gray-800">
              {output}
            </pre>
          </div>
        )}
      </div>

      {/* 使用提示 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">使用说明</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>在左侧输入框粘贴 JSON 数据</li>
          <li>点击"格式化"可美化 JSON 格式</li>
          <li>点击"压缩"可去除所有空格和换行</li>
          <li>工具会自动验证 JSON 格式是否正确</li>
        </ul>
      </div>
    </div>
  );
}
