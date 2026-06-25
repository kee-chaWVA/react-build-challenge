IMAGE=react_build_challenge

# Build the container image
build:
	podman build  --no-cache -t $(IMAGE) .

# Run the container (dev mode)
run:
	podman run --rm -it \
		-p 5173:5173 \
		-v $$(pwd):/app:Z \
		-v /app/node_modules \
		$(IMAGE)

# Build + run (one command)
dev: build run