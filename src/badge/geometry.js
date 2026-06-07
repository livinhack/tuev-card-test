export function polar(center, deg, radius) {
    const rad = (deg - 90) * Math.PI / 180;

    return {
        x: center.x + Math.cos(rad) * radius,
        y: center.y + Math.sin(rad) * radius
    };
}

export function splitMarkerVertical(center, startDeg, endDeg, innerRadius, outerRadius, gapWidth) {
    const halfGap = gapWidth / 2;

    const pStartOuter = polar(center, startDeg, outerRadius);
    const pStartInner = polar(center, startDeg, innerRadius);
    const pEndOuter = polar(center, endDeg, outerRadius);
    const pEndInner = polar(center, endDeg, innerRadius);

    const outerCutLeft = {
        x: center.x - halfGap,
        y: center.y - Math.sqrt(Math.max(0, outerRadius * outerRadius - halfGap * halfGap))
    };

    const outerCutRight = {
        x: center.x + halfGap,
        y: center.y - Math.sqrt(Math.max(0, outerRadius * outerRadius - halfGap * halfGap))
    };

    const innerCutLeft = {
        x: center.x - halfGap,
        y: center.y - Math.sqrt(Math.max(0, innerRadius * innerRadius - halfGap * halfGap))
    };

    const innerCutRight = {
        x: center.x + halfGap,
        y: center.y - Math.sqrt(Math.max(0, innerRadius * innerRadius - halfGap * halfGap))
    };

    const leftPath = `
            M ${pStartOuter.x} ${pStartOuter.y}
            A ${outerRadius} ${outerRadius} 0 0 1 ${outerCutLeft.x} ${outerCutLeft.y}
            L ${innerCutLeft.x} ${innerCutLeft.y}
            A ${innerRadius} ${innerRadius} 0 0 0 ${pStartInner.x} ${pStartInner.y}
            Z
        `;

    const rightPath = `
            M ${outerCutRight.x} ${outerCutRight.y}
            A ${outerRadius} ${outerRadius} 0 0 1 ${pEndOuter.x} ${pEndOuter.y}
            L ${pEndInner.x} ${pEndInner.y}
            A ${innerRadius} ${innerRadius} 0 0 0 ${innerCutRight.x} ${innerCutRight.y}
            Z
        `;

    return { leftPath, rightPath };
}
