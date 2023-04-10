// Randomly sort an array where the result is the same every day, but different every day
export function randomSortDay<T>(array: T[]): T[] {
  const date = new Date()
  const num = date.getDate() + date.getMonth() + date.getFullYear()
  return shuffle(array, num)
}

function shuffle<T>(array: T[], num: number): T[] {
  let currentIndex = array.length,  randomIndex;
  const random = seed(num)

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function seed(s: number) {
  const mask = 0xffffffff;
  let m_w  = (123456789 + s) & mask;
  let m_z  = (987654321 - s) & mask;

  return function() {
    m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

    let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
  }
}
