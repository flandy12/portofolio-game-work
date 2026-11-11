export function calculateScore(remainingSeconds, duration, baseScore, maximumBonus) {
  const safeRemaining = Math.max(0, Math.min(remainingSeconds, duration));
  const speedBonus = Math.floor((safeRemaining / duration) * maximumBonus);
  return { speedBonus, total: baseScore + speedBonus };
}

export function calculateAccuracy(correct, total) {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

export function getPerformance(accuracy) {
  if (accuracy >= 90) return { title: "Price Master!", message: "Insting belanjamu tajam. Hampir tak ada yang bisa mengecohmu." };
  if (accuracy >= 70) return { title: "Smart Shopper!", message: "Pilihanmu cerdas. Sedikit lagi menuju level master." };
  if (accuracy >= 50) return { title: "Price Explorer", message: "Awal yang bagus. Kamu makin mengenal harga pasar." };
  return { title: "Keep Practicing", message: "Setiap tebakan membuat insting belanjamu makin kuat." };
}
