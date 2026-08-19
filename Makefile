# L'Invisithèque - UI prototype
# Development shortcuts. The code lives in ./prototype

APP_DIR := prototype
PORT ?= 3000

.DEFAULT_GOAL := help
.PHONY: help run dev build start lint check install clean reset

help: ## Show this help
	@echo "L'Invisitheque - prototype"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[1m%-10s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "  Variable: PORT=$(PORT) (e.g. make run PORT=4000)"

run: install ## Start the prototype in development mode (http://localhost:3000)
	cd $(APP_DIR) && npm run dev -- --port $(PORT)

dev: run ## Alias for "make run"

build: install ## Build the production version
	cd $(APP_DIR) && npm run build

start: build ## Build, then serve the production version
	cd $(APP_DIR) && npm run start -- --port $(PORT)

lint: install ## Check the code (ESLint)
	cd $(APP_DIR) && npm run lint

check: install ## Check types (TypeScript), then lint
	cd $(APP_DIR) && npx tsc --noEmit
	cd $(APP_DIR) && npm run lint

install: $(APP_DIR)/node_modules ## Install dependencies if needed

$(APP_DIR)/node_modules: $(APP_DIR)/package.json
	cd $(APP_DIR) && npm install
	@touch $(APP_DIR)/node_modules

clean: ## Remove the build cache
	rm -rf $(APP_DIR)/.next

reset: clean ## Also remove installed dependencies
	rm -rf $(APP_DIR)/node_modules
