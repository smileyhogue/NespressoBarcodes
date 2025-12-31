"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip
} from "@mui/material";
import { Print, GridOn, LocalCafe } from "@mui/icons-material";
import BarcodeForm from "@/components/BarcodeForm";
import BarcodeCanvas from "@/components/BarcodeCanvas";
import { BarcodeSegments, generateBarcodeString } from "@/utils/generator";

export default function Home() {
  const [segments, setSegments] = useState<BarcodeSegments>({
    segment1: "",
    segment2: "",
    segment3: "",
    segment4: "",
  });

  const [barcodeCode, setBarcodeCode] = useState<string>("");
  const [printMode, setPrintMode] = useState<"single" | "batch">("single");

  useEffect(() => {
    if (segments.segment1 && segments.segment2 && segments.segment3 && segments.segment4) {
      const code = generateBarcodeString(segments);
      setBarcodeCode(code);
    }
  }, [segments]);

  const handlePrint = (mode: "single" | "batch") => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      {/* Header - Hidden on Print */}
      <AppBar position="static" sx={{ bgcolor: "background.paper", color: "text.primary", boxShadow: 1 }} className="no-print">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <Box sx={{ bgcolor: "primary.main", color: "secondary.main", p: 1, borderRadius: 1, display: "flex" }}>
              <LocalCafe />
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                Vertuo Generator
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Custom Barcode Creation Suite
              </Typography>
            </Box>
          </Box>
          <Chip label="Ready to Print" color="secondary" variant="outlined" size="small" sx={{ fontWeight: "bold" }} />
        </Toolbar>
      </AppBar>

      {/* Main Content - Hidden on Print */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }} className="no-print">
        <Grid container spacing={4}>
          {/* Left Column: Configuration */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                <Box component="span" sx={{ width: 6, height: 24, bgcolor: "secondary.main", borderRadius: 4 }} />
                Configuration
              </Typography>
              <BarcodeForm value={segments} onChange={setSegments} />
            </Paper>

            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Design Tip:</strong> Select a preset to load known functional codes. For custom volumes, stick to official presets and modify only the water segment.
              </Typography>
            </Box>
          </Grid>

          {/* Right Column: Preview & Actions */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", overflow: "visible" }}>
              <CardContent sx={{ p: 6, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold" }}>Live Preview</Typography>

                <Box sx={{
                  width: 300,
                  height: 300,
                  bgcolor: "background.paper",
                  borderRadius: "50%",
                  boxShadow: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  mb: 4
                }}>
                  {barcodeCode ? (
                    <Box sx={{ width: "100%", height: "100%", p: 3 }}>
                      <BarcodeCanvas code={barcodeCode} />
                    </Box>
                  ) : (
                    <Box sx={{ color: "text.disabled", textAlign: "center" }}>
                      <LocalCafe sx={{ fontSize: 48, mb: 1, opacity: 0.2 }} />
                      <Typography variant="body2" fontWeight="medium">No Code Generated</Typography>
                    </Box>
                  )}
                </Box>

                <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                  {barcodeCode ? `${barcodeCode.length} bits encoded` : "Waiting for input..."}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0, justifyContent: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Print />}
                  onClick={() => handlePrint("single")}
                  disabled={!barcodeCode}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Print Single
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  startIcon={<GridOn />}
                  onClick={() => handlePrint("batch")}
                  disabled={!barcodeCode}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Fill Page (12x)
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, textAlign: "center", color: "text.secondary" }} className="no-print">
        <Typography variant="caption">
          &copy; {new Date().getFullYear()} Nespresso Barcode Generator. Not affiliated with Nespresso.
        </Typography>
      </Box>

      {/* Print Area - Only visible on Print */}
      <Box className="only-print" sx={{ display: "none" }}>
        {barcodeCode && (
          <Box sx={{ width: "100%", height: "100%" }}>
            {printMode === "single" ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100vw", height: "100vh" }}>
                <div style={{ width: "2.26in", height: "2.26in" }}>
                  <BarcodeCanvas code={barcodeCode} />
                </div>
              </Box>
            ) : (
              <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.5rem",
                rowGap: "0.5rem",
                p: 1,
                justifyItems: "center",
                alignItems: "center"
              }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{
                    width: "2.26in",
                    height: "2.26in",
                    // Stagger every other row for better packing/visuals if desired, 
                    // but simple tight grid is safer for cutting.
                    // transform: Math.floor(i / 3) % 2 === 1 ? "translateX(1rem)" : "none" 
                  }}>
                    <BarcodeCanvas code={barcodeCode} />
                  </div>
                ))}

                <Box sx={{ gridColumn: "span 3", textAlign: "center", mt: 2 }}>
                  <Typography variant="caption" sx={{ fontFamily: "sans-serif", color: "grey.500", fontSize: "0.7rem" }}>
                    Generated by Vertuo Barcode Suite • scale 100% for 2.26"
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
