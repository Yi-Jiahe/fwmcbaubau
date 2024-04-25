import confetti from 'canvas-confetti';

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function rainFwmcHearts(durationSeconds: number, scalar: number) {
  const pawPrints = confetti.shapeFromText({ text: '🐾', scalar });
  const blueHeart = confetti.shapeFromText({ text: '🩵', scalar });
  const pinkHeart = confetti.shapeFromText({ text: '🩷', scalar });

  const duration = durationSeconds * 1000;
  const animationEnd = Date.now() + duration;
  var skew = 1;

  (function frame() {
    var timeLeft = animationEnd - Date.now();
    var ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        // since particles fall down, skew start toward the top
        y: (Math.random() * skew) - 0.2
      },
      shapes: [pawPrints, blueHeart, pinkHeart],
      scalar,
      gravity: randomInRange(0.4, 0.6),
      drift: randomInRange(-0.4, 0.4)
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  }());
}

function shootFwmcHearts(durationSeconds: number, scalar: number) {
  const pawPrints = confetti.shapeFromText({ text: '🐾', scalar });
  const blueHeart = confetti.shapeFromText({ text: '🩵', scalar });
  const pinkHeart = confetti.shapeFromText({ text: '🩷', scalar });
  
  const duration = durationSeconds * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 20,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    shapes: [pawPrints, blueHeart, pinkHeart],
    scalar
  };

  let interval = setInterval(function (): void {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};

function shootSideConfetti() {
  const defaults = {
    particleCount: 50,
    spread: 55,
  }
  confetti({
    ...defaults,
    angle: 60,
    origin: { x: 0 },
  });
  confetti({
    ...defaults,
    angle: 120,
    origin: { x: 1 },
  });
}

export {
  rainFwmcHearts,
  shootFwmcHearts,
  shootSideConfetti,
}