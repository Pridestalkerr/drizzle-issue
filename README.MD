## setup (clone, install, postgresql container)

```
git clone ...
pnpm i
mkdir pgdata
sudo chown -R 1001:1001 pgdata
docker-compose up -d
```

## run

```
pnpm run gen
pnpm run apply
```
