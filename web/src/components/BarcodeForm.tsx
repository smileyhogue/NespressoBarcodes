"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  Collapse,
  Paper,
  Alert,
  Grid,
  Autocomplete,
  Tooltip,
  IconButton,
  Typography,
  SelectChangeEvent
} from "@mui/material";
import { ExpandMore, ExpandLess, InfoOutlined } from "@mui/icons-material";
import { BarcodeSegments, validateSegments } from "@/utils/generator";
import { COFFEE_PRESETS, getFormattedPresetName, getSegmentOptions, SegmentOption } from "@/utils/barcode-data";

interface BarcodeFormProps {
  value: BarcodeSegments;
  onChange: (segments: BarcodeSegments) => void;
}

const SEGMENT_INFO = [
  { label: "Segment 1", description: "First data block (4 bits). Purpose unknown, possibly series identifier." },
  { label: "Segment 2", description: "Second data block (4 bits). Purpose unknown." },
  { label: "Segment 3 (Water Qty)", description: "Third data block (4 bits). Controls water volume." },
  { label: "Segment 4", description: "Fourth data block (6 bits). Purpose unknown." },
];

export default function BarcodeForm({ value, onChange }: BarcodeFormProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-calculate options with labels
  const segmentOptions = useMemo(() => ({
    segment1: getSegmentOptions("segment1"),
    segment2: getSegmentOptions("segment2"),
    segment3: getSegmentOptions("segment3"),
    segment4: getSegmentOptions("segment4"),
  }), []);

  // Derive selected preset from current values
  const currentPresetName = useMemo(() => {
    const match = COFFEE_PRESETS.find(p =>
      p.segment1 === value.segment1 &&
      p.segment2 === value.segment2 &&
      p.segment3 === value.segment3 &&
      p.segment4 === value.segment4
    );
    return match ? match.name : "Custom";
  }, [value]);

  // On mount, apply default if empty
  useEffect(() => {
    if (!value.segment1) {
      applyPreset("Melozio");
    }
  }, []);

  const applyPreset = (name: string) => {
    const preset = COFFEE_PRESETS.find((p) => p.name === name);
    if (preset) {
      onChange({
        segment1: preset.segment1,
        segment2: preset.segment2,
        segment3: preset.segment3,
        segment4: preset.segment4,
      });
      setError(null);
    }
  };

  const handleSegmentChange = (key: keyof BarcodeSegments, newValue: string | SegmentOption | null) => {
    // If null, do nothing
    if (newValue === null) return;

    // Extract string value whether it's an object or string (freeSolo)
    const strValue = typeof newValue === 'string' ? newValue : newValue.value;

    // Only update if actually different to prevent loops
    if (value[key] === strValue) return;

    const newSegments = { ...value, [key]: strValue };
    onChange(newSegments);

    const validationError = validateSegments(newSegments);
    setError(validationError);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="preset-select-label">Select Coffee Type</InputLabel>
        <Select
          labelId="preset-select-label"
          value={currentPresetName}
          label="Select Coffee Type"
          onChange={(event) => applyPreset(event.target.value as string)}
        >
          <MenuItem value="Custom">
            <em>Custom Configuration</em>
          </MenuItem>
          {COFFEE_PRESETS.map((p) => (
            <MenuItem key={p.name} value={p.name}>
              {getFormattedPresetName(p)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2 }}>
        <Button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          endIcon={isAdvancedOpen ? <ExpandLess /> : <ExpandMore />}
          sx={{ color: "secondary.main", textTransform: "none", fontWeight: "bold" }}
        >
          {isAdvancedOpen ? "Hide Advanced Segments" : "Show Advanced Segments"}
        </Button>

        <Collapse in={isAdvancedOpen}>
          <Paper variant="outlined" sx={{ p: 2, mt: 2, backgroundColor: "grey.50" }}>
            <Grid container spacing={3}>
              {(["segment1", "segment2", "segment3", "segment4"] as const).map((seg, i) => {
                const options = segmentOptions[seg as keyof typeof segmentOptions];

                return (
                  <Grid size={{ xs: 12, md: 6 }} key={seg} sx={i === 3 ? { gridColumn: { md: "span 2" } } : {}}>
                    <Box sx={{ mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                          {SEGMENT_INFO[i].label}
                        </Typography>
                        <Tooltip title={SEGMENT_INFO[i].description}>
                          <InfoOutlined sx={{ fontSize: 16, ml: 1, color: "text.disabled" }} />
                        </Tooltip>
                      </Box>

                      <Autocomplete
                        fullWidth
                        freeSolo
                        options={options}
                        // Match the current string value to the option object if possible
                        value={
                          options.find(o => o.value === value[seg]) || value[seg] || ""
                        }
                        onChange={(_, newValue) => handleSegmentChange(seg, newValue)}
                        onInputChange={(_, newInputValue, reason) => {
                          // Only trigger change on direct input
                          if (reason === 'input') {
                            // If the input contains non-binary characters, do not update the segment value.
                            // This allows the user to type "Melozio" to filter, without breaking validation
                            // by setting the segment code to "Melozio".
                            if (/^[01]*$/.test(newInputValue)) {
                              handleSegmentChange(seg, newInputValue);
                            }
                          }
                        }}
                        getOptionLabel={(option) => {
                          if (typeof option === 'string') return option;
                          return `${option.label}`;
                        }}
                        renderOption={(props, option) => {
                          const { key, ...optionProps } = props;
                          return (
                            <li key={key} {...optionProps}>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {typeof option === 'string' ? option : option.label}
                                </Typography>
                                {typeof option !== 'string' && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    Code: {option.value}
                                  </Typography>
                                )}
                              </Box>
                            </li>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!error}
                            inputProps={{
                              ...params.inputProps,
                              maxLength: i === 3 ? 6 : 4,
                              style: { fontFamily: "monospace" }
                            }}
                            variant="outlined"
                            size="small"
                            placeholder="Select or type..."
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Collapse>
      </Box>
    </Box>
  );
}
