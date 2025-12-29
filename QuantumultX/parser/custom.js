let rawContent = $resource.content;

rawContent = transition(rawContent);

$done({ content: rawContent });

function transition(content) {
    if (!content) return "";

    return content
        .split(/\r?\n/)
        .filter(line => {
            const trimmed = line.trim();
            if (trimmed === "") return false;
            if (
                trimmed.startsWith("#") || 
                trimmed.startsWith(";") || 
                trimmed.startsWith("//")
            ) {
                return false;
            }
            return true;
        })
        .map(line => {
            let processedLine = line;
            processedLine = shadowrocketToQuantumultX(processedLine);
            return processedLine;
        })
        .join("\n");
}

function shadowrocketToQuantumultX(line) {
    return line.replace(/DOMAIN-SUFFIX/g, "HOST-SUFFIX");
}
