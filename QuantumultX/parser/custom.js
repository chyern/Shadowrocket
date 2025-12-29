/**
 * Quantumult X 资源解析器 - 兼容性增强版
 * 功能：转换 DOMAIN 为 HOST，并补全策略位防止 result type error
 */

const content = $resource.content;

function main() {
    if (!content) {
        $done({ error: "未能读取到内容" });
        return;
    }

    // 预设一个占位策略名，如果你在 URL 后面写了 force-policy，QX 会自动覆盖这个 Proxy
    const defaultPolicy = "Proxy";

    const processedLines = content.split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line && !line.startsWith("#") && !line.startsWith(";")) // 过滤空行和注释
        .map(line => {
            let parts = line.split(",").map(p => p.trim());
            
            // 如果只有 类型 和 域名（例如 DOMAIN-SUFFIX,example.com）
            if (parts.length >= 2) {
                let type = parts[0].toUpperCase();
                let domain = parts[1];
                let policy = parts[2] || defaultPolicy; // 如果原规则没写策略，补一个

                // 转换类型名称
                if (type === "DOMAIN") type = "HOST";
                if (type === "DOMAIN-SUFFIX") type = "HOST-SUFFIX";
                if (type === "DOMAIN-KEYWORD") type = "HOST-KEYWORD";

                return `${type},${domain},${policy}`;
            }
            
            return line;
        });

    $done({ content: processedLines.join("\n") });
}

main();
