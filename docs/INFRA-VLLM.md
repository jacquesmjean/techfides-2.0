# vLLM Deployment Guide

This document explains how to deploy a self-hosted vLLM instance to serve local LLMs (Llama 3.3, Mistral, Phi) for the TechFides Velocity Engine.

## Why vLLM (vs Ollama)?

| Feature | vLLM | Ollama |
|---|---|---|
| Throughput | 10-20x higher (PagedAttention, continuous batching) | Single request |
| Production-ready | Yes — used in hyperscaler stacks | No — dev tool |
| OpenAI API compat | Yes (drop-in) | Yes |
| Multi-GPU | Yes | No |
| Quantization | Yes (AWQ, GPTQ, FP8) | Yes |

**Recommendation:** vLLM for production, Ollama for laptop dev.

## Hardware Requirements

| Model | Min GPU | Recommended | RAM |
|---|---|---|---|
| Llama 3.3 70B (FP16) | 2x A100 80GB | 2x H100 80GB | 160 GB |
| Llama 3.3 70B (AWQ 4-bit) | 1x A100 80GB | 1x H100 80GB | 40 GB |
| Mistral 7B | 1x A10 24GB | 1x A100 40GB | 16 GB |
| Phi-3 14B | 1x A10 24GB | 1x A100 40GB | 28 GB |

**Cost estimate (cloud):**
- 1x A100 80GB: ~$1,500/mo
- 2x A100 80GB: ~$3,000/mo
- vs Azure OpenAI GPT-4: $0.03/1K input tokens — local wins above ~50M tokens/month

## Deployment (Docker)

```bash
docker run --gpus all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  -p 8000:8000 \
  --env "HUGGING_FACE_HUB_TOKEN=hf_xxx" \
  --ipc=host \
  vllm/vllm-openai:latest \
  --model meta-llama/Llama-3.3-70B-Instruct \
  --tensor-parallel-size 2 \
  --max-model-len 8192 \
  --api-key "your-vllm-api-key"
```

## Environment Variables

Add to `.env.local`:

```
VLLM_BASE_URL="https://vllm.techfides.internal/v1"
VLLM_API_KEY="your-vllm-api-key"
VLLM_MODEL="meta-llama/Llama-3.3-70B-Instruct"
VLLM_MOCK_MODE="false"
```

## Health Check

```bash
curl https://vllm.techfides.internal/v1/models \
  -H "Authorization: Bearer $VLLM_API_KEY"
```

## Reverse Proxy (Nginx)

Put vLLM behind Nginx for TLS termination, rate limiting, and request logging:

```nginx
server {
  listen 443 ssl http2;
  server_name vllm.techfides.internal;

  ssl_certificate /etc/ssl/techfides.crt;
  ssl_certificate_key /etc/ssl/techfides.key;

  location / {
    proxy_pass http://localhost:8000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_read_timeout 300s;
  }
}
```

## Monitoring

vLLM exposes Prometheus metrics at `/metrics`. Scrape with Prometheus and visualize in Grafana:

- `vllm:num_requests_running` — concurrent requests
- `vllm:num_requests_waiting` — queue depth
- `vllm:gpu_cache_usage_perc` — KV cache utilization
- `vllm:time_to_first_token_seconds` — TTFT histogram
- `vllm:e2e_request_latency_seconds` — end-to-end latency

## Mock Mode (Dev)

When developing without GPU access, set `VLLM_MOCK_MODE=true`. The client at `src/lib/velocity/llm/client.ts` returns deterministic stub responses so the rest of the pipeline can be built and tested.
