const content = $resource.content;
const url = $resource.url;

function main() {
    if (!content) {
        $done({ error: "未能读取到内容" });
        return;
    }

    // 按行切割
    let lines = content.split(/\r?\n/);
    let result = lines.map(line => {
        let trimLine = line.trim();
        
        // 1. 忽略注释行和空行
        if (trimLine === "" || trimLine.startsWith("#") || trimLine.startsWith(";")) {
            return trimLine;
        }

        // 2. 转换规则逻辑
        // 小火箭: DOMAIN-SUFFIX,example.com,REJECT
        // 圈X: DOMAIN-SUFFIX,example.com,REJECT
        // 核心是确保去除可能存在的 Proxy/DIRECT 标签，并统一为 REJECT
        let parts = trimLine.split(",");
        if (parts.length >= 2) {
            let type = parts[0].trim().toUpperCase();
            let val = parts[1].trim();
            
            // 针对黑名单，强制将第三参数设为 REJECT
            return `${type},${val},REJECT`;
        }

        return trimLine;
    }).join("\n");

    $done({ content: result });
}

main();
