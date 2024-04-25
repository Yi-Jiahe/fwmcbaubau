function milestonePower(prevGlobalBauCount: number, globalBauCount: number): number {
  for (let i=6; i >= 1; i--) {
    const d = Math.pow(10, i);
    // Count has crossed 10^i 
    if (Math.floor(globalBauCount / d) > Math.floor(prevGlobalBauCount / d)) {
      return i;
    }
  }

  return 0;
}

export { milestonePower };