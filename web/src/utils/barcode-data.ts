export type CoffeePreset = {
  name: string;
  waterQuantity: string;
  segment1: string;
  segment2: string;
  segment3: string;
  segment4: string;
};

export const COFFEE_PRESETS: CoffeePreset[] = [
  { name: "Alto Intenso", waterQuantity: "414 ml", segment1: "1001", segment2: "0010", segment3: "1000", segment4: "010110" },
  { name: "Alto Dolce", waterQuantity: "414 ml", segment1: "1111", segment2: "0100", segment3: "1000", segment4: "010110" },
  { name: "Giorno", waterQuantity: "230 ml", segment1: "1010", segment2: "1110", segment3: "0100", segment4: "001000" },
  { name: "Colombia", waterQuantity: "230 ml", segment1: "1100", segment2: "0001", segment3: "0010", segment4: "010110" },
  { name: "Melozio", waterQuantity: "230 ml", segment1: "1100", segment2: "1101", segment3: "0100", segment4: "010110" },
  { name: "Odacio", waterQuantity: "230 ml", segment1: "1100", segment2: "0010", segment3: "0100", segment4: "010110" },
  { name: "Stormio", waterQuantity: "230 ml", segment1: "1100", segment2: "0010", segment3: "0100", segment4: "010110" },
  { name: "Madeline", waterQuantity: "230 ml", segment1: "1010", segment2: "0010", segment3: "0100", segment4: "010110" },
  { name: "Vanizio", waterQuantity: "230 ml", segment1: "1100", segment2: "1101", segment3: "0100", segment4: "010110" },
  { name: "Decaffeinato", waterQuantity: "230 ml", segment1: "1001", segment2: "1110", segment3: "0100", segment4: "001000" },
  { name: "Blanco Forte", waterQuantity: "230 ml", segment1: "1111", segment2: "0100", segment3: "0010", segment4: "010110" },
  { name: "Pumpkin Spice Cake", waterQuantity: "230 ml", segment1: "1010", segment2: "0010", segment3: "0100", segment4: "001110" },
  { name: "Hazelino Muffin", waterQuantity: "230 ml", segment1: "1100", segment2: "1101", segment3: "0100", segment4: "001110" },
  { name: "Ice Forte (230ml)", waterQuantity: "230 ml", segment1: "1010", segment2: "0010", segment3: "0100", segment4: "010101" },
  { name: "Vanilla Custard Pie", waterQuantity: "230 ml", segment1: "1100", segment2: "1101", segment3: "0100", segment4: "001101" },
  { name: "Chocolate Fudge", waterQuantity: "230 ml", segment1: "1111", segment2: "0100", segment3: "0010", segment4: "001110" },
  { name: "Ice Forte (Alt)", waterQuantity: "230 ml", segment1: "0101", segment2: "0110", segment3: "0100", segment4: "100100" },
  { name: "Aflorazio", waterQuantity: "150 ml", segment1: "1010", segment2: "1000", segment3: "1110", segment4: "001110" },
  { name: "Fortado", waterQuantity: "150 ml", segment1: "1111", segment2: "1011", segment3: "1110", segment4: "001110" },
  { name: "Ethiopia Gran Lungo", waterQuantity: "150 ml", segment1: "1100", segment2: "0100", segment3: "1110", segment4: "010101" },
  { name: "Costa Rica", waterQuantity: "150 ml", segment1: "1001", segment2: "1011", segment3: "1110", segment4: "100011" },
  { name: "Double Expresso Scuro", waterQuantity: "80 ml", segment1: "1010", segment2: "1011", segment3: "0001", segment4: "001110" },
  { name: "Double Expresso Chiaro", waterQuantity: "80 ml", segment1: "1100", segment2: "1011", segment3: "0001", segment4: "001110" },
  { name: "Blanco Leggero", waterQuantity: "80 ml", segment1: "1111", segment2: "1101", segment3: "0001", segment4: "001110" },
  { name: "Iced Leggero", waterQuantity: "80 ml", segment1: "1010", segment2: "1011", segment3: "0001", segment4: "010101" },
  { name: "Diavolito", waterQuantity: "40 ml", segment1: "1001", segment2: "1101", segment3: "1011", segment4: "001101" },
  { name: "Altissio", waterQuantity: "40 ml", segment1: "1010", segment2: "1101", segment3: "1011", segment4: "010101" },
  { name: "Deca Intenso", waterQuantity: "40 ml", segment1: "1010", segment2: "0010", segment3: "1011", segment4: "010101" },
  { name: "Paris Black", waterQuantity: "40 ml", segment1: "1100", segment2: "1000", segment3: "1011", segment4: "001101" },
  { name: "Voltesso", waterQuantity: "40 ml", segment1: "1001", segment2: "0010", segment3: "1011", segment4: "010101" },
];

export interface SegmentOption {
  value: string;
  label: string;
  description: string;
}

export function getSegmentOptions(segmentKey: keyof CoffeePreset): SegmentOption[] {
  // Group presets by segment value
  const groups = new Map<string, CoffeePreset[]>();
  
  COFFEE_PRESETS.forEach(preset => {
    const val = preset[segmentKey];
    if (!groups.has(val)) {
      groups.set(val, []);
    }
    groups.get(val)?.push(preset);
  });

  const options: SegmentOption[] = [];
  
  groups.forEach((presets, value) => {
    // Determine label based on segment key
    let label = "";
    if (segmentKey === "segment3") {
      // Segment 3 is Water Quantity
      // Check if all have same water qty
      const quantities = Array.from(new Set(presets.map(p => p.waterQuantity)));
      if (quantities.length === 1) {
        // Convert to oz
        const ml = parseInt(quantities[0]);
        const oz = (ml * 0.033814).toFixed(1).replace('.0', '');
        label = `${quantities[0]} (~${oz} oz)`;
      } else {
        label = `Mixed Volumes (${quantities.join(", ")})`;
      }
    } else {
      // For other segments, just list the first few coffee names
      const names = presets.map(p => p.name);
      if (names.length <= 3) {
        label = names.join(", ");
      } else {
        label = `${names.slice(0, 3).join(", ")} +${names.length - 3} more`;
      }
    }

    options.push({
      value,
      label,
      description: `Used in: ${presets.map(p => p.name).join(", ")}`
    });
  });

  // Sort by value roughly
  return options.sort((a, b) => a.label.localeCompare(b.label));
}

export function getFormattedPresetName(preset: CoffeePreset): string {
  // Convert ml to fl oz (approximate)
  const ml = parseInt(preset.waterQuantity);
  const oz = (ml * 0.033814).toFixed(1);
  // Remove .0 if present
  const ozStr = oz.endsWith('.0') ? oz.slice(0, -2) : oz;
  
  return `${preset.name} — ${preset.waterQuantity} (~${ozStr} fl oz)`;
}
