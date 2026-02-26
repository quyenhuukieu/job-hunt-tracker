{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get"],
      "route": "applications"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}