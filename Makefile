# Makefile — Taskify (AdonisJS + Inertia + Postgres)
# Usage: make up | make logs | make migrate | make seed | etc.

SHELL := /bin/sh

COMPOSE := docker compose
APP := app
DB := postgres

.DEFAULT_GOAL := help

help: ## Affiche l'aide
	@printf "\nCommands:\n"
	@grep -E '^[a-zA-Z0-9_.-]+:.*##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*##"}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@printf "\n"

# -----------------------
# Docker / Compose (DEV)
# -----------------------

up: ## Démarre les services (dev)
	$(COMPOSE) up

up-build: ## Démarre les services (dev) en rebuildant les images
	$(COMPOSE) up -d --build

down: ## Stoppe les services
	$(COMPOSE) down

destroy: ## Stoppe et supprime volumes (⚠️ reset DB)
	$(COMPOSE) down -v

ps: ## Liste les containers
	$(COMPOSE) ps

logs: ## Logs (tous les services)
	$(COMPOSE) logs -f

logs-app: ## Logs (app)
	$(COMPOSE) logs -f $(APP)

logs-db: ## Logs (postgres)
	$(COMPOSE) logs -f $(DB)

restart: ## Redémarre les services
	$(COMPOSE) restart

# -----------------------
# Shell / NPM / Node
# -----------------------

sh: ## Ouvre un shell dans le container app
	$(COMPOSE) exec $(APP) sh

node: ## Lance node dans le container app (ex: make node ARGS="--version")
	$(COMPOSE) exec $(APP) node $(ARGS)

npm: ## Lance npm dans le container app (ex: make npm ARGS="run lint")
	$(COMPOSE) exec $(APP) npm $(ARGS)

# -----------------------
# Adonis / Ace
# -----------------------

ace: ## Lance une commande ace (ex: make ace ARGS="list:routes")
	$(COMPOSE) exec $(APP) node ace $(ARGS)

key: ## Génère une APP_KEY (affiche la valeur)
	$(COMPOSE) exec $(APP) node ace generate:key

routes: ## Affiche les routes
	$(COMPOSE) exec $(APP) node ace list:routes

# -----------------------
# DB / Migrations / Seeds
# -----------------------

migrate: ## Lance les migrations
	$(COMPOSE) exec $(APP) node ace migration:run

migrate-rollback: ## Rollback dernière batch
	$(COMPOSE) exec $(APP) node ace migration:rollback

migrate-refresh: ## Rollback puis re-run toutes les migrations
	$(COMPOSE) exec $(APP) node ace migration:refresh

seed: ## Lance les seeders
	$(COMPOSE) exec $(APP) node ace db:seed

# -----------------------
# Postgres utils
# -----------------------

db-shell: ## Ouvre psql dans le container postgres
	$(COMPOSE) exec $(DB) psql -U $${DB_USER:-taskify} -d $${DB_DATABASE:-taskify}

db-url: ## Affiche une DATABASE_URL compatible (copiable)
	@printf "postgresql://%s:%s@localhost:%s/%s\n" "$${DB_USER:-taskify}" "$${DB_PASSWORD:-taskify}" "$${DB_PORT_FORWARD:-5432}" "$${DB_DATABASE:-taskify}"

# -----------------------
# PROD build (image)
# -----------------------

build-prod: ## Build l'image prod (target prod)
	docker build -t taskify:latest --target prod .

run-prod: ## Run l'image prod localement (nécessite .env sur host)
	docker run --rm -p 3333:3333 --env-file .env taskify:latest
