import Link from "next/link";

const tools = [
  {
    id: "password",
    name: "密码生成器",
    description: "生成安全随机密码，支持自定义长度和字符类型",
    icon: "🔐",
    href: "/tools/password",
  },
  {
    id: "json",
    name: "JSON 格式化",
    description: "JSON 数据的美化、压缩和验证工具",
    icon: "📋",
    href: "/tools/json",
  },
  {
    id: "base64",
    name: "Base64 编解码",
    description: "文本与 Base64 格式互相转换",
    icon: "🔤",
    href: "/tools/base64",
  },
  {
    id: "timestamp",
    name: "时间戳转换",
    description: "Unix 时间戳与日期时间互相转换",
    icon: "⏰",
    href: "/tools/timestamp",
  },
  {
    id: "video-subscriber",
    name: "视频订阅检索",
    description: "订阅 YouTube 频道，按关键词检索视频并导出 Markdown",
    icon: "📺",
    href: "/tools/video-subscriber",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          我的工具箱
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          汇集各种实用的在线小工具，无需下载安装，打开即用
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {tool.icon}
              </span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          更多工具正在开发中
        </h3>
        <p className="text-blue-700">
          如果你有想要的工具，欢迎提出建议
        </p>
      </div>
    </div>
  );
}
