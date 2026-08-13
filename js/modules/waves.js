/**
 * LAHAR - Wave SVG Generator
 *
 * Creates flowing textile-like wave curves using SVG paths.
 * This is LAHAR's visual signature - representing fabric movement
 * rather than ocean/water imagery.
 *
 * Wave types:
 * - Thin flowing lines (1-2px) for separators, hover states, dividers
 * - Organic shapes for decorative backgrounds
 * - Abstract ribbon integrated with logo letters
 */

class WaveGenerator {
  constructor() {
    this.svgNS = 'http://www.w3.org/2000/svg';

    // Wave presets - subtle, textile-like curves
    this.presets = {
      // Gentle S-curve
      gentle: 'M0,20 Q25,0 50,20 T100,20 T150,20 T200,20',
      // Soft wave
      soft: 'M0,30 C30,10 70,50 100,30 S150,10 200,30',
      // Flowing ribbon
      flowing: 'M0,25 C40,5 60,45 100,25 S160,5 200,25 S280,45 320,25',
      // Minimal wave
      minimal: 'M0,15 Q50,5 100,15 T200,15 T300,15',
      // Deep wave
      deep: 'M0,30 C20,10 40,50 60,30 S100,10 140,30 S180,50 220,30 S260,10 300,30'
    };
  }

  /**
   * Create an SVG wave path
   * @param {object} options - Configuration options
   */
  createWave(options = {}) {
    const {
      type = 'gentle',
      width = 200,
      height = 40,
      strokeColor = '#D8C7AD',
      strokeWidth = 1,
      fill = 'none',
      className = '',
      animated = false
    } = options;

    const svg = document.createElementNS(this.svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('fill', fill);
    svg.setAttribute('class', className);

    const path = document.createElementNS(this.svgNS, 'path');
    const d = this.getWavePath(type, width, height);
    path.setAttribute('d', d);
    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('fill', fill);

    if (animated) {
      path.classList.add('wave-animated');
    }

    svg.appendChild(path);
    return svg;
  }

  /**
   * Get SVG path data string
   */
  getWavePath(type, width, height) {
    const preset = this.presets[type] || this.presets.gentle;
    return preset;
  }

  /**
   * Create a decorative wave line element
   * For use as section dividers, underlines, etc.
   */
  createWaveLine(options = {}) {
    const {
      width = '100%',
      height = 30,
      className = '',
      animated = false,
      color = 'currentColor'
    } = options;

    const container = document.createElement('div');
    container.className = `wave-line ${className}`;
    container.style.cssText = `
      width: ${width};
      height: ${height}px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    `;

    const svg = this.createWave({
      type: 'flowing',
      width: typeof width === 'number' ? width : 600,
      height: height,
      strokeColor: color,
      strokeWidth: 1,
      animated: animated
    });

    container.appendChild(svg);
    return container;
  }

  /**
   * Create a flowing wave animation container
   * For hero sections and decorative backgrounds
   */
  createWaveBackground(options = {}) {
    const {
      className = '',
      opacity = 0.1,
      color = '#D8C7AD',
      animated = true
    } = options;

    const container = document.createElement('div');
    container.className = `wave-background ${className}`;
    container.style.cssText = `
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    `;

    // Create multiple wave layers for depth
    const waveConfigs = [
      { type: 'deep', top: '10%', scale: 1.5, opacity: opacity * 0.5 },
      { type: 'flowing', top: '30%', scale: 1.2, opacity: opacity * 0.7 },
      { type: 'gentle', top: '60%', scale: 1, opacity: opacity }
    ];

    waveConfigs.forEach((config, i) => {
      const svg = this.createWave({
        type: config.type,
        width: 800,
        height: 60,
        strokeColor: color,
        strokeWidth: 1,
        fill: 'none',
        animated: animated && i === 0
      });

      svg.style.cssText = `
        position: absolute;
        top: ${config.top};
        left: 50%;
        transform: translateX(-50%) scaleX(${config.scale});
        opacity: ${config.opacity};
      `;

      if (animated && i === 0) {
        svg.classList.add('animate-wave-float-slow');
      }

      container.appendChild(svg);
    });

    return container;
  }

  /**
   * Create animated wave line for text underlines
   */
  createTextWave(options = {}) {
    const {
      text = '',
      className = '',
      animated = true
    } = options;

    const container = document.createElement('span');
    container.className = `text-wave ${className}`;
    container.style.cssText = `
      display: inline-block;
      position: relative;
    `;

    // Add text
    const textSpan = document.createElement('span');
    textSpan.className = 'text-wave-text';
    textSpan.textContent = text;
    container.appendChild(textSpan);

    // Add wave underline
    const waveContainer = document.createElement('span');
    waveContainer.className = 'text-wave-line';
    waveContainer.style.cssText = `
      display: block;
      height: 20px;
      position: relative;
      margin-top: -5px;
    `;

    const svg = this.createWave({
      type: 'minimal',
      width: 100,
      height: 20,
      strokeColor: '#A65D45',
      strokeWidth: 1.5,
      fill: 'none',
      animated: animated
    });

    waveContainer.appendChild(svg);
    container.appendChild(waveContainer);

    return container;
  }

  /**
   * Create horizontal wave divider
   */
  createDivider(options = {}) {
    const {
      className = '',
      color = '#D8C7AD',
      height = 1,
      animated = false
    } = options;

    const container = document.createElement('div');
    container.className = `wave-divider ${className}`;
    container.style.cssText = `
      width: 100%;
      height: ${height}px;
      position: relative;
      overflow: hidden;
    `;

    const svg = this.createWave({
      type: 'flowing',
      width: 400,
      height: height + 10,
      strokeColor: color,
      strokeWidth: height,
      fill: 'none',
      animated: animated
    });

    svg.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `;

    container.appendChild(svg);
    return container;
  }
}

// Create global instance
const waveGenerator = new WaveGenerator();

/**
 * Initialize wave animations on scroll
 */
function initWaveAnimations() {
  const waveElements = document.querySelectorAll('[data-wave]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('wave-visible');
      }
    });
  }, {
    threshold: 0.2
  });

  waveElements.forEach(el => {
    observer.observe(el);
  });
}

// Export for module use
export { waveGenerator, WaveGenerator, initWaveAnimations };
