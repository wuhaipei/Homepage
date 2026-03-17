"use client";

import { useState } from "react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const handleConvert = () => {
    try {
      setError("");
      if (!input.trim()) {
        setOutput("");
        return;
      }

      if (mode === "encode") {
        // 文本转 Base64
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        // Base64 转文本
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
    } catch (e) {
      setError(mode === "encode" ? "编码失败" : "解码失败，请检查 Base64 格式是否正确");
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Base64 编解码工具</h1>
        <p className="text-gray-600">文本与 Base64 格式互相转换</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        {/* 模式切换 */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
          <button
            onClick={() => {
              setMode("encode");
              setOutput("");
              setError("");
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "encode"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            编码 (文本 → Base64)
          </button>
          <button
            onClick={() => {
              setMode("decode");
              setOutput("");
              setError("");
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "decode"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            解码 (Base64 → 文本)
          </button>
        </div>

        {/* 输入区域 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              {mode === "encode" ? "输入文本" : "输入 Base64"}
            </label>
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
            placeholder={mode === "encode" ? "输入要编码的文本..." : "输入要解码的 Base64..."}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-y"
          />
        </div>

        {/* 转换按钮 */}
        <button
          onClick={handleConvert}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {mode === "encode" ? "编码" : "解码"}
        </button>

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
              <label className="text-sm font-medium text-gray-700">
                {mode === "encode" ? "Base64 结果" : "解码结果"}
              </label>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                复制结果
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-32 p-3 bg-gray-100 border border-gray-200 rounded-lg font-mono text-sm resize-y text-gray-800"
            />
          </div>
        )}
      </div>

      {/* 使用提示 */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-green-800 mb-2">什么是 Base64？</h3>
        <p className="text-sm text-green-700">
          Base64 是一种基于 64 个可打印字符来表示二进制数据的编码方式。它常用于在文本协议中传输二进制数据，如在 URL、Cookie、网页中传输小图片等。
        </p>
      </div>
    </div>
  );
}
