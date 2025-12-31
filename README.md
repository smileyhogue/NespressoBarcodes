# Nespresso Vertuo Barcode Generator

A web tool for creating Nespresso Vertuo machine barcodes. This project allows you to generate valid barcodes for existing coffee types or create custom configurations.

## Features

*   **Barcode Generation**: Supports standard presets (Melozio, Stormio, etc.) and custom binary inputs.
*   **Units**: Displays water volume in both ml and fl oz.
*   **Advanced Control**:
    *   Manual segment editing (4 data blocks).
    *   Dropdowns with known/verified values for each segment.
    *   Descriptions for segment mappings (e.g., Segment 3 = Water Quantity).
*   **Print**: options for single testing or filling a standard page (12x grid).
*   **Tech**: Next.js 16 (App Router), Material UI, Docker.

## Usage

### Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Deployment

The project is configured for Docker and Portainer.

**Docker Compose**
Run the following in the root directory:
```bash
docker-compose up -d --build
```
The app will run at `http://localhost:4757`.

## Disclaimer

Not affiliated with Nespresso. Use at your own risk.

## Credits

Based on the work by [arandomdev](https://github.com/arandomdev/NespressoBarcodes).

## License

[MIT License](LICENSE)
