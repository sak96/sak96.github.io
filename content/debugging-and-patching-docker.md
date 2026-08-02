+++
title = "Docker Debugging & Patching Simplified"
date = 2020-02-29
[taxonomies]
tags = ["docker", "debugging", "tutorial"]
categories = ["devtools"]
[extra]
github_issue = 3
+++

Containerization technologies like Docker enable efficient deployment, portability, and scalability.
This guide provides a structured approach to debugging and patching Docker containers, emphasizing technical precision and operational clarity.
<!-- more -->

## Terminologies

- **Docker**: A platform for containerizing applications using images.
- **Image**: A lightweight, standalone self-contained executable that contains everything needed to run a application.
- **Container**: A running instance of an image, isolated from other containers.

## Information Gathering

### Container Inspection

- **List running containers**:
  ```bash
  docker ps
  ```
- **List all containers (including exited)**:
  ```bash
  docker ps -a
  ```
- **Filter by status** (e.g., exited):
  ```bash
  docker ps -a -f "status=exited"
  ```
- **Retrieve container logs**:
  ```bash
  docker logs <container_name>
  ```
- **Inspect container details**:
  ```bash
  docker container inspect <container_name>
  ```

### Image Inspection

- **List all images**:
  ```bash
  docker images
  ```
- **Inspect image details**:
  ```bash
  docker image inspect <image_name>:<image_tag>
  ```

### Output Formatting

- **Extract exited container names**:
  ```bash
  docker ps -a -f "status=exited" --format "{{json .Names}}"
  ```

---

## Live Debugging

### Docker is Running

- **Enter container shell**:
  ```bash
  docker exec -it <container_name> /bin/sh
  ```
- **List container contents**:
  ```bash
  docker exec -t <container_name> ls ./
  ```

### Docker Has Exited

- **Retrieve image and tag**:
  ```bash
  docker ps -f "name=<container_name>" --format "{{json .Image}}"
  ```
- **Run container with shell**:
  ```bash
  docker run -it --entrypoint sh <image_name>:<image_tag>
  ```
- **Execute command**:
  ```bash
  docker run -it --entrypoint ls <image_name>:<image_tag> ./
  ```

## Post Debugging

### Rollback

- **Revert to previous tag**:
  ```bash
  docker tag <image_name>:<previous_tag> <image_name>:latest
  ```

### Patching

- **Commit live-debugging container**:
  ```bash
  docker container commit <container_name> <image_name>:<patched_tag>
  ```
- **Kill container**:
  ```bash
  docker container kill <container_name>
  ```
- **Tag patched version**:
  ```bash
  docker tag <image_name>:<patched_tag> <image_name>:latest
  ```
- **Restart service**:
  ```bash
  docker restart <service_name>
  ```

### Docker with Changed Entry Point

- **Retrieve old entry point**:
  ```bash
  docker image inspect <image_name>:<tag> --format "Entrypoint {{json .Config.Entrypoint}}"
  ```
- **Retrieve old command**:
  ```bash
  docker image inspect <image_name>:<tag> --format "CMD {{json .Config.Cmd}}"
  ```
- **Commit with old configuration**:
  ```bash
  docker container commit -change "<old_entrypoint>" -change "<old_cmd>" <container_name> <image_name>:<patched_tag>
  ```
- **Kill container**:
  ```bash
  docker container kill <container_name>
  ```
- **Tag patched version**:
  ```bash
  docker tag <image_name>:<patched_tag> <image_name>:latest
  ```
- **Restart service**:
  ```bash
  docker restart <service_name>
  ```

## Cleaning Up

- **Remove exited containers**:
  ```bash
  docker ps -a -f "status=exited" --format "{{json .Names}}" | xargs -r docker rm
  ```
- **Prune unused images**:
  ```bash
  docker images prune
  ```

## Tips

- **Use `--q` for quiet mode**:
  ```bash
  docker ps --q
  ```
- **Transfer files between container and host**:
  ```bash
  docker cp <container_name>:<path> <local_path>
  ```
  - **From container**:
    ```bash
    docker cp <container_name>:<path> <local_path>
    ```
  - **To container**:
    ```bash
    docker cp <local_path> <container_name>:<path>
    ```

## Conclusion

Effective Docker debugging and patching requires systematic analysis, precise command execution, and careful cleanup. This guide provides a structured approach to identify issues, resolve them, and maintain containerized environments with reliability and efficiency.

# Resources.

- [`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/)
- [`docker images`](https://docs.docker.com/engine/reference/commandline/images/)
- [`docker image inspect`](https://docs.docker.com/engine/reference/commandline/image_inspect/)
- [`docker container inspect`](https://docs.docker.com/engine/reference/commandline/container_inspect/)
- [`docker logs`](https://docs.docker.com/engine/reference/commandline/logs/)
- [`docker container exec`](https://docs.docker.com/engine/reference/commandline/container_exec/)
- [`docker run`](https://docs.docker.com/engine/reference/commandline/run/)
- [`docker container commit`](https://docs.docker.com/engine/reference/commandline/container_commit/)
- [`docker image prune`](https://docs.docker.com/engine/reference/commandline/image_prune/)
- [`--format`](https://docs.docker.com/config/formatting/)
- [`docker cp`](https://docs.docker.com/engine/reference/commandline/cp/)

