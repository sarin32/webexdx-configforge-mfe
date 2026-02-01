# WebExDX ConfigForge MFE

An Angular-based Micro-Frontend (MFE) for configuration management in the WebExDX platform.

## Features

- **Configuration Management**: intuitive UI for managing system configurations.
- **Modern UI**: built with Angular 20 and Spartan UI (Shadcn for Angular).
- **Responsive Design**: styled using Tailwind CSS 4.
- **State Management**: powered by RxJS signals and observables.

## Tech Stack

- **Framework**: Angular 20
- **UI Architecture**: Spartan UI (@spartan-ng/brain)
- **Styling**: Tailwind CSS 4, PostCSS
- **Icons**: Ng-Icons (Lucide)
- **Validation**: Biome
- **Build Tool**: Angular CLI

## Prerequisites

- **Node.js**: >= 22
- **Package Manager**: pnpm

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm run start
```

### Build

```bash
pnpm run build:prod
```

## Available Scripts

- `pnpm run start`: Starts the development server on port 4002.
- `pnpm run build:prod`: Creates a production build.
- `pnpm run lint`: Checks code quality with Biome.
- `pnpm run fix`: Fixes code issues with Biome.

## Docker

### Build

```bash
docker build -t webexdx-configforge-mfe --build-arg ENVIRONMENT=prod .
```

### Run

```bash
docker run -p 8081:80 webexdx-configforge-mfe
```

The application will be available at `http://localhost:8081`.

## License

Private
