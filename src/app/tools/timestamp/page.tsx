"use client";

import { useState, useEffect } from "react";

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  useEffect(() => {
    // 更新当前时间戳
    const updateCurrent = () => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    };
    updateCurrent();
    const interval = setInterval(updateCurrent, 1000);
    return () => clearInterval(interval);
  }, []);

  const timestampToDate = () => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        setDateTime("请输入有效的时间戳");
        return;
      }
      // 判断是秒还是毫秒
      const date = ts > 10000000000 ? new Date(ts) : new Date(ts * 1000);
      setDateTime(date.toLocaleString("zh-CN"));
    } catch (e) {
      setDateTime("转换失败");
    }
  };

  const dateToTimestamp = () => {
    try {
      if (!dateTime) {
        setTimestamp("");
        return;
      }
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) {
        setTimestamp("请输入有效的日期时间");
        return;
      }
      setTimestamp(Math.floor(date.getTime() / 1000).toString());
    } catch (e) {
      setTimestamp("转换失败");
    }
  };

  const useCurrentTime = () => {
    setTimestamp(currentTimestamp.toString());
    const date = new Date(currentTimestamp * 1000);
    setDateTime(date.toLocaleString("zh-CN"));
  };

  const copyToClipboard = async (text: string) => {
    if (text && !text.includes("失败") && !text.includes("请输入")) {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">时间戳转换工具</h1>
        <p className="text-gray-600">Unix 时间戳与日期时间互相转换</p>
      </div>

      {/* 当前时间显示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-blue-600">当前时间戳</span>
            <div className="text-2xl font-mono font-bold text-blue-900">
              {currentTimestamp}
            </div>
          </div>
          <button
            onClick={useCurrentTime}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            使用当前时间
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {/* 时间戳转日期 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            时间戳 → 日期时间
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="输入 Unix 时间戳（秒或毫秒）"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
            <button
              onClick={timestampToDate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              转换
            </button>
          </div>
          {dateTime && !dateTime.includes("失败") && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-gray-800">{dateTime}</span>
              <button
                onClick={() => copyToClipboard(dateTime)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                复制
              </button>
            </div>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* 日期转时间戳 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            日期时间 → 时间戳
          </label>
          <div className="flex gap-3">
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={dateToTimestamp}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              转换
            </button>
          </div>
          {timestamp && !timestamp.includes("失败") && !timestamp.includes("请输入") && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-gray-800">{timestamp}</span>
              <button
                onClick={() => copyToClipboard(timestamp)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                复制
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 使用提示 */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">使用说明</h3>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>Unix 时间戳是从 1970年1月1日 00:00:00 UTC 开始的秒数</li>
          <li>支持秒级和毫秒级时间戳自动识别</li>
          <li>输出时间戳为秒级（10位数字）</li>
        </ul>
      </div>
    </div>
  );
}
