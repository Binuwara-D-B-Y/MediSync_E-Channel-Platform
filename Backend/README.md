# Backend — Port binding and fallback

This file documents how the backend chooses which HTTP port to listen on and how to override or troubleshoot it.

Behavior
- Preferred port: the app reads the `PORT` environment variable. If `PORT` is not set the app defaults to `5000`.
- Fallback: if the preferred port (e.g. `5000`) is unavailable (address in use) the app will try `5001`.
- If both the preferred port and `5001` are unavailable, the app will log the condition and then attempt to bind to the preferred port; Kestrel will surface the bind error (the process will fail to start).

What changed recently
- An earlier implementation tried to pick an ephemeral port automatically when both 5000 and 5001 were busy. That behavior has been removed. The app now prefers explicit ports and fails fast when your chosen ports are taken.

Useful commands (macOS / zsh)
- Run the backend using an explicit port:

```bash
cd Backend
export PORT=5001   # set whichever port you want
export DB_PASSWORD="<your-db-password>"
dotnet run
```

- Check which process is using a port (example: 5000):

```bash
lsof -i :5000
# Example output includes the PID in the second column
```

- Kill the process that's using a port (replace <PID>):

```bash
kill -9 <PID>
```

Notes
- The app prints a console message indicating which port it will try to use (for example: "Port 5000 is unavailable. Trying fallback port 5001..." or "App running on port 5000").
- If you want a different behavior (for example: always fail fast, or permit ephemeral ports), I can add an environment toggle such as `ALLOW_EPHEMERAL_PORTS=true` to control it.

Contact
- If you hit a bind failure, include the console output and the results of `lsof -i :<port>` when you ask for help.
