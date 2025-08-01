# Install dependencies using uv package manager
install:
	@command -v uv >/dev/null 2>&1 || { echo "uv is not installed. Installing uv..."; curl -LsSf https://astral.sh/uv/0.6.12/install.sh | sh; source $HOME/.local/bin/env; }
	uv sync --dev --extra jupyter && npm --prefix frontend install

# Start the ADK API server and React frontend development server simultaneously
dev:
	make dev-backend & make dev-frontend

# Start the ADK API server
dev-backend:
	ALLOW_ORIGINS="*" uv run uvicorn app.server:app --host 0.0.0.0 --port 8000 --reload

# Start the React frontend development server
dev-frontend:
	npm --prefix frontend run dev

# Launch local dev playground
playground:
	@echo "==============================================================================="
	@echo "| 🚀 Starting your agent playground...                                        |"
	@echo "|                                                                             |"
	@echo "| 💡 Try asking: A report on the latest Google I/O event                      |"
	@echo "|                                                                             |"
	@echo "| 🔍 IMPORTANT: Select the 'app' folder to interact with your agent.          |"
	@echo "==============================================================================="
	uv run adk web --port 8501

# Deploy the agent remotely
# Usage: make backend [IAP=true] [PORT=8080] - Set IAP=true to enable Identity-Aware Proxy, PORT to specify container port
backend:
	PROJECT_ID=$$(gcloud config get-value project) && \
	gcloud beta run deploy onemind \
		--source . \
		--memory "4Gi" \
		--project $$PROJECT_ID \
		--region "us-central1" \
		--no-allow-unauthenticated \
		--labels "created-by=adk" \
		--set-env-vars \
		"COMMIT_SHA=$(shell git rev-parse HEAD)" \
		$(if $(IAP),--iap) \
		$(if $(PORT),--port=$(PORT))

# Launch local development server with hot-reload
local-backend:
	uv run uvicorn app.server:app --host 0.0.0.0 --port 8000 --reload

# Set up development environment resources using Terraform
setup-dev-env:
	PROJECT_ID=$$(gcloud config get-value project) && \
	(cd deployment/terraform/dev && terraform init && terraform apply --var-file vars/env.tfvars --var dev_project_id=$$PROJECT_ID --auto-approve)

# Run unit and integration tests
test:
	uv run pytest tests/unit && uv run pytest tests/integration

# Run code quality checks (codespell, ruff, mypy)
lint:
	uv run codespell
	uv run ruff check . --diff
	uv run ruff format . --check --diff
	uv run mypy .
