const debrisMap = []
let LastDebrisId = 0

function debris(config) {
    config.start = ticks;
    config.id = LastDebrisId;
    LastDebrisId++;
    debrisMap.push(config);

    if (config.deleteAfter) {
        setTimeout(() => {
            const i = debrisMap.indexOf(config);
            if (i !== -1) debrisMap.splice(i, 1);
        }, config.deleteAfter);
    };

    return config.id
}

function removeDebris(id) {
    for (let i = 0; i < debrisMap.length; i++) {
        const config = debrisMap[i]
        if (config.id == id) {
            debrisMap.splice(i, 1);
            return true;
        }
    }
    return false
}

runAfterUpdate(() => {
    for (let i = debrisMap.length - 1; i >= 0; i--) {
        const config = debrisMap[i];

        if (config.deleteAfterTicks && ticks >= config.start + config.deleteAfterTicks) {
            debrisMap.splice(i, 1);
            continue;
        }

        if (!config.type) continue;

        const opacity = config.opacity ?? 1;
        ctx.globalAlpha = opacity;

        if (config.type === "pixel" && config.color && config.x !== undefined && config.y !== undefined) {
            ctx.fillStyle = config.color;
            ctx.fillRect(config.x * 10, config.y * 10, 10, 10);
        } else if (config.type === "text" && config.color && config.text && config.x !== undefined && config.y !== undefined && config.size) {
            ctx.fillStyle = config.color;
            ctx.font = `${config.size}px ps2p`;
            ctx.fillText(config.text, config.x * 10, config.y * 10);
        } else if (config.type === "rect" && config.color && config.x !== undefined && config.y !== undefined && config.width && config.height) {
            ctx.fillStyle = config.color;
            ctx.fillRect(config.x * 10, config.y * 10, config.width, config.height);
        } else if (config.type === "circle" && config.color && config.x !== undefined && config.y !== undefined && config.radius) {
            ctx.fillStyle = config.color;
            ctx.beginPath();
            ctx.arc((config.x * 10) + 5, (config.y * 10)+5, config.radius, 0, 2 * Math.PI);
            ctx.fill();
        } else if (config.type === "glow" && config.color && config.gColor && config.blur && config.x !== undefined && config.y !== undefined) {
            const strength = config.strength || 1;
            for (let j = 0; j < strength; j++) {
                ctx.shadowColor = config.gColor;
                ctx.shadowBlur = config.blur;
                ctx.fillStyle = config.color;
                ctx.fillRect(config.x * 10, config.y * 10, 10, 10);
                ctx.shadowBlur = 0;
            }
        }
        ctx.globalAlpha = 1;
    }
})