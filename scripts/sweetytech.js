Hooks.on('preUpdateActor', async (actor, updateData, options, userId) => {
  if (!updateData.system?.attributes?.hp) return;

  const oldHp = actor.system.attributes.hp.value;
  const newHp = getProperty(updateData, 'system.attributes.hp.value');
  if (newHp >= oldHp) return;

  const damage = oldHp - newHp;
  const token = actor.getActiveTokens()[0];
  if (!token) return;

  const damageType = determineDamageType(); // Здесь можно добавить логику определения типа урона
  const color = getColorForDamageType(damageType);

  showDamageAboveToken(token, damage, color);
});

function determineDamageType() {
  // Здесь можно добавить вашу логику определения типа урона
  return 'generic';
}

function getColorForDamageType(type) {
  switch (type) {
    case 'fire': return '#FF4500';
    case 'cold': return '#00BFFF';
    case 'acid': return '#8B4513';
    case 'poison': return '#32CD32';
    case 'electricity': return '#FFD700';
    default: return '#FFFFFF';
  }
}

function showDamageAboveToken(token, damage, color) {
  const text = new PIXI.Text(`-${damage}`, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: color,
    stroke: '#000000',
    strokeThickness: 3
  });

  text.x = token.x + (token.width / 2) - (text.width / 2);
  text.y = token.y - text.height;

  canvas.stage.addChild(text);

  gsap.to(text, { y: text.y - 50, alpha: 0, duration: 1, onComplete: () => text.destroy() });
}
