# Nomad Job Definitions

One `.hcl` file per service. Submit jobs with:

```bash
nomad job run <service>.hcl
```

## Job Files (to be created — Phase 0)

| File | Service | Account | Port |
|------|---------|---------|------|
| `medusa.hcl` | Medusa v2 commerce API | 4 | 9000 |
| `typesense.hcl` | Typesense search | 2 | 8108 |
| `trigger.hcl` | Trigger.dev job runner | 2 | 3030 |
| `ollama.hcl` | Ollama AI inference | 3 | 11434 |
| `lago.hcl` | Lago billing | 5 | 3000 |
| `calcom.hcl` | Cal.com scheduling | 6 | 3000 |
| `prometheus.hcl` | Prometheus metrics | 7 | 9090 |
| `grafana.hcl` | Grafana dashboards | 7 | 3000 |
| `mcp-server.hcl` | BrandingOS MCP server | 1 | 8080 |

## Cluster Setup

Account 1 is the Nomad server + Consul server + Vault. All other accounts run Nomad clients that join the cluster.

### Bootstrap (Account 1)

```bash
# Consul
consul agent -server -bootstrap-expect=1 -ui -client=0.0.0.0

# Vault
vault server -config=/etc/vault.d/vault.hcl

# Nomad server
nomad agent -config=/etc/nomad.d/server.hcl
```

### Client setup (Accounts 2–7)

```bash
nomad agent -config=/etc/nomad.d/client.hcl
```

## Service Discovery

All services register with Consul automatically via Nomad's Consul integration.
Internal DNS: `<service>.service.consul`
