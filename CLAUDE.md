# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SonicPure Emitter Placement Optimizer is a single-page web application that helps users optimally place ultrasonic emitters in lakes and water bodies for algae and biofilm treatment. Users draw lake boundaries on an interactive map, optionally add islands/obstacles, and the app calculates optimal emitter positions to maximize coverage.

## Development

This is a static HTML application with no build system. To run locally:
- Open `index.html` directly in a browser, or
- Use any local HTTP server (e.g., `python -m http.server`)

No package manager, bundler, or compilation step is required.

## Architecture

The entire application lives in `index.html` as a self-contained file with embedded CSS and JavaScript.

### Key Components

**Map Layer**: Uses Leaflet.js with OpenStreetMap tiles. The map handles panning, zooming, and provides geo-coordinate conversions.

**Canvas Overlay**: A `<canvas>` element positioned over the Leaflet map handles all custom drawing:
- Lake boundary polygons
- Island/obstacle polygons
- Treatment zone circles (algae and biofilm radii)
- Emitter device markers (draggable)

**Drawing Modes**: The app has three modes controlled by the `mode` variable:
- `'none'`: Normal interaction, devices can be dragged
- `'lake'`: Drawing lake boundary polygon
- `'island'`: Drawing island/obstacle polygon

### Core Algorithms

**Optimization** (`btnOpt` click handler, lines 925-1014): Uses iterative local search with:
- Medial-axis bias: Initial placement favors positions far from shoreline
- Shore distance scoring: Early iterations weight positions toward lake center
- Coverage maximization: Later iterations optimize pure coverage percentage
- Island avoidance: Placement candidates inside islands are rejected

**Geometry Functions**:
- `pip()`: Point-in-polygon test
- `polyArea()`: Calculate polygon area in square meters
- `covPct()`: Calculate coverage percentage for given emitter positions
- `shoreDistM()`: Distance from point to nearest polygon edge
- `rayBlocked()`: Check if line of sight is blocked by islands

**Coordinate Systems**:
- Geographic (lat/lng) for storage and export
- Pixel coordinates for canvas rendering
- Metric (meters) for distance/area calculations via flat-earth approximation

### State Variables

- `lakePts[]`: Array of [lat, lng] points defining lake boundary
- `lakeDone`: Boolean, true when lake polygon is closed
- `islands[]`: Array of island objects, each with `pts` array and `closed` boolean
- `optDevs[]`: Array of [lat, lng] positions for optimized emitters
- `showBiofilm`, `showAlgae`: Toggle visibility of treatment zones

### External Dependencies

- Leaflet.js 1.9.4 (loaded from CDN)
- Nominatim API for location search
