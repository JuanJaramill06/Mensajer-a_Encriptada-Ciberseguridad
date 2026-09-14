class MatrixEffect {
  constructor() {
    this.canvas = document.getElementById('matrix-bg');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;

    this.chars = '01';
    this.charSize = 9;
    this.columns = Math.floor(this.width / this.charSize);
    this.drops = Array(this.columns).fill(0);

    this.frameCounter = 0;
    this.colors = {
      bright: '#00FF88',
      dim: '#00CCFF',
      veryDim: '#0088FF'
    };

    this.animate();

    window.addEventListener('resize', () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
      this.columns = Math.floor(this.width / this.charSize);
      this.drops = Array(this.columns).fill(0);
    });
  }

  animate() {
    this.ctx.fillStyle = 'rgba(10, 10, 21, 0.02)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.font = `${this.charSize}px monospace`;
    this.ctx.textAlign = 'left';

    this.frameCounter++;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.charSize;
      const y = this.drops[i] * this.charSize;

      const brightness = Math.random();
      if (brightness > 0.75) {
        this.ctx.fillStyle = this.colors.bright;
        this.ctx.globalAlpha = 0.4;
      } else if (brightness > 0.45) {
        this.ctx.fillStyle = this.colors.dim;
        this.ctx.globalAlpha = 0.25;
      } else {
        this.ctx.fillStyle = this.colors.veryDim;
        this.ctx.globalAlpha = 0.1;
      }

      this.ctx.fillText(char, x, y);

      if (this.frameCounter % 3 === 0) {
        this.drops[i]++;
      }

      if (this.drops[i] * this.charSize > this.height && Math.random() > 0.95) {
        this.drops[i] = 0;
      }
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MatrixEffect();
});
