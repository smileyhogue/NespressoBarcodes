export type BarcodeSegments = {
  segment1: string;
  segment2: string;
  segment3: string;
  segment4: string;
};

export function validateSegments(segments: BarcodeSegments): string | null {
  const { segment1, segment2, segment3, segment4 } = segments;
  
  if (![segment1, segment2, segment3].every(s => s.length === 4 && /^[01]+$/.test(s))) {
    return "Segments 1, 2, and 3 must be 4 characters long and contain only 0s and 1s";
  }
  
  if (segment4.length !== 6 || !/^[01]+$/.test(segment4)) {
    return "Segment 4 must be 6 characters long and contain only 0s and 1s";
  }
  
  return null;
}

export function generateBarcodeString(segments: BarcodeSegments): string {
  const { segment1, segment2, segment3, segment4 } = segments;
  
  const format = (sep1: string, sep2: string, sep3: string, sep4: string) => {
    return `01${segment1}${sep1}${segment2}${sep2}${segment3}${sep3}${segment4}${sep4}`;
  };
  
  let formattedCode = "";
  
  // Pattern 1
  formattedCode += format("10", "10", "10", "01");
  // Pattern 2
  formattedCode += format("10", "01", "01", "10");
  // Pattern 3
  formattedCode += format("01", "10", "01", "01");
  // Pattern 4
  formattedCode += format("01", "01", "01", "01");
  // Pattern 5
  formattedCode += format("01", "01", "10", "10");
  
  return formattedCode;
}
