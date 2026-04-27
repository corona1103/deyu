import { gsap } from 'gsap'

export interface ScoreAnimationOptions {
  x: number
  y: number
  score: number
  type?: 'positive' | 'negative' | 'late'
}

export function useScoreAnimation() {
  function showScoreAnimation(options: ScoreAnimationOptions) {
    const { x, y, score, type = 'positive' } = options

    // 创建动画元素
    const element = document.createElement('div')
    element.className = 'score-animation'
    element.textContent = `${score > 0 ? '+' : ''}${score}分`
    element.style.left = `${x}px`
    element.style.top = `${y}px`

    // 根据类型设置样式
    if (type === 'negative') {
      element.classList.add('negative')
    } else if (type === 'late') {
      element.classList.add('late')
    }

    document.body.appendChild(element)

    // 使用 GSAP 创建更丰富的动画
    gsap.fromTo(
      element,
      {
        opacity: 1,
        scale: 0.5,
        y: 0
      },
      {
        opacity: 0,
        scale: 1.3,
        y: -80,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          element.remove()
        }
      }
    )
  }

  function showStarBurst(x: number, y: number) {
    // 创建星星爆发动画
    const colors = ['#FFD700', '#FFA500', '#FF6347', '#FFB6C1', '#98FB98']
    const count = 8

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div')
      star.textContent = '★'
      star.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 24px;
        color: ${colors[i % colors.length]};
        pointer-events: none;
        z-index: 1000;
      `
      document.body.appendChild(star)

      const angle = (i / count) * Math.PI * 2
      const distance = 60 + Math.random() * 40

      gsap.to(star, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0.5,
        rotation: Math.random() * 360,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          star.remove()
        }
      })
    }
  }

  function showConfetti(x: number, y: number) {
    // 彩纸动画（用于特殊成就）
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    const count = 15

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div')
      confetti.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        background: ${colors[i % colors.length]};
        pointer-events: none;
        z-index: 1000;
        border-radius: 2px;
      `
      document.body.appendChild(confetti)

      gsap.to(confetti, {
        x: (Math.random() - 0.5) * 200,
        y: Math.random() * 100 + 50,
        rotation: Math.random() * 720,
        opacity: 0,
        duration: 1 + Math.random() * 0.5,
        ease: 'power1.out',
        onComplete: () => {
          confetti.remove()
        }
      })
    }
  }

  return {
    showScoreAnimation,
    showStarBurst,
    showConfetti
  }
}
