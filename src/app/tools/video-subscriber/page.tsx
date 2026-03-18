"use client";

import { useState, useEffect } from "react";

interface Channel {
  id: string;
  name: string;
  url: string;
  rssUrl: string;
  addedAt: number;
}

interface Video {
  title: string;
  link: string;
  pubDate: string;
  channelName: string;
}

export default function VideoSubscriber() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannelUrl, setNewChannelUrl] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"channels" | "search">("channels");

  // 从 localStorage 加载频道列表
  useEffect(() => {
    const saved = localStorage.getItem("videoChannels");
    if (saved) {
      try {
        setChannels(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load channels:", e);
      }
    }
  }, []);

  // 保存频道列表到 localStorage
  useEffect(() => {
    localStorage.setItem("videoChannels", JSON.stringify(channels));
  }, [channels]);

  // 提取 YouTube 频道 ID
  const extractChannelId = (url: string): string | null => {
    // 处理 @username 格式
    const handleMatch = url.match(/youtube\.com\/@([^/?]+)/);
    if (handleMatch) return `@${handleMatch[1]}`;

    // 处理 channel/UCxxx 格式
    const channelMatch = url.match(/channel\/(UC[\w-]+)/);
    if (channelMatch) return channelMatch[1];

    // 处理 c/xxx 格式
    const cMatch = url.match(/\/c\/([^/?]+)/);
    if (cMatch) return cMatch[1];

    // 处理用户 xxx 格式
    const userMatch = url.match(/\/user\/([^/?]+)/);
    if (userMatch) return userMatch[1];

    return null;
  };

  // 生成 RSS URL
  const generateRssUrl = (channelId: string): string => {
    if (channelId.startsWith("@")) {
      // 使用 handle 的 RSS
      return `https://www.youtube.com/feeds/videos.xml?user=${channelId.slice(1)}`;
    } else if (channelId.startsWith("UC")) {
      // 使用 channel ID 的 RSS
      return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    } else {
      // 尝试用户名格式
      return `https://www.youtube.com/feeds/videos.xml?user=${channelId}`;
    }
  };

  // 添加频道
  const addChannel = () => {
    if (!newChannelUrl.trim()) {
      setError("请输入频道链接");
      return;
    }

    const channelId = extractChannelId(newChannelUrl);
    if (!channelId) {
      setError("无法识别的 YouTube 链接格式");
      return;
    }

    const rssUrl = generateRssUrl(channelId);
    const name = newChannelName.trim() || `频道 ${channels.length + 1}`;

    const newChannel: Channel = {
      id: Date.now().toString(),
      name,
      url: newChannelUrl,
      rssUrl,
      addedAt: Date.now(),
    };

    setChannels([...channels, newChannel]);
    setNewChannelUrl("");
    setNewChannelName("");
    setError("");
  };

  // 删除频道
  const removeChannel = (id: string) => {
    setChannels(channels.filter((c) => c.id !== id));
  };

  // 获取 RSS 数据
  const fetchRssData = async () => {
    if (channels.length === 0) {
      setError("请先添加频道");
      return;
    }

    setLoading(true);
    setError("");
    const allVideos: Video[] = [];

    try {
      for (const channel of channels) {
        try {
          // 使用 rss2json API 解析 RSS
          const response = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
              channel.rssUrl
            )}`
          );
          const data = await response.json();

          if (data.status === "ok" && data.items) {
            const channelVideos = data.items.map((item: any) => ({
              title: item.title,
              link: item.link,
              pubDate: new Date(item.pubDate).toLocaleString("zh-CN"),
              channelName: channel.name,
            }));
            allVideos.push(...channelVideos);
          }
        } catch (e) {
          console.error(`Failed to fetch ${channel.name}:`, e);
        }
      }

      // 按日期排序（最新的在前）
      allVideos.sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );

      setVideos(allVideos);
      setFilteredVideos(allVideos);
    } catch (e) {
      setError("获取数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 搜索视频
  const searchVideos = () => {
    if (!searchKeyword.trim()) {
      setFilteredVideos(videos);
      return;
    }

    const keyword = searchKeyword.toLowerCase();
    const filtered = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(keyword) ||
        video.channelName.toLowerCase().includes(keyword)
    );
    setFilteredVideos(filtered);
  };

  // 导出 Markdown
  const exportMarkdown = () => {
    if (filteredVideos.length === 0) {
      setError("没有可导出的视频");
      return;
    }

    const markdown = filteredVideos
      .map(
        (video) =>
          `## ${video.title}\n\n` +
          `- **频道**: ${video.channelName}\n` +
          `- **发布时间**: ${video.pubDate}\n` +
          `- **链接**: ${video.link}\n`
      )
      .join("\n---\n\n");

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `视频列表_${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 复制 Markdown 到剪贴板
  const copyMarkdown = () => {
    if (filteredVideos.length === 0) {
      setError("没有可复制的视频");
      return;
    }

    const markdown = filteredVideos
      .map(
        (video) =>
          `## ${video.title}\n\n` +
          `- **频道**: ${video.channelName}\n` +
          `- **发布时间**: ${video.pubDate}\n` +
          `- **链接**: ${video.link}\n`
      )
      .join("\n---\n\n");

    navigator.clipboard.writeText(markdown);
    alert("Markdown 已复制到剪贴板");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          视频订阅检索工具
        </h1>
        <p className="text-gray-600">
          订阅 YouTube 频道，按关键词检索视频，导出 Markdown
        </p>
      </div>

      {/* 标签切换 */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit mb-6">
        <button
          onClick={() => setActiveTab("channels")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "channels"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          频道管理
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "search"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          检索视频
        </button>
      </div>

      {/* 频道管理页面 */}
      {activeTab === "channels" && (
        <div className="space-y-6">
          {/* 添加频道 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              添加频道
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube 频道链接
                </label>
                <input
                  type="text"
                  value={newChannelUrl}
                  onChange={(e) => setNewChannelUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@channelname"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  支持格式: @用户名、/channel/UCxxx、/c/频道名、/user/用户名
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  频道名称（可选）
                </label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="自定义名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {error && activeTab === "channels" && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <button
                onClick={addChannel}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加频道
              </button>
            </div>
          </div>

          {/* 频道列表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              已订阅频道 ({channels.length})
            </h2>
            {channels.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                暂无订阅频道，请添加频道
              </p>
            ) : (
              <div className="space-y-2">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {channel.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {channel.url}
                      </div>
                    </div>
                    <button
                      onClick={() => removeChannel(channel.id)}
                      className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 检索页面 */}
      {activeTab === "search" && (
        <div className="space-y-6">
          {/* 操作按钮 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={fetchRssData}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "获取中..." : "获取最新视频"}
              </button>
              <button
                onClick={exportMarkdown}
                disabled={filteredVideos.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                导出 Markdown
              </button>
              <button
                onClick={copyMarkdown}
                disabled={filteredVideos.length === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                复制 Markdown
              </button>
            </div>
            {error && activeTab === "search" && (
              <div className="mt-3 text-red-600 text-sm">{error}</div>
            )}
          </div>

          {/* 搜索框 */}
          {videos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchVideos()}
                  placeholder="输入关键词搜索视频..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={searchVideos}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  搜索
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                共 {filteredVideos.length} 个视频
                {searchKeyword && `（筛选自 ${videos.length} 个）`}
              </p>
            </div>
          )}

          {/* 视频列表 */}
          {filteredVideos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                视频列表
              </h2>
              <div className="space-y-4">
                {filteredVideos.map((video, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">
                      {video.title}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">频道:</span>{" "}
                        {video.channelName}
                      </p>
                      <p>
                        <span className="font-medium">发布时间:</span>{" "}
                        {video.pubDate}
                      </p>
                      <p className="truncate">
                        <span className="font-medium">链接:</span>{" "}
                        <a
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {video.link}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {videos.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              点击"获取最新视频"按钮开始检索
            </div>
          )}
        </div>
      )}

      {/* 使用说明 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">使用说明</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>在"频道管理"页面添加 YouTube 频道链接</li>
          <li>切换到"检索视频"页面，点击"获取最新视频"</li>
          <li>使用关键词搜索过滤视频</li>
          <li>支持导出 Markdown 文件或复制到剪贴板</li>
          <li>频道列表会自动保存在浏览器本地</li>
        </ul>
      </div>
    </div>
  );
}
