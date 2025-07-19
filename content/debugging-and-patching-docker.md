+++
title = "debugging and patching docker"
date = 2020-02-29
[taxonomies]
tags = ["patching", "debugging", "docker"]
categories = ["notes"]
+++
Containerization of software and services allows easy deployment, portability and many other benefits. Docker is one of wide-spread adopted technology used for containerization. I use docker while on work. There are many guide and articles about using and debugging docker. Here is my guide for debugging and patching docker. And link to [resources](#Resources).

# Terminologies.

- Docker: software used for containerization.
- Image: snapshot of container.
- Container: running instance of image.

# Information Gathering.

The first stage of any debugging session is gathering information. Skipping this steps may lead to spending hours on issue which may have been resolved in minutes.

## Container inspection.

- Get all running container.

```bash
user@host$ docker ps
```

- List all containers (running, created, exited, ...).

```bash
user@host$ docker ps -a
```

- Filter container list (say status=exited).

```bash
user@host$ docker ps -a -f "status=exited"
```

- Get container logs.

```bash
user@host$ docker logs "$container_name"
```

- Get more information on the container.

```bash
user@host$ docker container inspect "$container_name"
```

## Images inspection.

- List all docker images.

```bash
user@host$ docker images
```

- Get more information on the image.

```bash
user@host$ docker image inspect "$image_name":"$image_tag"
```

## Format output into JSON.

- Get names of exited container.

```bash
user@host$ docker ps -a -f "status=exited" --format "{{json .Names}}"
```

# Live Debugging.

Once information is gathered, we may need to tweak the container or live-debug. Most of these cases may require us to get a shell on the docker. The method of getting a shell may differ based on weather docker is running or docker has exited.

## Docker is running.

- Exec into the shell (bash or sh or other shell).

```bash
user@host$ docker exec -it "$container_name" /bin/sh
```

- Run command `ls ./`.

```bash
user@host$ docker exec -t "$container_name" ls ./
```

## Docker has exited.

- Get image, tag pair for exited container.

```bash
user@host$ docker ps -f "name=$container_name" --format "{{json .Image}}"
```

- Run image to get shell.

```bash
user@host$ docker run -it --entrypoint sh "$image_name":"$image_tag"
```

- Run command `ls ./`.

```bash
user@host$ docker run -it --entrypoint ls "$image_name":"$image_tag" ./
```

# Post Debugging.

After figuring out the issue, You may want to patch the environment or rollback and also do some basic cleanup. Rollback would be to tag previous tag to latest. In case previous tag is not available (as it is first deployment) or the version has some specific changes which cannot be reverted and patch release may take time, then docker needs to be patched.

## Rollback.

- Tag latest to previous version

```bash
user@host$ docker tag "$image_name":"$image_previous_tag" "$image_name":latest
```

## Patch.

Patching depends on the method used for debugging. In case of running container you can just commit it. For exited container which was run using custom entry point, entry point is overwritten. So the patching required to revert the entry point.

### Docker was exec-ed.

- Commit the live-debugging container.

```bash
user@host$ docker container commit "$container_name" "$image_name":"$image_tag"-patched
```

- Kill the live-debugging container

```bash
user@host$ docker container kill "$container_name"
```

- Tag the patched version to latest.

```bash
user@host$ docker tag "$image_name":"$image_tag"-patched "$image_name":latest
```

- Bring the latest service docker up.

### Docker was exec-ed (entry point has changed).

- Find the old entry point

```bash
user@host$ docker image inspect "$image_name":"$image_tag" --format "Entrypoint {{json .Config.Entrypoint}}"
```

- Find the old cmd

```bash
user@host$ docker image inspect "$image_name":"$image_tag" --format "CMD {{json .Config.Cmd}}"
```

- Commit the docker with the old entry point and cmd

```bash
user@host$ docker container commit -change="$old_entrypoint" --change="$old_cmd" "$container_name" "$image_name":"$image_tag"-patched
```

- Kill the live-debugging container

```bash
user@host$ docker container kill "$container_name"
```

- Tag the patched version to latest.

```bash
user@host$ docker tag "$image_name":"$image_tag"-patched "$image_name":latest
```

- Bring the latest service docker up.

# Cleaning up.

- Delete exited container. You can use -q instead of --format flag part for getting only ids.

```bash
user@host$ docker ps -a -f "status=exited" --format "{{json .Names}}" | xargs -r docker rm
```

- Delete untagged images.

```bash
user@host$ docker images prune
```

# Tips.

- Using `-q` for quiet mode on command provides only image ids or container ids. 
- Using `docker cp` can help in file transfer to and from container.
    - `docker cp  "$container_name":"$container_file_path" "local_file_path"` -> from
        container.
    - `docker cp  "local_file_path" "$container_name":"$container_file_path" ` -> to 
        container.

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

