# Infrastructure

HashiCorp stack (Nomad + Consul + Vault) across 7 Oracle Cloud Free Tier ARM64 accounts. Zero cost.

## Oracle Account Map

| Account | Services | Shape |
|---------|----------|-------|
| 1 | Control plane — Nomad server, Consul, Vault, MCP server | VM.Standard.A1.Flex (2 OCPU, 12 GB) |
| 2 | Typesense search, ffmpeg workers, Trigger.dev | VM.Standard.A1.Flex (2 OCPU, 12 GB) |
| 3 | Ollama — Llama 3.1 8B, Mistral 7B, Gemma 2 9B | VM.Standard.A1.Flex (2 OCPU, 12 GB) |
| 4 | Medusa v2 commerce API (port 9000) | VM.Standard.A1.Flex (2 OCPU, 12 GB) |
| 5 | Lago billing (AGPL-3, port 3000) | VM.Standard.A1.Flex (2 OCPU, 12 GB) |
| 6 | Cal.com self-hosted scheduling | VM.Standard.A1.Flex (2 OCPU, 12 GB) |
| 7 | Prometheus + Grafana monitoring | VM.Standard.A1.Flex (2 OCPU, 12 GB) |

**Total free: 14 OCPU, 84 GB RAM, $0/month**

## Directory Layout

```
terraform/   Provision the 7 Oracle VMs, VCNs, security groups
nomad/       Deploy services onto those VMs with Nomad job files
docker/      Dockerfiles (linux/arm64/v8) for every service
```

## Getting Started

1. `terraform/` — provision VMs (see `terraform/README.md`)
2. Bootstrap Nomad cluster on Account 1
3. `nomad/` — submit job definitions (see `nomad/README.md`)

## Hard Limits (enforced by Terraform)

- Never exceed 85% CPU or 90% RAM on any single account
- All resources tagged with `prevent_destroy = true` to block accidental deletion
- No paid resources — only `VM.Standard.A1.Flex` and `BV.Standard.E4.Flex` Free Tier shapes
