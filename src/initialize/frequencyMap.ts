const A_FREQ = 440;
function calculateNoteFrequency(note: number) {
  return (A_FREQ / 32) * (2 ** ((note - 9) / 12))
}
type FrequencyMap = { [index: number]: number };

const frequencyMap: FrequencyMap = Array.from({length: 88})
  .fill(null)
  .reduce((res: any, v: any, i: number) => { 
    const n = i + 1; 
    res[n] = calculateNoteFrequency(i+1); 
    return res;
  }, {}
) as FrequencyMap;

export default frequencyMap;