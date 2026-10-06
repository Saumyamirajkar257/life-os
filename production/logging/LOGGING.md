# Aura Production Logging Architecture

## Logger Levels & Dispatch Channels
- **Debug**: Internal store transitions and component mounts.
- **Info**: System status changes and user navigation.
- **Warning**: Potential memory or network latency bottlenecks.
- **Error**: Unhandled exceptions and boundary catches.
- **Perf**: Function and async operation timing telemetry.
- **Analytics**: User interaction events and feature usage tracking.
