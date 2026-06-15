# Alert & Notification Copy — The Boiler Room

## Indicator lamp states
- normal: Holding steady
- warning: Building pressure
- critical: Relief valve venting

## Desktop notification (on threshold breach)
- Title: Boiler Room
- Body: {RESOURCE} at {VALUE}% — pressure past your set limit.

Examples:
- CPU FURNACE at 91% — pressure past your set limit.
- MEMORY BOILER at 96% — pressure past your set limit.

## Threshold controls
- Label pattern: {RESOURCE} alarm at {VALUE}%
- Helper: Drag the valve to set the pressure at which this gauge sounds the alarm.

## Notification settings
- Desktop notifications: Notify me on this device
- Browser permission prompt rationale: The Boiler Room would like to raise desktop alarms when a gauge passes your limit.
- Webhook field label: Alarm webhook URL (optional)
- Webhook helper: We POST a small JSON alarm to this address. Best effort — leave blank to skip.
