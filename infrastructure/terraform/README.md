# Terraform — Oracle Cloud Provisioning

Provisions the 7 Oracle Free Tier ARM64 VMs, VCNs, subnets, and security groups.

## Prerequisites

- Terraform >= 1.6
- Oracle Cloud CLI configured (`oci setup config`)
- One OCI profile per account in `~/.oci/config`

## Directory Structure (to be created — Phase 0)

```
modules/
  vm/           Reusable VM + VCN + security-group module
  firewall/     Security list rules (port whitelisting)
accounts/
  account-1/    Control plane + Consul/Vault/Nomad server
  account-2/    Typesense + Trigger.dev
  account-3/    Ollama
  account-4/    Medusa v2
  account-5/    Lago
  account-6/    Cal.com
  account-7/    Monitoring
```

## Usage

```bash
cd accounts/account-1
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply
```

## Hard Constraints

All VMs use `VM.Standard.A1.Flex` with:
- `ocpus = 2`
- `memory_in_gbs = 12`
- `lifecycle { prevent_destroy = true }`

No paid shapes are referenced — Terraform will error before creating anything outside Free Tier.

## Network Ports Open (per account)

| Port | Protocol | Service |
|------|----------|---------|
| 22 | TCP | SSH (restrict to your IP) |
| 4646 | TCP | Nomad RPC |
| 4647 | TCP | Nomad Serf |
| 4648 | TCP | Nomad Serf UDP |
| 8300 | TCP | Consul RPC |
| 8301 | TCP/UDP | Consul LAN gossip |
| 8500 | TCP | Consul HTTP UI |
| 8200 | TCP | Vault |
| Service port | TCP | Per-account service |
