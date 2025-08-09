class CardObject {
    constructor(cardNumber, frontImgUrl, backImgUrl, width, height) {
        this.cardElement = document.createElement("div");
        this.cardElement.id = cardNumber;
        this.cardElement.style.width = width;
        this.cardElement.style.height = height;
        this.cardElement.classList.add("card");

        this.glowElement = document.createElement("div");
        this.glowElement.classList.add("glow");
        if (cardNumber[0] == "4" || cardNumber[2] == "1") {
            this.glowElement.classList.add("legend");
        }

        this.cardElement.appendChild(this.glowElement);

        this.frontElement = document.createElement("img");
        this.frontElement.classList.add("card-front");
        this.cardElement.appendChild(this.frontElement);

        this.backElement = document.createElement("img");
        this.backElement.classList.add("card-back");
        this.cardElement.appendChild(this.backElement);

        this.frontElement.src = frontImgUrl;
        this.backElement.src = backImgUrl;

        this.frontup = false;
        this.cardElement.classList.add("backup");

        this.cardElement.addEventListener("click", () => {
            this.frontup = !this.frontup;
            if (this.frontup) {
                this.cardElement.classList.remove("backup"); // 显示正面
                this.cardElement.classList.add("frontup");
                if (this.isLegend()) {
                    this.playParticleEffect(100, 400, "#f4b180ff");
                } else {
                    this.playParticleEffect(500, 200, "#f2f7d0ff");
                }
            } else {
                this.cardElement.classList.add("backup"); // 显示背面
                this.cardElement.classList.remove("frontup");
            }
        });
    }

    isLegend() {
        if (cardNumber[0] == "4") {
            return true;
        }
        if (cardNumber[2] == "1") {
            return true;
        }
        return false;
    }

    setParent(parentNode) {
        parentNode.appendChild(this.cardElement);
    }

    playParticleEffect(quantity = 60, size = 80, mainColor = "gold") {
        const rect = this.cardElement.getBoundingClientRect();
        const particleContainer = document.createElement("div");
        particleContainer.classList.add("particle-container");
        this.cardElement.appendChild(particleContainer);

        for (let i = 0; i < quantity; i++) {
            const particle = document.createElement("span");
            particle.classList.add("particle");

            // 随机决定从哪条边发射
            const edge = Math.floor(Math.random() * 4); // 0:top, 1:right, 2:bottom, 3:left
            let startX = 0,
                startY = 0;

            switch (edge) {
                case 0: // top
                    startX = Math.random() * rect.width;
                    startY = 0;
                    break;
                case 1: // right
                    startX = rect.width;
                    startY = Math.random() * rect.height;
                    break;
                case 2: // bottom
                    startX = Math.random() * rect.width;
                    startY = rect.height;
                    break;
                case 3: // left
                    startX = 0;
                    startY = Math.random() * rect.height;
                    break;
            }

            // 粒子初始位置（相对于卡牌）
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;

            // 飞行方向
            const angle = Math.random() * 360;
            const distance = Math.random() * (size * 0.6) + size * 0.4; // 飞行距离
            const duration = Math.random() * 0.6 + 0.6;

            // 设置CSS变量
            particle.style.setProperty("--angle", `${angle}deg`);
            particle.style.setProperty("--distance", `${distance}px`);
            particle.style.animationDuration = `${duration}s`;

            // 渐变色
            particle.style.background = `radial-gradient(circle, ${mainColor}, ${this._shadeColor(
                mainColor,
                -40
            )})`;

            particleContainer.appendChild(particle);
        }

        // 动画结束后移除
        setTimeout(() => {
            particleContainer.remove();
        }, 4000);
    }

    // 辅助函数：颜色加深
    _shadeColor(color, percent) {
        let f = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        if (!f) return color;
        let r = parseInt(f[1], 16),
            g = parseInt(f[2], 16),
            b = parseInt(f[3], 16);
        return `rgb(${Math.min(255, r + (r * percent) / 100)}, ${Math.min(
            255,
            g + (g * percent) / 100
        )}, ${Math.min(255, b + (b * percent) / 100)})`;
    }
}
