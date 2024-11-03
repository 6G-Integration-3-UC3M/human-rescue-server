.PHONY: all
all: run

.PHONY: run
run:
	@echo "Running the server..."
	@pnpm dev

.PHONY: run_public
run_public:
	@echo "Running the server..."
	@pnpm dev_public

.PHONY: init
init:
	@echo "Installing dependencies..."
	@pnpm install
	@pnpm prisma generate
	@pnpm prisma db push --force-reset
	@pnpm prisma db seed
	@echo "Done!"
